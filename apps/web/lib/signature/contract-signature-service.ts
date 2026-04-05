import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import appConfig from '~/config/app.config';
import {
  ContractService,
  type ContractPartyInput,
  type ContractTransactionInput,
} from '~/lib/services/contract-service';

import {
  DocuSignClient,
  DocuSignNotConfiguredError,
} from './docusign-client';

/**
 * Orchestrator: generate the contract PDF, upload it to the private
 * contracts bucket, create a DocuSign envelope, and persist the resulting
 * ids + statuses on marketplace_transactions.
 *
 * This sits between the server action and the two lower-level services so
 * the action stays thin and the flow is easy to re-run from any trigger
 * (retry, cron, manual).
 */

export const CONTRACTS_BUCKET = 'contracts';

export interface SendForSignatureOptions {
  /** Must be an admin client (service role) — writes bypass RLS and the
   * storage bucket has no authenticated INSERT policy. */
  adminClient: SupabaseClient;
  transactionId: string;
}

export interface SendForSignatureResult {
  contractId: string;
  envelopeId: string;
  pdfPath: string;
  status: string;
}

interface TransactionRow {
  id: string;
  buyer_account_id: string;
  seller_account_id: string;
  currency: string;
  total_amount: number;
  transport_amount: number | null;
  status: string;
  contract_status: string | null;
  signature_envelope_id: string | null;
  listings: {
    id: string;
    title: string;
    quantity: number;
    unit: string;
    material_categories: { name_fr: string; name: string } | null;
    location_city: string | null;
    location_country: string | null;
  } | null;
}

