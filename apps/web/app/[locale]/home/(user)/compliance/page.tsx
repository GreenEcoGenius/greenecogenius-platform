import Link from 'next/link';

import { ArrowRight, RefreshCw, Shield, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { NORMS_DATABASE } from '~/lib/data/norms-database';

import { SectionFooterImage } from '../_components/section-footer-image';
import { SectionHeader } from '../_components/section-header';
import { ComplianceAlerts } from './_components/compliance-alerts';
import { CompliancePillarCards } from './_components/compliance-pillar-cards';
import { ComplianceScoreCard } from './_components/compliance-score-card';
import { NormStatusTable } from './_components/norm-status-table';
import { RecalculateButton } from './_components/recalculate-button';
import { RegulatoryWatch } from './_components/regulatory-watch';

export const generateMetadata = async () => {
  const t = await getTranslations('compliance');
  return { title: t('title') };
};

async function CompliancePage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;
  const t = await getTranslations('compliance');

  if (!userId) return null;

  // Fetch real compliance data
  const { data: complianceRows } = await client
    .from('account_norm_compliance')
    .select('*')
    .eq('account_id', userId);

  // Norms under the "data" pillar (RGPD, ISO 27001, SOC 2, NIS2, Label NR)
  // concern the platform itself, not the client's ecological compliance.
  // They are hidden from the client dashboard — 37 norms instead of 42.
  const CLIENT_NORMS = NORMS_DATABASE.filter((n) => n.pillar !== 'data');
  const clientNormIds = new Set(CLIENT_NORMS.map((n) => n.id));

  const allRows = (complianceRows ?? []) as Array<{
    norm_id: string;
    status: string;
    verification_method: string;
    evidence_summary: string;
    last_evaluated_at: string;
  }>;
  const rows = allRows.filter((r) => clientNormIds.has(r.norm_id));

  const hasComplianceData = rows.length > 0;

  if (!hasComplianceData) {
    return (
      <PageBody>
        <SectionHeader titleKey="complianceTitle" descKey="complianceDesc" />

        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <div className="bg-primary-light mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Shield className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-metal-900 text-2xl font-bold">
                <Trans
                  i18nKey="compliance:emptyTitle"
                  defaults="Conformité réglementaire"
                />
              </h2>
              <p className="text-metal-500 mx-auto mt-3 max-w-md text-sm leading-relaxed">
                <Trans
                  i18nKey="compliance:emptyDesc"
                  defaults="Publiez une annonce ou réalisez une transaction sur Le Comptoir Circulaire. La plateforme évaluera automatiquement votre conformité aux 37 normes environnementales et RSE."
                />
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <RecalculateButton />
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/home/marketplace/new" />}
                  nativeButton={false}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  <Trans
                    i18nKey="compliance:publishListing"
                    defaults="Publier une annonce"
                  />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <RegulatoryWatch />

          <SectionFooterImage
            src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-3ce44a5d-32c4-45eb-8b93-1c560b509a71.png"
            alt="Conformite"
          />
        </div>
      </PageBody>
    );
  }

  // Aggregate stats (score is computed over the full client catalog of 37
  // norms, not only the rows present in the compliance table, so an empty
  // account correctly reports 0/37 = 0%).
  const totalClientNorms = CLIENT_NORMS.length;
  const compliantCount = rows.filter((r) => r.status === 'compliant').length;
  const nonCompliantCount = rows.filter(
    (r) => r.status === 'non_compliant',
  ).length;
  const score = totalClientNorms
    ? Math.round((compliantCount / totalClientNorms) * 100)
    : 0;
  const alertCount = nonCompliantCount;

  // Build pillar aggregation from real data (excluding the "data" pillar)
  const pillarMap = new Map<
    string,
    { compliant: number; total: number; norms: string[] }
  >();
  for (const norm of CLIENT_NORMS) {
    const row = rows.find((r) => r.norm_id === norm.id);
    const pillarKey = norm.pillar;
    const existing = pillarMap.get(pillarKey) ?? {
      compliant: 0,
      total: 0,
      norms: [],
    };
    existing.total += 1;
    existing.norms.push(norm.title);
    if (row?.status === 'compliant') existing.compliant += 1;
    pillarMap.set(pillarKey, existing);
  }

  const pillarLabels: Record<string, { name: string; icon: string }> = {
    circular_economy: { name: t('pillarCircularEconomy'), icon: 'circular' },
    carbon: { name: t('pillarCarbonEnv'), icon: 'carbon' },
    reporting: { name: t('pillarReportingEsg'), icon: 'reporting' },
    traceability: { name: t('pillarTraceabilityName'), icon: 'traceability' },
    labels: { name: t('pillarLabelsName'), icon: 'labels' },
  };

  const pillars = Array.from(pillarMap.entries()).map(([key, val]) => ({
    name: pillarLabels[key]?.name ?? key,
    icon: pillarLabels[key]?.icon ?? key,
    compliant: val.compliant,
    total: val.total,
    norms: val.norms,
  }));

  // Build norm rows for the table
  const normRows = CLIENT_NORMS.map((norm) => {
    const row = rows.find((r) => r.norm_id === norm.id);
    return {
      name: norm.title,
      pillar: norm.pillar,
      status: (row?.status ?? 'not_evaluated') as
        | 'compliant'
        | 'partial'
        | 'non_compliant'
        | 'not_evaluated',
      autoVerified: (row?.verification_method ?? 'pending') as string,
      evidenceSummary: row?.evidence_summary ?? '',
    };
  });

  // Alert items: only non-compliant norms (not partial or not_evaluated)
  const alertItems = rows
    .filter((r) => r.status === 'non_compliant')
    .map((r) => {
      const norm = CLIENT_NORMS.find((n) => n.id === r.norm_id);
      return {
        id: r.norm_id,
        title: norm?.title ?? r.norm_id,
        description: r.evidence_summary ?? '',
        urgency:
          r.status === 'non_compliant'
            ? ('urgent' as const)
            : ('warning' as const),
      };
    })
    .slice(0, 5);

  const lastEvaluated = rows[0]?.last_evaluated_at
    ? new Date(rows[0].last_evaluated_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : undefined;

  return (
    <PageBody>
      <SectionHeader titleKey="complianceTitle" descKey="complianceDesc" />

      <div className="space-y-8">
        <div className="flex items-center justify-end">
          <RecalculateButton />
        </div>

        <ComplianceScoreCard
          score={score}
          normsCompliant={compliantCount}
          normsTotal={totalClientNorms}
          alerts={alertCount}
          lastUpdate={lastEvaluated}
        />

        <CompliancePillarCards pillars={pillars} />

        <NormStatusTable norms={normRows} />

        {alertItems.length > 0 && <ComplianceAlerts alerts={alertItems} />}

        <RegulatoryWatch />

        <SectionFooterImage
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/generation-3ce44a5d-32c4-45eb-8b93-1c560b509a71.png"
          alt="Conformite"
        />
      </div>
    </PageBody>
  );
}

export default CompliancePage;
