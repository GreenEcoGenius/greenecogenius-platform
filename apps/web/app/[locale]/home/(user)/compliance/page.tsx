import Link from 'next/link';

import { ArrowRight, Shield, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  EnviroDashboardSectionHeader,
  EnviroStatCard,
  EnviroStatCardGrid,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
} from '~/components/enviro/enviro-card';
import { NORMS_DATABASE } from '~/lib/data/norms-database';

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
  const t = await getTranslations('compliance');
  const tDashboard = await getTranslations('dashboard');
  const tCommon = await getTranslations('common');

  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: complianceRows } = await (client as any)
    .from('account_norm_compliance')
    .select('*')
    .eq('account_id', userId);

  // Norms under the "data" pillar (RGPD, ISO 27001, SOC 2, NIS2, Label NR)
  // concern the platform itself, not the client's ecological compliance.
  // They are hidden from the client dashboard so the score is computed
  // over 37 norms instead of 42.
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
        <EnviroDashboardSectionHeader
          tag={tCommon('routes.compliance')}
          title={tDashboard('complianceTitle')}
          subtitle={tDashboard('complianceDesc')}
        />

        <EnviroCard variant="dark" hover="none" padding="lg">
          <EnviroCardBody className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-300]/15 text-[--color-enviro-lime-300]">
              <Shield aria-hidden="true" className="h-8 w-8" />
            </div>
            <h2 className="text-balance text-2xl leading-tight font-semibold text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)]">
              {t('emptyTitle')}
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-[--color-enviro-fg-inverse-muted]">
              {t('emptyDesc')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <RecalculateButton />
              <EnviroButton
                variant="outlineCream"
                size="md"
                render={(buttonProps) => (
                  <Link {...buttonProps} href="/home/marketplace/new">
                    <Zap aria-hidden="true" className="h-4 w-4" />
                    {t('publishListing')}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                )}
              />
            </div>
          </EnviroCardBody>
        </EnviroCard>

        <RegulatoryWatch />
      </div>
    );
  }

  const totalClientNorms = CLIENT_NORMS.length;
  const compliantCount = rows.filter((r) => r.status === 'compliant').length;
  const nonCompliantCount = rows.filter(
    (r) => r.status === 'non_compliant',
  ).length;
  const score = totalClientNorms
    ? Math.round((compliantCount / totalClientNorms) * 100)
    : 0;
  const alertCount = nonCompliantCount;

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.compliance')}
        title={tDashboard('complianceTitle')}
        subtitle={tDashboard('complianceDesc')}
        actions={<RecalculateButton />}
      />

      <EnviroStatCardGrid cols={4}>
        <EnviroStatCard
          variant="forest"
          label={t('globalScore')}
          value={score}
          suffix=" %"
          subtitle={
            lastEvaluated
              ? t('lastUpdateOn', { date: lastEvaluated })
              : undefined
          }
          icon={<Shield aria-hidden="true" className="h-5 w-5" />}
        />
        <EnviroStatCard
          variant="lime"
          label={t('normsCompliant')}
          valueDisplay={
            <span className="tabular-nums">
              {compliantCount}/{totalClientNorms}
            </span>
          }
          subtitle={t('subtitleClientNorms')}
        />
        <EnviroStatCard
          variant="cream"
          label={t('alertsLabel')}
          value={alertCount}
          subtitle={t('alertsSubtitle')}
        />
        <EnviroStatCard
          variant="cream"
          label={t('pillarsLabel')}
          valueDisplay={
            <span className="tabular-nums">{pillars.length}</span>
          }
          subtitle={t('pillarsSubtitle')}
        />
      </EnviroStatCardGrid>

      <ComplianceScoreCard
        score={score}
        normsCompliant={compliantCount}
        normsTotal={totalClientNorms}
        alerts={alertCount}
        lastUpdate={lastEvaluated}
      />

      <CompliancePillarCards pillars={pillars} />

      <NormStatusTable norms={normRows} />

      {alertItems.length > 0 ? (
        <ComplianceAlerts alerts={alertItems} />
      ) : null}

      <RegulatoryWatch />
    </div>
  );
}

export default CompliancePage;
