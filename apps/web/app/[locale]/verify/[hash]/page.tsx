import { BadgeCheck, ExternalLink, Leaf, Link2, ShieldCheck, XCircle } from 'lucide-react';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { PageBody } from '@kit/ui/page';

interface VerifyPageProps {
  params: Promise<{ hash: string }>;
}

export async function generateMetadata() {
  return { title: 'Vérification de certificat — GreenEcoGenius' };
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
}

function formatKg(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} t`;
  }
  return `${kg.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg`;
}

async function VerifyPage({ params }: VerifyPageProps) {
  const { hash } = await params;

  const adminClient = getSupabaseServerAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: record } = await (adminClient as any)
    .from('blockchain_records')
    .select('*')
    .eq('record_hash', hash)
    .single();

  if (!record) {
    return (
      <PageBody>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-16 text-center">
          <XCircle className="h-16 w-16 text-red-500" />
          <Heading level={3}>Certificat non trouvé</Heading>
          <p className="text-muted-foreground">
            Le hash <code className="text-xs break-all">{hash}</code> ne correspond à aucun enregistrement blockchain sur GreenEcoGenius.
          </p>
        </div>
      </PageBody>
    );
  }

  const data = record.hashed_data;
  const tx = data?.transaction;
  const carbon = data?.carbon;

  // Get carbon record for more details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: carbonRecord } = await (adminClient as any)
    .from('carbon_records')
    .select('*')
    .eq('transaction_id', record.transaction_id)
    .limit(1)
    .single();

  return (
    <PageBody>
      <div className="mx-auto max-w-3xl py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <ShieldCheck className="text-primary h-16 w-16" />
          <Heading level={2}>Certificat vérifié</Heading>
          <Badge variant="default" className="bg-green-600 text-white">
            <BadgeCheck className="mr-1 h-4 w-4" />
            Authentique — Bloc #{record.block_number}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Blockchain info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Enregistrement Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs">Hash SHA-256</p>
                  <p className="break-all font-mono text-xs">{record.record_hash}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Hash précédent</p>
                  <p className="break-all font-mono text-xs">
                    {record.previous_hash === 'GENESIS' ? 'GENESIS (premier bloc)' : record.previous_hash}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Bloc</p>
                  <p className="font-semibold">#{record.block_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Horodatage</p>
                  <p className="font-semibold">
                    {new Date(record.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction details */}
          {tx && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Détails de la transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-xs">Article</p>
                    <p className="font-semibold">{tx.listing_title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Montant</p>
                    <p className="font-semibold">{formatCents(tx.total_amount_cents)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Vendeur</p>
                    <p className="font-semibold">{tx.seller}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Acheteur</p>
                    <p className="font-semibold">{tx.buyer}</p>
                  </div>
                  {tx.paid_at && (
                    <div>
                      <p className="text-muted-foreground text-xs">Date de paiement</p>
                      <p className="font-semibold">
                        {new Date(tx.paid_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                  {tx.delivered_at && (
                    <div>
                      <p className="text-muted-foreground text-xs">Date de livraison</p>
                      <p className="font-semibold">
                        {new Date(tx.delivered_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Carbon impact */}
          {carbon && (
            <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Leaf className="h-5 w-5" />
                  Impact environnemental
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {formatKg(carbon.co2_avoided_kg)}
                    </p>
                    <p className="text-muted-foreground text-sm">CO₂ évité</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {formatKg(carbon.co2_transport_kg)}
                    </p>
                    <p className="text-muted-foreground text-sm">CO₂ transport</p>
                  </div>
                  <div className="text-center">
                    <p className="text-primary text-2xl font-bold">
                      {formatKg(carbon.co2_net_benefit_kg)}
                    </p>
                    <p className="text-muted-foreground text-sm">Bénéfice net</p>
                  </div>
                </div>

                {carbonRecord && (
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Matière</p>
                      <p className="font-semibold capitalize">{carbonRecord.material_category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Poids</p>
                      <p className="font-semibold">{carbonRecord.weight_tonnes} tonnes</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Méthode de calcul</p>
                      <p className="text-sm">{carbonRecord.calculation_method}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Équivalent arbres</p>
                      <p className="font-semibold">
                        {Math.round(carbon.co2_avoided_kg / 25)} arbres / an
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-muted-foreground text-center text-sm">
            <p>
              Ce certificat a été vérifié sur la blockchain GreenEcoGenius.
            </p>
            <p className="mt-1">
              Plateforme : {data?.platform} — Version : {data?.version}
            </p>
          </div>
        </div>
      </div>
    </PageBody>
  );
}

export default VerifyPage;
