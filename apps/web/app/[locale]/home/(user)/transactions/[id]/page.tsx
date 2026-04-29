import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSignature,
  ShieldCheck,
} from 'lucide-react';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody, PageHeader } from '@kit/ui/page';

import { ContractSignatureService } from '~/lib/signature/contract-signature-service';

import { SendForSignatureButton } from './_components/send-for-signature-button';
import { SignatureStatusRow } from './_components/signature-status-row';

const any_ = (v: unknown) => v as any;

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  return { title: `Transaction ${id.slice(0, 8)}` };
}

interface TransactionView {
  id: string;
  buyer_account_id: string;
  seller_account_id: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  contract_id: string | null;
  contract_status: string | null;
  contract_pdf_path: string | null;
  contract_signed_pdf_path: string | null;
  contract_sent_at: string | null;
  contract_expires_at: string | null;
  signature_envelope_id: string | null;
  seller_signed: boolean;
  buyer_signed: boolean;
  seller_signed_at: string | null;
  buyer_signed_at: string | null;
  listings: {
    title: string;
    quantity: number;
    unit: string | null;
    material_categories: { name_fr: string; name: string } | null;
  } | null;
}

function contractStatusBadge(status: string | null) {
  const map: Record<string, { label: string; className: string }> = {
    not_started: {
      label: 'Contrat non genere',
      className: 'bg-[#12472F] text-[#B8D4E3] border-[#1A5C3E]',
    },
    contract_generated: {
      label: 'Contrat genere',
      className: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
    },
    pending_signatures: {
      label: 'En attente de signature',
      className: 'bg-amber-900/20 text-amber-400 border-amber-500/30',
    },
    seller_signed: {
      label: 'Vendeur a signe',
      className: 'bg-amber-900/20 text-amber-400 border-amber-500/30',
    },
    buyer_signed: {
      label: 'Acheteur a signe',
      className: 'bg-amber-900/20 text-amber-400 border-amber-500/30',
    },
    fully_signed: {
      label: 'Signe par les deux parties',
      className: 'bg-[#1A5C3E] text-[#008F5A] border-[#8FDAB5]',
    },
    blockchain_certified: {
      label: 'Certifie blockchain',
      className: 'bg-[#1A5C3E] text-[#008F5A] border-[#8FDAB5]',
    },
    cancelled: {
      label: 'Annule',
      className: 'bg-red-900/30 text-red-400 border-red-200',
    },
    expired: {
      label: 'Expire',
      className: 'bg-red-900/30 text-red-400 border-red-200',
    },
  };
  const entry = map[status ?? 'not_started'] ?? map.not_started!;
  return (
    <Badge variant="outline" className={entry.className}>
      {entry.label}
    </Badge>
  );
}

