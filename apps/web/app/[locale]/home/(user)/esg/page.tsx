import Link from 'next/link';

import { getTranslations } from 'next-intl/server';
import {
  BarChart3,
  ClipboardList,
  FileText,
  Lightbulb,
  TrendingDown,
} from 'lucide-react';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

export const generateMetadata = async () => {
  const t = await getTranslations('esg');

  return { title: t('title') };
};

async function ESGPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  // Check if user has an active subscription
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subscription } = await (client as any)
    .from('organization_subscriptions')
    .select('status, subscription_plans(name)')
    .eq('account_id', userId)
    .in('status', ['active', 'trialing', 'past_due'])
    .maybeSingle();

  const hasSubscription = !!subscription;

  if (!hasSubscription) {
    return <NoSubscriptionState />;
  }

  // Fetch latest ESG report if any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: latestReport } = await (client as any)
    .from('esg_reports')
    .select('*')
    .eq('account_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey="esg:title" />
        </Heading>
        <p className="text-muted-foreground text-sm">
          <Trans i18nKey="esg:subtitle" />
        </p>
      </PageHeader>

      <div className="space-y-8">
        {/* Quick links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickLinkCard
            href="/home/esg/data-entry"
            icon={<ClipboardList className="h-6 w-6 text-blue-600" />}
            titleKey="esg:dataEntry"
            color="blue"
          />
          <QuickLinkCard
            href="/home/esg/reports"
            icon={<FileText className="h-6 w-6 text-emerald-600" />}
            titleKey="esg:viewReports"
            color="emerald"
          />
          <QuickLinkCard
            href="/home/esg/reports"
            icon={<Lightbulb className="h-6 w-6 text-amber-600" />}
            titleKey="esg:recommendations"
            color="amber"
          />
        </div>

        {/* Latest report summary or empty state */}
        {latestReport ? (
          <LatestReportCard report={latestReport} />
        ) : (
          <EmptyReportState />
        )}
      </div>
    </PageBody>
  );
}

function QuickLinkCard({
  href,
  icon,
  titleKey,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  titleKey: string;
  color: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="transition-shadow duration-200 group-hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-6">
          <div
            className={`rounded-xl bg-${color}-50 dark:bg-${color}-950/30 p-3`}
          >
            {icon}
          </div>
          <span className="font-semibold">
            <Trans i18nKey={titleKey} />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ReportData {
  reporting_year?: number;
  report_type?: string;
  total_scope1?: number;
  total_scope2?: number;
  total_scope3?: number;
  total_emissions?: number;
  co2_avoided?: number;
  net_emissions?: number;
  status?: string;
}

function LatestReportCard({ report }: { report: ReportData }) {
  const totalScope1 = report.total_scope1 ?? 0;
  const totalScope2 = report.total_scope2 ?? 0;
  const totalScope3 = report.total_scope3 ?? 0;
  const totalEmissions = report.total_emissions ?? 0;
  const avoided = report.co2_avoided ?? 0;
  const netEmissions = report.net_emissions ?? totalEmissions - avoided;
  const maxScope = Math.max(totalScope1, totalScope2, totalScope3, 1);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-muted-foreground h-5 w-5" />
            <h3 className="text-lg font-semibold">
              <Trans i18nKey="esg:latestReport" />
            </h3>
            {report.reporting_year && (
              <Badge variant={'outline'}>{report.reporting_year}</Badge>
            )}
          </div>
          <Badge
            variant={report.status === 'ready' ? 'default' : 'outline'}
          >
            {report.status === 'ready' ? (
              <Trans i18nKey="esg:reportReady" />
            ) : (
              <Trans i18nKey="esg:reportPending" />
            )}
          </Badge>
        </div>

        <div className="space-y-3">
          <ScopeBar
            label="Scope 1"
            value={totalScope1}
            max={maxScope}
            color="bg-orange-500"
          />
          <ScopeBar
            label="Scope 2"
            value={totalScope2}
            max={maxScope}
            color="bg-blue-500"
          />
          <ScopeBar
            label="Scope 3"
            value={totalScope3}
            max={maxScope}
            color="bg-purple-500"
          />

          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                <Trans i18nKey="esg:scopeTotal" />
              </span>
              <span className="font-semibold">
                {totalEmissions.toFixed(0)} kg CO2e
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-600">
                <Trans i18nKey="esg:avoided" />
              </span>
              <span className="font-semibold text-emerald-600">
                -{avoided.toFixed(0)} kg CO2e
              </span>
            </div>
            <div className="mt-1 flex justify-between border-t pt-1 text-sm font-bold">
              <span>
                <Trans i18nKey="esg:netEmissions" />
              </span>
              <span>{netEmissions.toFixed(0)} kg CO2e</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScopeBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {value.toFixed(0)} kg CO2e
        </span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EmptyReportState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="bg-muted rounded-full p-4">
          <TrendingDown className="text-muted-foreground h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            <Trans i18nKey="esg:noLatestReport" />
          </h3>
          <p className="text-muted-foreground mt-1 max-w-md text-sm">
            <Trans i18nKey="esg:noReports" />
          </p>
        </div>
        <Button
          render={
            <Link href="/home/esg/data-entry">
              <Trans i18nKey="esg:dataEntry" />
            </Link>
          }
          nativeButton={false}
        />
      </CardContent>
    </Card>
  );
}

function NoSubscriptionState() {
  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey="esg:title" />
        </Heading>
      </PageHeader>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-6 py-16 text-center">
          <div className="bg-muted rounded-full p-4">
            <BarChart3 className="text-muted-foreground h-10 w-10" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              <Trans i18nKey="esg:noSubscription" />
            </h3>
            <p className="text-muted-foreground mx-auto mt-2 max-w-lg text-sm">
              <Trans i18nKey="esg:noSubscriptionDesc" />
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <ClipboardList className="h-4 w-4" />
              Scope 1/2/3
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
              <FileText className="h-4 w-4" />
              CSRD / GRI
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              <Lightbulb className="h-4 w-4" />
              AI Recommendations
            </div>
          </div>
          <Button
            render={
              <Link href="/pricing">
                <Trans i18nKey="common:pricing" />
              </Link>
            }
            nativeButton={false}
          />
        </CardContent>
      </Card>
    </PageBody>
  );
}

export default ESGPage;
