import Link from 'next/link';

import { CheckCircle, FileSignature } from 'lucide-react';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { TransactionImpactPanel } from '~/home/_components/transaction-impact-panel';

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ transaction_id?: string }>;
}

export async function generateMetadata() {
  return { title: 'Confirmation de paiement' };
}

async function ConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { id } = await params;
  const { transaction_id: transactionId } = await searchParams;
  const client = getSupabaseServerClient();

  const { data: listing } = await client
    .from('listings')
    .select('quantity, unit, material_categories(name_fr)')
    .eq('id', id)
    .single();

  // Normalise quantity to tonnes (schema stores kg or tonnes in `unit`)
  const quantity = Number(listing?.quantity ?? 0);
  const volumeTonnes =
    listing?.unit === 'tonnes' || listing?.unit === 't'
      ? quantity
      : quantity / 1000;

  const material =
    (listing?.material_categories as { name_fr?: string } | null)?.name_fr ??
    '';

  return (
    <PageBody>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-12 text-center">
        <CheckCircle className="text-primary h-16 w-16" strokeWidth={1.5} />

        <h1 className="text-2xl font-bold">
          <Trans i18nKey="marketplace.paymentSuccess" />
        </h1>

        <p className="text-muted-foreground">
          <Trans i18nKey="marketplace.paymentSuccessDesc" />
        </p>

        {material && volumeTonnes > 0 ? (
          <TransactionImpactPanel
            material={material}
            volumeTonnes={volumeTonnes}
          />
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          {transactionId ? (
            <Button
              className="bg-[#00A86B] hover:bg-[#00A86B]"
              nativeButton={false}
              render={
                <Link href={`/home/transactions/${transactionId}`}>
                  <FileSignature
                    className="mr-1.5 h-4 w-4"
                    strokeWidth={1.5}
                  />
                  Acceder au contrat de vente
                </Link>
              }
            />
          ) : null}
          <Button
            variant="outline"
            render={
              <Link href={`/home/marketplace/${id}`}>
                <Trans i18nKey="marketplace.backToListing" />
              </Link>
            }
            nativeButton={false}
          />
          <Button
            variant="outline"
            render={
              <Link href="/home/marketplace">
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