async function TransactionDetailPage({ params }: Params) {
  const { id } = await params;
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);
  if (authError || !user) {
    redirect('/auth/sign-in');
  }

  const { data: txData, error } = await any_(client)
    .from('marketplace_transactions')
    .select(
      `id, buyer_account_id, seller_account_id, status, total_amount, currency,
       created_at, contract_id, contract_status, contract_pdf_path,
       contract_signed_pdf_path, contract_sent_at, contract_expires_at,
       signature_envelope_id, seller_signed, buyer_signed,
       seller_signed_at, buyer_signed_at,
       listings:listing_id (
         title, quantity, unit,
         material_categories:category_id ( name, name_fr )
       )`,
    )
    .eq('id', id)
    .single();

  if (error || !txData) notFound();

  const tx = txData as TransactionView;

  if (
    tx.buyer_account_id !== user.id &&
    tx.seller_account_id !== user.id
  ) {
    notFound();
  }

  // Load counterparty identities (the other side of the transaction) so we
  // can render their name in the signature card.
  const { data: parties } = await any_(client)
    .from('accounts')
    .select('id, name')
    .in('id', [tx.seller_account_id, tx.buyer_account_id]);

  const partyById = new Map<string, string>();
  for (const p of (parties ?? []) as Array<{ id: string; name: string }>) {
    partyById.set(p.id, p.name);
  }

  const sellerName = partyById.get(tx.seller_account_id) ?? 'Vendeur';
  const buyerName = partyById.get(tx.buyer_account_id) ?? 'Acheteur';

  // Short-lived signed URLs for download buttons.
  const [unsignedUrl, signedUrl] = await Promise.all([
    ContractSignatureService.getSignedUrl(client, tx.contract_pdf_path),
    ContractSignatureService.getSignedUrl(client, tx.contract_signed_pdf_path),
  ]);

  const canSend =
    (tx.status === 'paid' || tx.status === 'delivered') &&
    (tx.contract_status === null || tx.contract_status === 'not_started') &&
    !tx.signature_envelope_id;

  const material =
    tx.listings?.material_categories?.name_fr ??
    tx.listings?.material_categories?.name ??
    'Matiere recyclable';

  return (
    <>
      <PageHeader
        title={`Transaction ${tx.contract_id ?? tx.id.slice(0, 8)}`}
        description={`${material} — ${tx.listings?.quantity ?? 0} ${tx.listings?.unit ?? ''}`}
      >
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <Link href="/home/marketplace">
              <ArrowLeft className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
              Retour au Comptoir
            </Link>
          }
        />
      </PageHeader>

      <PageBody>
        <div className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSignature
                    className="h-5 w-5 text-[#00A86B]"
                    strokeWidth={1.5}
                  />
                  <h2 className="text-lg font-semibold text-[#F5F5F0]">
                    Contrat de vente
                  </h2>
                </div>
                {contractStatusBadge(tx.contract_status)}
              </div>

              <div className="mb-5 grid gap-2 text-sm text-[#B8D4E3]">
                <div className="flex justify-between">
                  <span>Reference</span>
                  <span className="font-medium text-[#F5F5F0]">
                    {tx.contract_id ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Statut de paiement</span>
                  <span className="font-medium capitalize text-[#F5F5F0]">
                    {tx.status.replace(/_/g, ' ')}
                  </span>
                </div>
                {tx.contract_expires_at ? (
                  <div className="flex justify-between">
                    <span>Expire le</span>
                    <span className="font-medium text-[#F5F5F0]">
                      {new Date(tx.contract_expires_at).toLocaleDateString(
                        'fr-FR',
                      )}
                    </span>
                  </div>
                ) : null}
              </div>

              {tx.signature_envelope_id ? (
                <div className="mb-5 space-y-2">
                  <SignatureStatusRow
                    role="Vendeur"
                    name={sellerName}
                    signed={tx.seller_signed}
                    signedAt={tx.seller_signed_at}
                  />
                  <SignatureStatusRow
                    role="Acheteur"
                    name={buyerName}
                    signed={tx.buyer_signed}
                    signedAt={tx.buyer_signed_at}
                  />
                </div>
              ) : (
                <p className="mb-5 rounded-lg bg-[#12472F] p-3 text-sm text-[#7DC4A0]">
                  Aucun contrat n&apos;a encore ete genere. Une fois le
                  paiement confirme, vous pouvez generer le contrat et
                  l&apos;envoyer aux deux parties pour signature electronique
                  via DocuSign.
                </p>
              )}

              {canSend ? (
                <SendForSignatureButton transactionId={tx.id} />
              ) : null}

              {tx.contract_status === 'blockchain_certified' ? (
                <div className="flex items-center gap-2 rounded-lg border border-[#8FDAB5] bg-[#1A5C3E] p-3 text-sm text-[#008F5A]">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                  <span>
                    Transaction signee et certifiee sur Polygon. Le hash du
                    contrat est ancre on-chain.
                  </span>
                </div>
              ) : tx.contract_status === 'fully_signed' ? (
                <div className="flex items-center gap-2 rounded-lg border border-[#8FDAB5] bg-[#1A5C3E] p-3 text-sm text-[#008F5A]">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                  <span>
                    Contrat signe par les deux parties. Ancrage blockchain en
                    cours.
                  </span>
                </div>
              ) : null}

              {(unsignedUrl || signedUrl) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {unsignedUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={
                        <a
                          href={unsignedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download
                            className="mr-1.5 h-3.5 w-3.5"
                            strokeWidth={1.5}
                          />
                          Contrat original
                        </a>
                      }
                    />
                  ) : null}
                  {signedUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={
                        <a
                          href={signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download
                            className="mr-1.5 h-3.5 w-3.5"
                            strokeWidth={1.5}
                          />
                          Contrat signe
                        </a>
                      }
                    />
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

export default TransactionDetailPage;
