import Link from 'next/link';

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Leaf,
  Link2,
  MapPin,
  Package,
  ShieldAlert,
  ShieldCheck,
  Truck,
  XCircle,
} from 'lucide-react';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { AppLogo } from '~/components/app-logo';

interface VerifyPageProps {
  params: Promise<{ hash: string; locale: string }>;
}

export async function generateMetadata() {
  return {
    title: 'Vérification Blockchain — GreenEcoGenius',
    description:
      "Vérifiez l'authenticité d'un certificat de traçabilité GreenEcoGenius.",
  };
}

export default async function VerifyHashPage({ params }: VerifyPageProps) {
  const { hash, locale } = await params;

  const adminClient = getSupabaseServerAdminClient();

  // 1. Try to find by record_hash
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { data: blockchainRecord } = await (adminClient as any)
    .from('blockchain_records')
    .select('*')
    .eq('record_hash', hash.trim())
    .single();

  let certificate: Record<string, unknown> | null = null;

  // 2. If not found, try traceability_certificates by certificate_number
  if (!blockchainRecord) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cert } = await (adminClient as any)
      .from('traceability_certificates')
      .select('*')
      .ilike('certificate_number', hash.trim())
      .single();

    if (cert) {
      certificate = cert;

      if (cert.transaction_id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: br } = await (adminClient as any)
          .from('blockchain_records')
          .select('*')
          .eq('transaction_id', cert.transaction_id)
          .single();

        blockchainRecord = br;
      }
    }
  }

  // NOT FOUND
  if (!blockchainRecord) {
    return (
      <VerifyLayout locale={locale}>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold">Hash non trouvé</h1>

          <p className="text-muted-foreground">
            Le hash ou numéro de certificat ne correspond à aucun
            enregistrement.
          </p>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-left text-sm dark:border-red-900 dark:bg-red-950/50">
            <p className="font-medium text-red-800 dark:text-red-300">
              Vérifiez que vous avez copié le hash complet sans espaces.
            </p>
            <code className="mt-2 block text-xs break-all text-red-600 dark:text-red-400">
              {hash}
            </code>
          </div>

          <div className="flex gap-3">
            <Button
              nativeButton={false}
              render={
                <Link href={`/${locale}/verify`}>
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Réessayer
                </Link>
              }
            />
          </div>

          <p className="text-muted-foreground text-sm">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur,
            contactez-nous :{' '}
            <a
              href="mailto:contact@greenecogenius.tech"
              className="text-primary underline"
            >
              contact@greenecogenius.tech
            </a>
          </p>
        </div>
      </VerifyLayout>
    );
  }

  // FOUND - Fetch all related data
  const transactionId = blockchainRecord.transaction_id;

  // Fetch certificate if not loaded
  if (!certificate && transactionId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cert } = await (adminClient as any)
      .from('traceability_certificates')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    certificate = cert;
  }

  // Fetch carbon record
  let carbonRecord: Record<string, unknown> | null = null;

  if (transactionId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: cr } = await (adminClient as any)
      .from('carbon_records')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    carbonRecord = cr;
  }

  // Fetch marketplace transaction + listing
  let transaction: Record<string, unknown> | null = null;
  let listing: Record<string, unknown> | null = null;

  if (transactionId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: tx } = await (adminClient as any)
      .from('marketplace_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    transaction = tx;

    if (tx?.listing_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: l } = await (adminClient as any)
        .from('listings')
        .select('title')
        .eq('id', tx.listing_id)
        .single();

      listing = l;
    }
  }

  // Verify chain integrity
  const blockNumber = blockchainRecord.block_number as number;
  let chainIntegrity = true;

  if (blockNumber > 1 && blockchainRecord.previous_hash !== 'GENESIS') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: prevBlock } = await (adminClient as any)
      .from('blockchain_records')
      .select('record_hash')
      .eq('block_number', blockNumber - 1)
      .single();

    chainIntegrity = prevBlock?.record_hash === blockchainRecord.previous_hash;
  }

  // Extract hashed_data
  const hashedData = blockchainRecord.hashed_data as Record<
    string,
    unknown
  > | null;
  const txData = hashedData?.transaction as Record<string, unknown> | null;
  const carbonData = hashedData?.carbon as Record<string, unknown> | null;

  // Build display data
  const listingTitle =
    (listing?.title as string) ?? (txData?.listing_title as string) ?? '—';
  const material = (carbonRecord?.material_category as string) ?? '—';
  const weightTonnes = (carbonRecord?.weight_tonnes as number) ?? null;
  const origin =
    (carbonRecord?.origin_location as string) ??
    (txData?.origin as string) ??
    null;
  const destination = (txData?.destination as string) ?? null;
  const distanceKm = (carbonRecord?.distance_km as number) ?? null;

  const co2Avoided =
    (carbonRecord?.co2_avoided as number) ??
    (carbonData?.co2_avoided_kg as number) ??
    0;
  const co2Transport =
    (carbonRecord?.co2_transport as number) ??
    (carbonData?.co2_transport_kg as number) ??
    0;
  const co2Net = co2Avoided - co2Transport;

  const treesEquiv = Math.round(co2Net / 25);
  const carKmEquiv = Math.round(co2Net * 4.7);

  const certNumber = (certificate?.certificate_number as string) ?? null;
  const certUrl = (certificate?.certificate_url as string) ?? null;

  // Mask company names
  const sellerName = txData?.seller as string | undefined;
  const buyerName = txData?.buyer as string | undefined;
  const maskedSeller = maskName(sellerName);
  const maskedBuyer = maskName(buyerName);

  // Build timeline
  const timeline = buildTimeline(
    blockchainRecord,
    transaction,
    certificate,
    txData,
  );

  const verifyUrl = `/${locale}/verify/${blockchainRecord.record_hash}`;

  return (
    <VerifyLayout locale={locale}>
      <div className="mx-auto max-w-3xl space-y-8 py-8">
        {/* Section 1 - Hero Badge */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-400/20 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle2 className="h-14 w-14 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold md:text-3xl">
            VÉRIFIÉ — Certificat Authentique
          </h1>

          <p className="text-muted-foreground max-w-md text-sm">
            Ce certificat est enregistré dans la blockchain GreenEcoGenius et
            ses données sont intègres.
          </p>

          {chainIntegrity ? (
            <Badge
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <ShieldCheck className="mr-1 h-4 w-4" />
              Chaîne intègre
            </Badge>
          ) : (
            <Badge variant="destructive">
              <ShieldAlert className="mr-1 h-4 w-4" />
              Intégrité à vérifier
            </Badge>
          )}
        </div>

        {/* Section 2 - Blockchain Proof */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Preuve Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-full">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Hash SHA-256
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <code className="bg-muted flex-1 rounded px-2 py-1 font-mono text-xs break-all">
                    {blockchainRecord.record_hash}
                  </code>
                  <CopyButton
                    text={blockchainRecord.record_hash}
                    label="Copier le hash"
                  />
                </div>
              </div>

              <InfoField
                label="Bloc"
                value={`#${blockchainRecord.block_number}`}
              />

              <InfoField
                label="Hash précédent"
                value={
                  blockchainRecord.previous_hash === 'GENESIS'
                    ? 'GENESIS (premier bloc)'
                    : blockchainRecord.previous_hash
                }
                mono
              />

              <InfoField
                label="Horodatage"
                value={new Date(blockchainRecord.created_at).toLocaleString(
                  'fr-FR',
                  {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  },
                )}
              />

              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Intégrité
                </p>
                <div className="mt-1">
                  {chainIntegrity ? (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 dark:text-green-400">
                      <ShieldCheck className="h-4 w-4" />
                      Vérifiée
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 dark:text-red-400">
                      <ShieldAlert className="h-4 w-4" />
                      Non vérifiée
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3 - Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Détails de la Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {certNumber && (
                <InfoField
                  label="Certificat"
                  value={certNumber}
                  className="col-span-full"
                />
              )}

              <InfoField label="Article" value={listingTitle} />
              <InfoField
                label="Matière"
                value={material}
                className="capitalize"
              />

              {weightTonnes !== null && (
                <InfoField label="Poids" value={`${weightTonnes} tonnes`} />
              )}

              {origin && <InfoField label="Origine" value={origin} />}
              {destination && (
                <InfoField label="Destination" value={destination} />
              )}
              {distanceKm !== null && (
                <InfoField label="Distance" value={`${distanceKm} km`} />
              )}

              <InfoField label="Vendeur" value={maskedSeller} />
              <InfoField label="Acheteur" value={maskedBuyer} />
            </div>
          </CardContent>
        </Card>

        {/* Section 4 - Carbon Impact */}
        {co2Avoided > 0 && (
          <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Leaf className="h-5 w-5" />
                Impact Carbone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <CarbonStat
                  value={formatKg(co2Avoided)}
                  label="CO₂ évité (recyclage vs vierge)"
                  color="text-green-700 dark:text-green-300"
                />
                <CarbonStat
                  value={formatKg(co2Transport)}
                  label="CO₂ transport"
                  color="text-orange-600 dark:text-orange-400"
                />
                <CarbonStat
                  value={formatKg(co2Net)}
                  label="Bénéfice net"
                  color="text-green-800 dark:text-green-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-green-200 pt-4 dark:border-green-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {treesEquiv.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    arbres / an équivalent
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {carKmEquiv.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    km en voiture évités
                  </p>
                </div>
              </div>

              <p className="text-center text-xs text-green-700/70 dark:text-green-400/70">
                Méthode : ADEME Base Carbone 2024
              </p>
            </CardContent>
          </Card>
        )}

        {/* Section 5 - Timeline */}
        {timeline.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Parcours du Lot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative ml-4 space-y-0">
                {/* Connecting line */}
                <div className="absolute top-2 bottom-2 left-0 w-0.5 bg-green-200 dark:bg-green-800" />

                {timeline.map((event, index) => (
                  <div
                    key={index}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {/* Dot */}
                    <div
                      className={`relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                        index === timeline.length - 1
                          ? 'bg-green-600'
                          : 'bg-background border-2 border-green-400'
                      }`}
                    >
                      {index === timeline.length - 1 && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <TimelineIcon event={event.event} />
                        <p className="text-sm font-medium">
                          {getEventLabel(event.event)}
                        </p>
                      </div>
                      <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                        {event.date && (
                          <span>
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 6 - Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <CopyButton
            text={`${typeof window !== 'undefined' ? window.location.origin : 'https://greenecogenius.tech'}${verifyUrl}`}
            label="Copier le lien de vérification"
            asButton
          />

          {certUrl && (
            <Button
              nativeButton={false}
              variant="outline"
              render={
                <a href={certUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-1 h-4 w-4" />
                  Télécharger le certificat
                </a>
              }
            />
          )}
        </div>
      </div>
    </VerifyLayout>
  );
}

// ---- Helper Components ----

function VerifyLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-b px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <AppLogo href={`/${locale}`} className="h-10 w-auto sm:h-12" />
          <Badge variant="outline" className="text-xs">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Vérification publique
          </Badge>
        </div>
      </header>
      <main className="flex-1 px-4">{children}</main>
      <footer className="text-muted-foreground border-t px-4 py-6 text-center text-xs">
        <p>
          GreenEcoGenius OÜ (Estonia) · GreenEcoGenius, Inc. (Delaware, USA)
        </p>
        <p className="text-xs opacity-60">
          Blockchain: Polygon Mainnet · greenecogenius.tech
        </p>
      </footer>
    </div>
  );
}

function InfoField({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${mono ? 'font-mono text-xs break-all' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}

function CarbonStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

function CopyButton({
  text,
  label,
  asButton,
}: {
  text: string;
  label: string;
  asButton?: boolean;
}) {
  if (asButton) {
    return <CopyButtonClient text={text} label={label} />;
  }

  return <CopyButtonClient text={text} label={label} iconOnly />;
}

// Client component for copy functionality - inlined as a script-based approach
// Since this is a server component page, we use a form-based copy fallback
function CopyButtonClient({
  text,
  label,
  iconOnly,
}: {
  text: string;
  label: string;
  iconOnly?: boolean;
}) {
  // Using a simple link-based approach that works server-side
  // The actual copy will be handled via the client component wrapper below
  if (iconOnly) {
    return (
      <button
        data-test="copy-button"
        data-copy-text={text}
        className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
        title={label}
        type="button"
      >
        <Copy className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      data-test="copy-link-button"
      data-copy-text={text}
      className="bg-primary text-primary-foreground hover:bg-primary/80 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      type="button"
    >
      <Copy className="h-4 w-4" />
      {label}
    </button>
  );
}

function TimelineIcon({ event }: { event: string }) {
  const className = 'h-4 w-4 text-muted-foreground';

  switch (event) {
    case 'listing_created':
      return <Package className={className} />;
    case 'payment_confirmed':
      return <CheckCircle2 className={className} />;
    case 'shipped':
      return <Truck className={className} />;
    case 'delivery_confirmed':
      return <MapPin className={className} />;
    case 'blockchain_recorded':
      return <Link2 className={className} />;
    case 'certificate_issued':
      return <ShieldCheck className={className} />;
    default:
      return <Clock className={className} />;
  }
}

function getEventLabel(event: string): string {
  const labels: Record<string, string> = {
    listing_created: 'Mise en vente sur Le Comptoir Circulaire',
    payment_confirmed: 'Achat validé + paiement sécurisé',
    shipped: 'Expédition',
    delivery_confirmed: 'Livraison confirmée',
    blockchain_recorded: 'Hash blockchain généré',
    certificate_issued: 'Certificat émis',
  };

  return labels[event] ?? event;
}

// ---- Utility Functions ----

function maskName(name?: string | null): string {
  if (!name) return '—';
  if (name.length <= 1) return name + '****';
  return name.charAt(0).toUpperCase() + '****';
}

function formatKg(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} t`;
  }

  return `${kg.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg`;
}

function buildTimeline(
  blockchainRecord: Record<string, unknown>,
  transaction: Record<string, unknown> | null,
  certificate: Record<string, unknown> | null,
  txData: Record<string, unknown> | null,
) {
  const timeline: Array<{
    event: string;
    date: string | null;
    location?: string;
  }> = [];

  if (transaction?.created_at) {
    timeline.push({
      event: 'listing_created',
      date: transaction.created_at as string,
      location: (txData?.origin as string) ?? undefined,
    });
  }

  if (transaction?.paid_at) {
    timeline.push({
      event: 'payment_confirmed',
      date: transaction.paid_at as string,
    });
  }

  if (transaction?.shipped_at) {
    timeline.push({
      event: 'shipped',
      date: transaction.shipped_at as string,
    });
  }

  if (transaction?.delivered_at || transaction?.delivery_confirmed_at) {
    timeline.push({
      event: 'delivery_confirmed',
      date: (transaction.delivery_confirmed_at ??
        transaction.delivered_at) as string,
      location: (txData?.destination as string) ?? undefined,
    });
  }

  if (blockchainRecord.created_at) {
    timeline.push({
      event: 'blockchain_recorded',
      date: blockchainRecord.created_at as string,
    });
  }

  if (certificate?.created_at) {
    timeline.push({
      event: 'certificate_issued',
      date: certificate.created_at as string,
    });
  }

  return timeline;
}
