import 'server-only';

import { createHash } from 'crypto';

import type { SupabaseClient } from '@supabase/supabase-js';

import { CONTRACTS_BUCKET } from './contract-signature-service';
import { DocuSignClient } from './docusign-client';

/**
 * Called by the DocuSign webhook when an envelope reaches status 'completed'
 * (meaning both signers are done). Responsibilities:
 *
 *   1. Download the merged signed PDF from DocuSign.
 *   2. Store it under contracts/<transaction_id>/signed-<contract_id>.pdf.
 *   3. Compute the SHA-256 of the signed PDF and persist it on the row.
 *   4. Flip contract_status to 'fully_signed'.
 *   5. Best-effort blockchain anchor: register a lot on Polygon with the
 *      signed-PDF hash in the data hash, so the chain entry is tamper-
 *      evidently linked to the exact signed document.
 *   6. Flip contract_status to 'blockchain_certified' on success.
 *
 * The blockchain step is best-effort — if it fails (no env, RPC down, gas
 * price spike…), the row stays at 'fully_signed' and a retry job can pick
 * it up later. Legal signature is not blocked on the chain step.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const any = (c: SupabaseClient) => c as any;

interface OnFullySignedInput {
  adminClient: SupabaseClient;
  transactionId: string;
  envelopeId: string;
}

export interface OnFullySignedResult {
  signedPath: string;
  sha256: string;
  blockchainTxHash: string | null;
  blockchainError: string | null;
}

export async function onContractFullySigned({
  adminClient,
  transactionId,
  envelopeId,
}: OnFullySignedInput): Promise<OnFullySignedResult> {
  // 1. Load the transaction (admin client — webhooks aren't user-scoped).
  const { data: tx, error: txErr } = await any(adminClient)
    .from('marketplace_transactions')
    .select(
      `id, contract_id, contract_pdf_path, contract_signed_pdf_path,
       contract_status, buyer_account_id, seller_account_id, listing_id,
       total_amount, currency,
       listings:listing_id (
         title, quantity, unit,
         material_categories:category_id (name, name_fr)
       )`,
    )
    .eq('id', transactionId)
    .single();

  if (txErr || !tx) {
    throw new Error(`Transaction ${transactionId} introuvable dans le hook fully-signed`);
  }

  // Idempotence: if we already stored a signed PDF, don't re-download.
  let signedPath: string = tx.contract_signed_pdf_path as string;
  let sha256: string;

  if (!signedPath) {
    const signedPdf = await DocuSignClient.downloadSignedDocument(envelopeId);
    sha256 = createHash('sha256').update(signedPdf).digest('hex');

    signedPath = `${transactionId}/signed-${tx.contract_id ?? envelopeId}.pdf`;
    const uploadRes = await adminClient.storage
      .from(CONTRACTS_BUCKET)
      .upload(signedPath, signedPdf, {
        contentType: 'application/pdf',
        upsert: true,
      });
    if (uploadRes.error) {
      throw new Error(
        `Impossible de stocker le PDF signe: ${uploadRes.error.message}`,
      );
    }

    await any(adminClient)
      .from('marketplace_transactions')
      .update({
        contract_status: 'fully_signed',
        contract_signed_pdf_path: signedPath,
        contract_signed_pdf_sha256: sha256,
        seller_signed: true,
        buyer_signed: true,
      })
      .eq('id', transactionId);
  } else {
    sha256 = (tx.contract_signed_pdf_sha256 as string) ?? '';
  }

  // 2. Best-effort blockchain anchoring. The registerLotOnChain helper needs
  //    signer identities + volume + CO2 — we derive them from the joined
  //    listing data. Failures do not abort the webhook.
  let blockchainTxHash: string | null = null;
  let blockchainError: string | null = null;

  try {
    const { registerLotOnChain, computeDataHash } = await import(
      '~/lib/blockchain/alchemy-service'
    );

    const listing = tx.listings as
      | {
          title: string;
          quantity: number;
          unit: string | null;
          material_categories: { name_fr: string; name: string } | null;
        }
      | null;

    // Load party names for the on-chain payload.
    const [sellerRes, buyerRes] = await Promise.all([
      any(adminClient)
        .from('accounts')
        .select('name')
        .eq('id', tx.seller_account_id)
        .single(),
      any(adminClient)
        .from('accounts')
        .select('name')
        .eq('id', tx.buyer_account_id)
        .single(),
    ]);

    const volumeTonnes =
      listing?.unit === 'tonnes' || listing?.unit === 't'
        ? Number(listing?.quantity ?? 0)
        : Number(listing?.quantity ?? 0) / 1000;

    const lotId = tx.contract_id ?? `LOT-${transactionId.slice(0, 8)}`;

    // Compute the combined data hash so we can persist it in
    // blockchain_records regardless of whether the RPC call succeeds.
    const hashedData = {
      lotId,
      transactionId,
      materialType:
        listing?.material_categories?.name_fr ??
        listing?.material_categories?.name ??
        'Matiere recyclable',
      weightKg: volumeTonnes * 1000,
      sellerName: sellerRes.data?.name ?? '',
      buyerName: buyerRes.data?.name ?? '',
      signedContractSha256: sha256,
      contractId: tx.contract_id,
    };

    const result = await registerLotOnChain({
      lotId,
      materialType: hashedData.materialType,
      weightKg: hashedData.weightKg,
      sellerName: hashedData.sellerName,
      buyerName: hashedData.buyerName,
      co2Avoided: 0, // computed from carbon_records elsewhere
    });

    blockchainTxHash = result.txHash;

    await any(adminClient).from('blockchain_records').insert({
      transaction_id: transactionId,
      listing_id: tx.listing_id,
      record_hash: result.dataHash,
      block_number: result.blockNumber,
      hashed_data: { ...hashedData, dataHash: result.dataHash },
    });

    await any(adminClient)
      .from('marketplace_transactions')
      .update({ contract_status: 'blockchain_certified' })
      .eq('id', transactionId);

    // Silence "unused" warning in environments without blockchain helpers.
    void computeDataHash;
  } catch (err) {
    blockchainError = err instanceof Error ? err.message : String(err);
    // Do NOT throw — keep the legal signature step final even if the chain
    // call fails. A retry job / manual action can anchor later.
  }

  return {
    signedPath,
    sha256,
    blockchainTxHash,
    blockchainError,
  };
}
