import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSignature,
  ShieldCheck,
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { cn } from '@kit/ui/utils';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
} from '~/components/enviro/enviro-card';
import { ContractSignatureService } from '~/lib/signature/contract-signature-service';

import { SendForSignatureButton } from './_components/send-for-signature-button';
import { SignatureStatusRow } from './_components/signature-status-row';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const any_ = (v: unknown) => v as any;

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const t = await getTranslations('transactions');
  return { title: t('metaTitle', { ref: id.slice(0, 8) }) };
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

const STATUS_TONE: Record<string, string> = {
  not_started:
    'border-[--color-enviro-cream-300] bg-[--color-enviro-cream-100] text-[--color-enviro-forest-700]',
  contract_generated:
    'border-[--color-enviro-forest-200] bg-[--color-enviro-forest-100] text-[--color-enviro-forest-700]',
  pending_signatures:
    'border-[--color-enviro-ember-200] bg-[--color-enviro-ember-50] text-[--color-enviro-ember-700]',
  seller_signed:
    'border-[--color-enviro-ember-200] bg-[--color-enviro-ember-50] text-[--color-enviro-ember-700]',
  buyer_signed:
    'border-[--color-enviro-ember-200] bg-[--color-enviro-ember-50] text-[--color-enviro-ember-700]',
  fully_signed:
    'border-[--color-enviro-lime-200] bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]',
  blockchain_certified:
    'border-[--color-enviro-lime-200] bg-[--color-enviro-lime-100] text-[--color-enviro-lime-800]',
  cancelled:
    'border-[--color-enviro-ember-200] bg-[--color-enviro-ember-100] text-[--color-enviro-ember-700]',
  expired:
    'border-[--color-enviro-ember-200] bg-[--color-enviro-ember-100] text-[--color-enviro-ember-700]',
};

