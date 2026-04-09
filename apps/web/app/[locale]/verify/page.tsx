import {
  ArrowRight,
  Blocks,
  Hash,
  Leaf,
  Search,
  ShieldCheck,
} from 'lucide-react';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';

import { AppLogo } from '~/components/app-logo';

interface VerifyLandingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return {
    title: 'Vérification Blockchain — GreenEcoGenius',
    description:
      "Vérifiez l'authenticité d'un certificat de traçabilité GreenEcoGenius.",
  };
}

export default async function VerifyLandingPage({
  params,
}: VerifyLandingPageProps) {
  const { locale } = await params;

  // Fetch stats directly (SSR)
  const adminClient = getSupabaseServerAdminClient();

  const [certificatesResult, carbonResult] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (adminClient as any)
      .from('traceability_certificates')
      .select('id', { count: 'exact', head: true }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (adminClient as any)
      .from('carbon_records')
      .select('weight_tonnes, co2_avoided'),
  ]);

  const totalCertificates = certificatesResult.count ?? 0;
  let totalTonnes = 0;
  let totalCO2Avoided = 0;

  if (carbonResult.data && Array.isArray(carbonResult.data)) {
    for (const record of carbonResult.data) {
      totalTonnes += record.weight_tonnes ?? 0;
      totalCO2Avoided += record.co2_avoided ?? 0;
    }
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <AppLogo href={`/${locale}`} className="h-10 w-auto sm:h-12" />
          <Badge variant="outline" className="text-xs">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Vérification publique
          </Badge>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="border-b px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">
              Vérification Blockchain
            </h1>

            <p className="text-muted-foreground mt-3 text-lg">
              Vérifiez l&apos;authenticité d&apos;un certificat de traçabilité
              GreenEcoGenius.
            </p>

            {/* Search Form */}
            <form
              action={`/${locale}/verify/search`}
              method="GET"
              className="mt-8"
              data-test="verify-search-form"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <input
                    type="text"
                    name="q"
                    required
                    placeholder="Entrez un hash ou numéro de certificat (ex: GEG-2026-...)"
                    className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-12 w-full rounded-lg border pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
                    data-test="verify-search-input"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-12 items-center gap-2 rounded-lg px-6 text-sm font-medium transition-colors"
                  data-test="verify-search-button"
                >
                  Vérifier
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <p className="text-muted-foreground mt-3 text-sm">
              Scannez le QR code de votre certificat ou collez le hash
              ci-dessus.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center text-2xl font-bold">
              Comment ça marche
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <HowItWorksStep
                icon={<Blocks className="h-8 w-8" />}
                step="1"
                description="Chaque transaction est enregistrée dans une chaîne de blocs inviolable."
              />
              <HowItWorksStep
                icon={<Hash className="h-8 w-8" />}
                step="2"
                description="Un hash cryptographique SHA-256 unique est généré pour chaque lot."
              />
              <HowItWorksStep
                icon={<ShieldCheck className="h-8 w-8" />}
                step="3"
                description="Cette page vérifie l'authenticité et l'intégrité des données à tout moment."
              />
            </div>
          </div>
        </section>

        {/* Global Stats */}
        <section className="border-t bg-green-50 px-4 py-16 dark:bg-green-950/30">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center text-2xl font-bold">
              Transparence & Confiance
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <StatCard
                value={totalCertificates.toLocaleString('fr-FR')}
                label="certificats émis"
                icon={<ShieldCheck className="h-6 w-6 text-green-600" />}
              />
              <StatCard
                value={Math.round(totalTonnes).toLocaleString('fr-FR')}
                label="tonnes tracées"
                icon={<Blocks className="h-6 w-6 text-green-600" />}
              />
              <StatCard
                value={Math.round(totalCO2Avoided).toLocaleString('fr-FR')}
                label="tonnes CO₂ évitées"
                icon={<Leaf className="h-6 w-6 text-green-600" />}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground border-t px-4 py-6 text-center text-xs">
        <p>
          GreenEcoGenius OÜ (Estonia) · GreenEcoGenius, Inc. (Delaware, USA)
        </p>
        <p className="text-xs opacity-60">
          Blockchain: Polygon Mainnet · greenecogenius.tech
        </p>
      </footer>

      {/* Client-side script for form redirect */}
      <SearchFormScript locale={locale} />
    </div>
  );
}

function HowItWorksStep({
  icon,
  step,
  description,
}: {
  icon: React.ReactNode;
  step: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
          {icon}
        </div>
        <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
          {step}
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
        {icon}
        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
          {value}
        </p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Inline script to intercept form submission and redirect to /verify/[hash]
 * instead of /verify/search?q=hash (since we don't have a search route).
 */
function SearchFormScript({ locale }: { locale: string }) {
  const script = `
    (function() {
      var form = document.querySelector('[data-test="verify-search-form"]');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var input = form.querySelector('[data-test="verify-search-input"]');
          var value = input ? input.value.trim() : '';
          if (value) {
            window.location.href = '/${locale}/verify/' + encodeURIComponent(value);
          }
        });
      }

      // Copy button handler
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-copy-text]');
        if (btn) {
          var text = btn.getAttribute('data-copy-text');
          if (text && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
              var original = btn.innerHTML;
              btn.textContent = 'Copié !';
              setTimeout(function() { btn.innerHTML = original; }, 2000);
            });
          }
        }
      });
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
