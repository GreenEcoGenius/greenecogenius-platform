import { use } from 'react';

import Link from 'next/link';

import { CheckCircle } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

interface ConfirmationPageProps {
  params: Promise<{ account: string; id: string }>;
}

export async function generateMetadata() {
  return { title: 'Confirmation de paiement' };
}

async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { account, id } = use(params);

  return (
    <PageBody>
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-12 text-center">
        <CheckCircle className="text-primary h-16 w-16" />

        <h1 className="text-2xl font-bold">
          <Trans i18nKey="marketplace.paymentSuccess" />
        </h1>

        <p className="text-muted-foreground">
          <Trans i18nKey="marketplace.paymentSuccessDesc" />
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            render={
              <Link href={`/home/${account}/marketplace/${id}`}>
                <Trans i18nKey="marketplace.backToListing" />
              </Link>
            }
            nativeButton={false}
          />
          <Button
            render={
              <Link href={`/home/${account}/marketplace`}>
                <Trans i18nKey="marketplace.backToMarketplace" />
              </Link>
            }
            nativeButton={false}
          />
        </div>
      </div>
    </PageBody>
  );
}

export default ConfirmationPage;
