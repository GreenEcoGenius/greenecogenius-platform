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
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

export const generateMetadata = async () => {
  const t = await getTranslations('blockchain');

  return { title: t('title') };
};

async function BlockchainDashboardPage() {
  const client = getSupabaseServerClient();

  // Fetch blockchain records count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: blocksCount } = await (client as any)
    .from('blockchain_records')
    .select('*', { count: 'exact', head: true });

  // Fetch certificates count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: certsCount } = await (client as any)
    .from('traceability_certificates')
    .select('*', { count: 'exact', head: true });

  // Fetch recent blockchain records
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: recentBlocks } = await (client as any)
    .from('blockchain_records')
    .select('id, block_number, record_hash, created_at, listing_id')
    .order('created_at', { ascending: false })
    .limit(10);

  // Fetch recent certificates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: recentCerts } = await (client as any)
    .from('traceability_certificates')
    .select(
      'id, certificate_number, verification_hash, status, created_at, material_type, weight_kg, co2_avoided',
    )
    .order('created_at', { ascending: false })
    .limit(10);

  // Try to get on-chain stats (graceful fallback)
  let onChainStats: {
    totalLots: number;
    totalCertificates: number;
    contractAddress: string;
    network: string;
  } | null = null;

  try {
    const { getBlockchainStats } =
      await import('~/lib/blockchain/alchemy-service');
    onChainStats = await getBlockchainStats();
  } catch {
    // Blockchain not configured — that's fine
  }

  const polygonConfigured = !!onChainStats;

  return (
    <PageBody>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Subtitle */}
        <p className="text-muted-foreground text-center text-lg">
          <Trans i18nKey="blockchain:subtitle" />
        </p>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans i18nKey="blockchain:totalBlocks" />
              </CardTitle>
              <Hash className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blocksCount ?? 0}</div>
              {onChainStats && (
                <p className="text-muted-foreground text-xs">
                  {onChainStats.totalLots} on-chain
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans i18nKey="blockchain:totalCertificates" />
              </CardTitle>
              <ScrollText className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certsCount ?? 0}</div>
              {onChainStats && (
                <p className="text-muted-foreground text-xs">
                  {onChainStats.totalCertificates} on-chain
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans i18nKey="blockchain:chainStatus" />
              </CardTitle>
              <Shield className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {polygonConfigured ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-verdure-500" />
                    <span className="text-sm font-medium text-verdure-700 dark:text-verdure-400">
                      <Trans i18nKey="blockchain:polygonConfigured" />
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-muted-foreground h-5 w-5" />
                    <span className="text-muted-foreground text-sm">
                      <Trans i18nKey="blockchain:polygonNotConfigured" />
                    </span>
                  </>
                )}
              </div>
              {polygonConfigured && onChainStats && (
                <p className="text-muted-foreground mt-1 text-xs">
                  <Trans i18nKey="blockchain:networkLabel" />:{' '}
                  {onChainStats.network}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Polygon info banner */}
        {!polygonConfigured && (
          <div className="bg-muted rounded-lg border p-4 text-center">
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="blockchain:offChainNote" />
            </p>
          </div>
        )}

        {/* Contract info */}
        {polygonConfigured && onChainStats && (
          <div className="bg-muted rounded-lg border p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium">
                <Trans i18nKey="blockchain:contractLabel" />:
              </span>
              <code className="bg-background rounded px-2 py-1 text-xs">
                {onChainStats.contractAddress}
              </code>
              <a
                href={`https://polygonscan.com/address/${onChainStats.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
              >
                <Trans i18nKey="blockchain:viewOnPolygon" />
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Recent Blocks & Certificates */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Blockchain Records */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Trans i18nKey="blockchain:recentBlocks" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBlocks && recentBlocks.length > 0 ? (
                <div className="space-y-3">
                  {recentBlocks.map(
                    (block: {
                      id: string;
                      block_number: number | null;
                      record_hash: string;
                      created_at: string;
                      listing_id: string | null;
                    }) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {block.block_number != null && (
                              <Badge variant="secondary">
                                <Trans i18nKey="blockchain:blockNumber" /> #
                                {block.block_number}
                              </Badge>
                            )}
                            <span className="text-muted-foreground text-xs">
                              {new Date(block.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 truncate font-mono text-xs">
                            {block.record_hash}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  <Trans i18nKey="blockchain:noRecords" />
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Certificates */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Trans i18nKey="blockchain:recentCertificates" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCerts && recentCerts.length > 0 ? (
                <div className="space-y-3">
                  {recentCerts.map(
                    (cert: {
                      id: string;
                      certificate_number: string;
                      verification_hash: string | null;
                      status: string;
                      created_at: string;
                      material_type: string | null;
                      weight_kg: number | null;
                      co2_avoided: number | null;
                    }) => (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {cert.certificate_number}
                            </Badge>
                            <Badge
                              variant={
                                cert.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {cert.status}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground mt-1 flex gap-3 text-xs">
                            {cert.material_type && (
                              <span>{cert.material_type}</span>
                            )}
                            {cert.weight_kg != null && (
                              <span>{cert.weight_kg} kg</span>
                            )}
                            {cert.co2_avoided != null && (
                              <span>{cert.co2_avoided} kg CO₂</span>
                            )}
                            <span>
                              {new Date(cert.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  <Trans i18nKey="blockchain:noRecords" />
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Public Verification CTA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              <Trans i18nKey="blockchain:verifyPublic" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="blockchain:verifyPublicDesc" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              render={(buttonProps) => (
                <a {...buttonProps} href="/verify">
                  <Trans i18nKey="blockchain:goToVerify" />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </PageBody>
  );
}

export default BlockchainDashboardPage;
