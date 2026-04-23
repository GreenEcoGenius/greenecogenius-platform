import Link from 'next/link';

import { CheckCircle, FileSignature } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
} from '~/components/enviro/enviro-card';
import { TransactionImpactPanel } from '~/home/_components/transaction-impact-panel';

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ transaction_id?: string }>;
}

export async function generateMetadata() {
  const t = await getTranslations('marketplace');
  return { title: t('paymentMetaTitle') };
}

async function ConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { id } = await params;
  const { transaction_id: transactionId } = await searchParams;
  const client = getSupabaseServerClient();
  const t = await getTranslations('marketplace');

  const { data: listing } = await client
    .from('listings')
    .select('quantity, unit, material_categories(name_fr)')
    .eq('id', id)
    .single();

  const quantity = Number(listing?.quantity ?? 0);
  const volumeTonnes =
    listing?.unit === 'tonnes' || listing?.unit === 't'
      ? quantity
      : quantity / 1000;

  const material =
    (listing?.material_categories as { name_fr?: string } | null)?.name_fr ??
    '';

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroCard variant="cream" hover="none" padding="lg">
        <EnviroCardBody className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100]">
            <CheckCircle
              aria-hidden="true"
              className="h-9 w-9 text-[--color-enviro-lime-700]"
              strokeWidth={1.5}
            />
          </div>

          <h1 className="text-balance text-2xl font-semibold leading-tight text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)] md:text-3xl">
            {t('paymentSuccess')}
          </h1>

          <p className="max-w-md text-sm text-[--color-enviro-forest-700] md:text-base">
            {t('paymentSuccessDesc')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {transactionId ? (
              <EnviroButton
                variant="primary"
                size="md"
                magnetic
                render={(buttonProps) => (
                  <Link
                    {...buttonProps}
                    href={`/home/transactions/${transactionId}`}
                  >
                    <FileSignature
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={1.5}
                    />
                    {t('paymentAccessContract')}
                  </Link>
                )}
              />
            ) : null}
            <EnviroButton
              variant="secondary"
              size="md"
              render={(buttonProps) => (
                <Link {...buttonProps} href={`/home/marketplace/${id}`}>
                  {t('backToListing')}
                </Link>
              )}
            />
            <EnviroButton
              variant="ghost"
              size="md"
              render={(buttonProps) => (
                <Link {...buttonProps} href="/home/marketplace">
                  {t('backToMarketplace')}
                </Link>
              )}
            />
          </div>
        </EnviroCardBody>
      </EnviroCard>

      {material && volumeTonnes > 0 ? (
        <TransactionImpactPanel
          material={material}
          volumeTonnes={volumeTonnes}
        />
      ) : null}
    </div>
  );
}

export default ConfirmationPage;