interface AccountRow {
  id: string;
  name: string;
  email: string | null;
  picture_url: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const any = (c: SupabaseClient) => c as any;

async function loadTransaction(
  client: SupabaseClient,
  transactionId: string,
): Promise<TransactionRow> {
  const { data, error } = await any(client)
    .from('marketplace_transactions')
    .select(
      `id, buyer_account_id, seller_account_id, currency, total_amount,
       transport_amount, status, contract_status, signature_envelope_id,
       listings:listing_id (
         id, title, quantity, unit, location_city, location_country,
         material_categories:category_id ( name, name_fr )
       )`,
    )
    .eq('id', transactionId)
    .single();

  if (error || !data) {
    throw new Error(
      `Transaction ${transactionId} introuvable: ${error?.message ?? 'inconnu'}`,
    );
  }
  return data as TransactionRow;
}

async function loadAccount(
  client: SupabaseClient,
  accountId: string,
): Promise<AccountRow> {
  const { data, error } = await any(client)
    .from('accounts')
    .select('id, name, email, picture_url')
    .eq('id', accountId)
    .single();

  if (error || !data) {
    throw new Error(
      `Compte ${accountId} introuvable: ${error?.message ?? 'inconnu'}`,
    );
  }
  return data as AccountRow;
}

function toVolumeTonnes(quantity: number, unit: string | null): number {
  if (!unit) return quantity / 1000;
  const u = unit.toLowerCase();
  if (u === 'tonnes' || u === 't' || u === 'tonne') return quantity;
  if (u === 'kg' || u === 'kilogramme' || u === 'kilogrammes') {
    return quantity / 1000;
  }
  return quantity / 1000;
}

function buildPartyInput(account: AccountRow): ContractPartyInput {
  return {
    id: account.id,
    name: account.name,
    email: account.email ?? '',
    legal_name: account.name,
    siret: null,
    address: null,
    contact_name: account.name,
  };
}

function buildTransactionInput(
  row: TransactionRow,
): ContractTransactionInput {
  const listing = row.listings;
  const quantity = Number(listing?.quantity ?? 0);
  const volume = toVolumeTonnes(quantity, listing?.unit ?? null);
  // total_amount is in cents, minus transport, divided by volume = per-tonne
  const materialCents =
    Number(row.total_amount) - Number(row.transport_amount ?? 0);
  const pricePerTonne =
    volume > 0 ? materialCents / 100 / volume : materialCents / 100;

  return {
    id: row.id,
    material_category:
      listing?.material_categories?.name_fr ??
      listing?.material_categories?.name ??
      'Matiere recyclable',
    volume_tonnes: volume,
    price_per_tonne: pricePerTonne,
    currency: row.currency,
    origin_region: listing?.location_city
      ? `${listing.location_city}${listing.location_country ? `, ${listing.location_country}` : ''}`
      : null,
    destination_region: null,
    delivery_date: null,
    transport_by: null,
  };
}

export const ContractSignatureService = {
  /**
   * Generate the contract PDF, upload to storage, create the envelope.
   * Safe to retry: when a transaction already has an envelope we throw
   * rather than create a duplicate.
   */
  async sendForSignature({
    adminClient,
    transactionId,
  }: SendForSignatureOptions): Promise<SendForSignatureResult> {
    if (!DocuSignClient.isConfigured()) {
      throw new DocuSignNotConfiguredError(
        'DocuSign n\'est pas configure sur cet environnement.',
      );
    }

    const tx = await loadTransaction(adminClient, transactionId);

    if (tx.status !== 'paid' && tx.status !== 'delivered') {
      throw new Error(
        `La transaction doit etre payee avant d'envoyer le contrat (statut actuel: ${tx.status}).`,
      );
    }

    if (tx.signature_envelope_id) {
      throw new Error(
        `Un contrat a deja ete envoye pour cette transaction (envelope ${tx.signature_envelope_id}).`,
      );
    }

    const [seller, buyer] = await Promise.all([
      loadAccount(adminClient, tx.seller_account_id),
      loadAccount(adminClient, tx.buyer_account_id),
    ]);

    if (!seller.email || !buyer.email) {
      throw new Error(
        "Le vendeur ou l'acheteur n'a pas d'adresse email — impossible d'envoyer le contrat.",
      );
    }

    const sellerParty = buildPartyInput(seller);
    const buyerParty = buildPartyInput(buyer);
    const txInput = buildTransactionInput(tx);

    const generated = ContractService.generate(
      txInput,
      sellerParty,
      buyerParty,
    );

    // Upload the unsigned PDF to the private contracts bucket. Use the admin
    // client so RLS is bypassed — the bucket has no authenticated INSERT
    // policy on purpose.
    const storagePath = generated.storagePath;
    const uploadRes = await adminClient.storage
      .from(CONTRACTS_BUCKET)
      .upload(storagePath, generated.pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadRes.error) {
      throw new Error(
        `Upload du contrat echoue: ${uploadRes.error.message}`,
      );
    }

    const webhookUrl = `${appConfig.url}/api/webhooks/docusign`;

    let envelope;
    try {
      envelope = await DocuSignClient.createEnvelopeForContract({
        contractId: generated.contractId,
        emailSubject: `Contrat ${generated.contractId} — ${txInput.material_category} ${txInput.volume_tonnes}t`,
        emailBlurb: `Veuillez signer le contrat de vente de ${txInput.volume_tonnes} tonnes de ${txInput.material_category} via la plateforme GreenEcoGenius.`,
        pdfBuffer: generated.pdfBuffer,
        seller: {
          email: seller.email,
          name: seller.name,
          anchorX: 30,
          anchorY: 150,
        },
        buyer: {
          email: buyer.email,
          name: buyer.name,
          anchorX: 120,
          anchorY: 150,
        },
        webhookUrl,
      });
    } catch (err) {
      // Clean up the orphan PDF if envelope creation fails so retries don't
      // leave stale files in storage.
      await adminClient.storage
        .from(CONTRACTS_BUCKET)
        .remove([storagePath])
        .catch(() => undefined);
      throw err;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    const { error: updateError } = await any(adminClient)
      .from('marketplace_transactions')
      .update({
        contract_id: generated.contractId,
        contract_status: 'pending_signatures',
        contract_pdf_path: storagePath,
        signature_envelope_id: envelope.envelopeId,
        signature_provider: 'docusign',
        contract_sent_at: new Date().toISOString(),
        contract_expires_at: expiresAt.toISOString(),
      })
      .eq('id', transactionId);

    if (updateError) {
      throw new Error(
        `Contrat envoye a DocuSign (${envelope.envelopeId}) mais la mise a jour de la transaction a echoue: ${updateError.message}`,
      );
    }

    return {
      contractId: generated.contractId,
      envelopeId: envelope.envelopeId,
      pdfPath: storagePath,
      status: envelope.status,
    };
  },

  /** Short-lived signed URL for any contract PDF in the private bucket. */
  async getSignedUrl(
    client: SupabaseClient,
    path: string | null | undefined,
    expiresInSeconds = 3600,
  ): Promise<string | null> {
    if (!path) return null;
    try {
      const { data, error } = await client.storage
        .from(CONTRACTS_BUCKET)
        .createSignedUrl(path, expiresInSeconds);
      if (error || !data) return null;
      return data.signedUrl;
    } catch {
      return null;
    }
  },
};