async function TransactionDetailPage({ params }: Params) {
  const { id } = await params;
  const client = getSupabaseServerClient();
  const t = await getTranslations('transactions');
  const tStatus = await getTranslations('transactions.status');
  const locale = await getLocale();

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

  if (tx.buyer_account_id !== user.id && tx.seller_account_id !== user.id) {
    notFound();
  }

  const { data: parties } = await any_(client)
    .from('accounts')
    .select('id, name')
    .in('id', [tx.seller_account_id, tx.buyer_account_id]);

  const partyById = new Map<string, string>();
  for (const p of (parties ?? []) as Array<{ id: string; name: string }>) {
    partyById.set(p.id, p.name);
  }

  const sellerName =
    partyById.get(tx.seller_account_id) ?? t('parties.sellerFallback');
  const buyerName =
    partyById.get(tx.buyer_account_id) ?? t('parties.buyerFallback');

  const [unsignedUrl, signedUrl] = await Promise.all([
    ContractSignatureService.getSignedUrl(client, tx.contract_pdf_path),
    ContractSignatureService.getSignedUrl(client, tx.contract_signed_pdf_path),
  ]);

  const canSend =
    (tx.status === 'paid' || tx.status === 'delivered') &&
    (tx.contract_status === null || tx.contract_status === 'not_started') &&
    !tx.signature_envelope_id;

  const material =
    (locale === 'fr'
      ? tx.listings?.material_categories?.name_fr ??
        tx.listings?.material_categories?.name
      : tx.listings?.material_categories?.name ??
        tx.listings?.material_categories?.name_fr) ?? t('materialFallback');

  const subtitle = `${material} - ${tx.listings?.quantity ?? 0} ${tx.listings?.unit ?? ''}`.trim();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={t('tag')}
        title={t('title', { ref: tx.contract_id ?? tx.id.slice(0, 8) })}
        subtitle={subtitle}
        actions={
          <EnviroButton
            variant="secondary"
            size="sm"
            render={(buttonProps) => (
              <Link {...buttonProps} href="/home/marketplace">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                {t('backToMarketplace')}
              </Link>
            )}
          />
        }
      />

      <EnviroCard variant="cream" hover="none" padding="md">
        <EnviroCardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileSignature
                aria-hidden="true"
                className="h-5 w-5 text-[--color-enviro-forest-700]"
                strokeWidth={1.5}
              />
              <h2 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
                {t('contractCard.title')}
              </h2>
            </div>
            <span
              className={cn(
                'inline-flex items-center rounded-[--radius-enviro-pill] border px-2.5 py-0.5 text-[11px] font-semibold',
                STATUS_TONE[tx.contract_status ?? 'not_started'] ??
                  STATUS_TONE.not_started,
              )}
            >
              {tStatus(tx.contract_status ?? 'not_started')}
            </span>
          </div>
        </EnviroCardHeader>

        <EnviroCardBody className="flex flex-col gap-5 pt-5">
          <dl className="grid gap-2 text-sm text-[--color-enviro-forest-700]">
            <div className="flex justify-between">
              <dt>{t('contractCard.reference')}</dt>
              <dd className="font-medium text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-mono)]">
                {tx.contract_id ?? '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>{t('contractCard.paymentStatus')}</dt>
              <dd className="font-medium capitalize text-[--color-enviro-forest-900]">
                {tx.status.replace(/_/g, ' ')}
              </dd>
            </div>
            {tx.contract_expires_at ? (
              <div className="flex justify-between">
                <dt>{t('contractCard.expiresOn')}</dt>
                <dd className="font-medium text-[--color-enviro-forest-900] tabular-nums">
                  {new Date(tx.contract_expires_at).toLocaleDateString(locale)}
                </dd>
              </div>
            ) : null}
          </dl>

          {tx.signature_envelope_id ? (
            <div className="flex flex-col gap-2">
              <SignatureStatusRow
                role="seller"
                name={sellerName}
                signed={tx.seller_signed}
                signedAt={tx.seller_signed_at}
              />
              <SignatureStatusRow
                role="buyer"
                name={buyerName}
                signed={tx.buyer_signed}
                signedAt={tx.buyer_signed_at}
              />
            </div>
          ) : (
            <p className="rounded-[--radius-enviro-md] border border-dashed border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] p-3 text-sm text-[--color-enviro-forest-700]">
              {t('contractCard.noContract')}
            </p>
          )}

          {canSend ? <SendForSignatureButton transactionId={tx.id} /> : null}

          {tx.contract_status === 'blockchain_certified' ? (
            <div className="flex items-center gap-2 rounded-[--radius-enviro-md] border border-[--color-enviro-lime-200] bg-[--color-enviro-lime-50] p-3 text-sm text-[--color-enviro-lime-800]">
              <ShieldCheck
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
                strokeWidth={1.5}
              />
              <span>{t('alerts.blockchainCertified')}</span>
            </div>
          ) : tx.contract_status === 'fully_signed' ? (
            <div className="flex items-center gap-2 rounded-[--radius-enviro-md] border border-[--color-enviro-lime-200] bg-[--color-enviro-lime-50] p-3 text-sm text-[--color-enviro-lime-800]">
              <CheckCircle2
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
                strokeWidth={1.5}
              />
              <span>{t('alerts.fullySigned')}</span>
            </div>
          ) : null}

          {(unsignedUrl || signedUrl) && (
            <div className="flex flex-wrap gap-2">
              {unsignedUrl ? (
                <EnviroButton
                  variant="secondary"
                  size="sm"
                  render={(buttonProps) => (
                    <a
                      {...buttonProps}
                      href={unsignedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                        strokeWidth={1.5}
                      />
                      {t('actions.downloadOriginal')}
                    </a>
                  )}
                />
              ) : null}
              {signedUrl ? (
                <EnviroButton
                  variant="secondary"
                  size="sm"
                  render={(buttonProps) => (
                    <a
                      {...buttonProps}
                      href={signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                        strokeWidth={1.5}
                      />
                      {t('actions.downloadSigned')}
                    </a>
                  )}
                />
              ) : null}
            </div>
          )}
        </EnviroCardBody>
      </EnviroCard>
    </div>
  );
}

export default TransactionDetailPage;
