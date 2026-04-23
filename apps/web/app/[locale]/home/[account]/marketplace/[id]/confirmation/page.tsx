import { use } from 'react';

import Link from 'next/link';

import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
} from '~/components/enviro/enviro-card';

interface ConfirmationPageProps {
  params: Promise<{ account: string; id: string }>;
}

export async function generateMetadata() {
  const t = await getTranslations('marketplace');

  return { title: t('paymentSuccess') };
}

async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { account, id } = use(params);
  const t = await getTranslations('marketplace');

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4 py-12 text-center lg:py-16">
      <EnviroCard variant="cream" hover="none" padding="lg" className="w-full">
        <EnviroCardBody className="flex flex-col items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100] text-[--color-enviro-forest-900]">
            <CheckCircle aria-hidden="true" className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-bold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
            {t('paymentSuccess')}
          </h1>

          <p className="text-sm text-[--color-enviro-forest-700]">
            {t('paymentSuccessDesc')}
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <EnviroButton
              variant="secondary"
              size="sm"
              render={(buttonProps) => (
                <Link
                  {...buttonProps}
                  href={`/home/${account}/marketplace/${id}`}
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  {t('backToListing')}
                </Link>
              )}
            />
            <EnviroButton
              variant="primary"
              size="sm"
              render={(buttonProps) => (
                <Link
                  {...buttonProps}
                  href={`/home/${account}/marketplace`}
                >
                  {t('backToMarketplace')}
                </Link>
              )}
            />
          </div>
        </EnviroCardBody>
      </EnviroCard>
    </div>
  );
}

export default ConfirmationPage;
