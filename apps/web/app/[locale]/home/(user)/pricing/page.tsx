import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Hash,
  Link2,
  ScrollText,
  Shield,
  XCircle,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  EnviroDashboardSectionHeader,
  EnviroDataTable,
  EnviroEmptyState,
  EnviroStatCard,
  EnviroStatCardGrid,
  EnviroTableBody,
  EnviroTableCell,
  EnviroTableHead,
  EnviroTableHeader,
  EnviroTableRow,
} from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
} from '~/components/enviro/enviro-card';

export const generateMetadata = async () => {
  const t = await getTranslations('blockchain');

  return { title: t('title') };
};

/**
 * Internal blockchain dashboard route.
 *
 * NOTE: this route is mounted under `/home/pricing` for historical
 * reasons (the slug pre-dates the actual content). It does NOT serve a
 * pricing experience. The real subscription / upgrade UI lives at
 * `/home/billing`. A future cleanup task should rename the route slug
 * (a `next.config.mjs` rewrite or a renamed segment) but that change is
 * out of scope for Phase 6 because it would touch business logic.
 */
async function BlockchainDashboardPage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('blockchain');
  const tCommon = await getTranslations('common');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = client as any;

  const [{ count: blocksCount }, { count: certsCount }, blocksRes, certsRes] =
    await Promise.all([
      c.from('blockchain_records').select('*', { count: 'exact', head: true }),
      c
        .from('traceability_certificates')
        .select('*', { count: 'exact', head: true }),
      c
        .from('blockchain_records')
        .select('id, block_number, record_hash, created_at, listing_id')
        .order('created_at', { ascending: false })
        .limit(10),
      c
        .from('traceability_certificates')
        .select(
          'id, certificate_number, verification_hash, status, created_at, material_type, weight_kg, co2_avoided',
        )
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

  const recentBlocks = (blocksRes.data ?? []) as Array<{
    id: string;
    block_number: number | null;
    record_hash: string;
    created_at: string;
    listing_id: string | null;
  }>;

  const recentCerts = (certsRes.data ?? []) as Array<{
    id: string;
    certificate_number: string;
    verification_hash: string | null;
    status: string;
    created_at: string;
    material_type: string | null;
    weight_kg: number | null;
    co2_avoided: number | null;
  }>;

  let onChainStats: {
    totalLots: number;
    totalCertificates: number;
    contractAddress: string;
    network: string;
  } | null = null;

  try {
    const { getBlockchainStats } = await import(
      '~/lib/blockchain/alchemy-service'
    );
    onChainStats = await getBlockchainStats();
  } catch {
    // Blockchain not configured: graceful fallback to off-chain only.
  }

  const polygonConfigured = !!onChainStats;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.traceability')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <EnviroStatCardGrid cols={3}>
        <EnviroStatCard
          variant="forest"
          label={t('totalBlocks')}
          value={blocksCount ?? 0}
          subtitle={
            onChainStats ? `${onChainStats.totalLots} on-chain` : undefined
          }
          icon={<Hash aria-hidden="true" className="h-5 w-5" />}
        />

        <EnviroStatCard
          variant="lime"
          label={t('totalCertificates')}
          value={certsCount ?? 0}
          subtitle={
            onChainStats
              ? `${onChainStats.totalCertificates} on-chain`
              : undefined
          }
          icon={<ScrollText aria-hidden="true" className="h-5 w-5" />}
        />

        <EnviroStatCard
          variant="cream"
          label={t('chainStatus')}
          valueDisplay={
            <span className="inline-flex items-center gap-2 text-2xl">
              {polygonConfigured ? (
                <>
                  <CheckCircle
                    aria-hidden="true"
                    className="h-6 w-6 text-[--color-enviro-lime-600]"
                  />
                  <span className="text-base font-semibold text-[--color-enviro-forest-900]">
                    {t('polygonConfigured')}
                  </span>
                </>
              ) : (
                <>
                  <XCircle
                    aria-hidden="true"
                    className="h-6 w-6 text-[--color-enviro-forest-700]/60"
                  />
                  <span className="text-sm text-[--color-enviro-forest-700]">
                    {t('polygonNotConfigured')}
                  </span>
                </>
              )}
            </span>
          }
          subtitle={
            polygonConfigured && onChainStats
              ? `${t('networkLabel')}: ${onChainStats.network}`
              : undefined
          }
          icon={<Shield aria-hidden="true" className="h-5 w-5" />}
        />
      </EnviroStatCardGrid>

      {!polygonConfigured ? (
        <div className="rounded-[--radius-enviro-md] border border-dashed border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] px-5 py-4 text-center text-sm text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
          {t('offChainNote')}
        </div>
      ) : null}

      {polygonConfigured && onChainStats ? (
        <div className="rounded-[--radius-enviro-md] border border-[--color-enviro-cream-300] bg-[--color-enviro-bg-elevated] px-5 py-4 font-[family-name:var(--font-enviro-sans)]">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[--color-enviro-forest-900]">
            <span className="font-semibold">{t('contractLabel')}:</span>
            <code className="rounded-[--radius-enviro-sm] bg-[--color-enviro-cream-100] px-2 py-1 text-xs text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-mono)]">
              {onChainStats.contractAddress}
            </code>
            <a
              href={`https://polygonscan.com/address/${onChainStats.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[--color-enviro-forest-700] transition-colors hover:text-[--color-enviro-cta] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60"
            >
              {t('viewOnPolygon')}
              <ExternalLink aria-hidden="true" className="h-3 w-3" />
            </a>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EnviroCard variant="cream" hover="none" padding="md">
          <EnviroCardHeader>
            <EnviroCardTitle className="text-lg">
              {t('recentBlocks')}
            </EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody className="pt-5">
            {recentBlocks.length > 0 ? (
              <EnviroDataTable scrollable={false}>
                <EnviroTableHeader>
                  <EnviroTableRow>
                    <EnviroTableHead>{t('blockNumber')}</EnviroTableHead>
                    <EnviroTableHead>{t('hash')}</EnviroTableHead>
                    <EnviroTableHead>{t('date')}</EnviroTableHead>
                  </EnviroTableRow>
                </EnviroTableHeader>
                <EnviroTableBody>
                  {recentBlocks.map((block) => (
                    <EnviroTableRow key={block.id}>
                      <EnviroTableCell>
                        {block.block_number != null ? (
                          <span className="inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-forest-900] px-2.5 py-0.5 text-[11px] font-semibold text-[--color-enviro-lime-300] font-[family-name:var(--font-enviro-mono)]">
                            #{block.block_number}
                          </span>
                        ) : (
                          <span className="text-xs text-[--color-enviro-forest-700]/60">
                            -
                          </span>
                        )}
                      </EnviroTableCell>
                      <EnviroTableCell className="max-w-[14ch] truncate font-[family-name:var(--font-enviro-mono)] text-xs">
                        {block.record_hash}
                      </EnviroTableCell>
                      <EnviroTableCell className="text-xs text-[--color-enviro-forest-700]">
                        {new Date(block.created_at).toLocaleDateString()}
                      </EnviroTableCell>
                    </EnviroTableRow>
                  ))}
                </EnviroTableBody>
              </EnviroDataTable>
            ) : (
              <EnviroEmptyState
                icon={<Hash aria-hidden="true" className="h-7 w-7" />}
                title={t('noRecords')}
              />
            )}
          </EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="cream" hover="none" padding="md">
          <EnviroCardHeader>
            <EnviroCardTitle className="text-lg">
              {t('recentCertificates')}
            </EnviroCardTitle>
          </EnviroCardHeader>
          <EnviroCardBody className="pt-5">
            {recentCerts.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {recentCerts.map((cert) => (
                  <li
                    key={cert.id}
                    className="flex flex-col gap-1.5 rounded-[--radius-enviro-md] border border-[--color-enviro-cream-200] bg-[--color-enviro-bg-elevated] px-4 py-3 transition-colors hover:border-[--color-enviro-lime-400]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-[--radius-enviro-sm] border border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] px-2 py-0.5 text-[11px] font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-mono)]">
                        {cert.certificate_number}
                      </span>
                      <CertStatusBadge status={cert.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[--color-enviro-forest-700]">
                      {cert.material_type ? (
                        <span>{cert.material_type}</span>
                      ) : null}
                      {cert.weight_kg != null ? (
                        <span className="tabular-nums">
                          {cert.weight_kg} kg
                        </span>
                      ) : null}
                      {cert.co2_avoided != null ? (
                        <span className="tabular-nums">
                          {cert.co2_avoided} kg CO₂
                        </span>
                      ) : null}
                      <span>
                        {new Date(cert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EnviroEmptyState
                icon={<ScrollText aria-hidden="true" className="h-7 w-7" />}
                title={t('noRecords')}
              />
            )}
          </EnviroCardBody>
        </EnviroCard>
      </div>

      <EnviroCard variant="dark" hover="none" padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-[--color-enviro-fg-inverse] font-[family-name:var(--font-enviro-display)]">
              <Link2
                aria-hidden="true"
                className="h-5 w-5 text-[--color-enviro-lime-300]"
              />
              {t('verifyPublic')}
            </h3>
            <p className="max-w-xl text-sm text-[--color-enviro-fg-inverse-muted]">
              {t('verifyPublicDesc')}
            </p>
          </div>

          <EnviroButton
            type="button"
            variant="lime"
            size="md"
            magnetic
            render={(buttonProps) => (
              <a {...buttonProps} href="/verify">
                {t('goToVerify')}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
          />
        </div>
      </EnviroCard>
    </div>
  );
}

function CertStatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';

  return (
    <span
      className={
        isActive
          ? 'inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100] px-2 py-0.5 text-[11px] font-semibold text-[--color-enviro-lime-800]'
          : 'inline-flex items-center rounded-[--radius-enviro-pill] bg-[--color-enviro-cream-100] px-2 py-0.5 text-[11px] font-semibold text-[--color-enviro-forest-700]'
      }
    >
      {status}
    </span>
  );
}

export default BlockchainDashboardPage;
