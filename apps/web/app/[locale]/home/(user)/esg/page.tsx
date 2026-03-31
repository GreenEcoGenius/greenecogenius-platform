import Link from 'next/link';

import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Lightbulb,
  Shield,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { BenchmarkCard } from './_components/benchmark-card';
import { ESGReportAccordion } from './_components/esg-report-accordion';
import { GenerateEsgReportButton } from './_components/generate-esg-report-button';

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
    return <NoSubscriptionPreview />;
  }

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
        {/* Section 1 - Report Status Banner */}
        <ReportStatusBanner completionPct={72} autoFilled={42} remaining={6} />

        {/* Section 2 - Report Content Accordion */}
        <ESGReportAccordion />

        {/* Section 3 - Quick links */}
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

        {/* Section 4 - Benchmark */}
        <BenchmarkCard />
      </div>
    </PageBody>
  );
}

function ReportStatusBanner({
  completionPct,
  autoFilled,
  remaining,
}: {
  completionPct: number;
  autoFilled: number;
  remaining: number;
}) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">
                Reporting ESG
              </h2>
              <Badge className="border-indigo-400 bg-indigo-500/30 text-white">
                T1 2026
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                {completionPct}% <Trans i18nKey="esg:completed" />
              </span>
              <span>
                {autoFilled} <Trans i18nKey="esg:autoFilledFields" />
              </span>
              <span>
                {remaining} <Trans i18nKey="esg:fieldsRemaining" />
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-indigo-500/40">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Button
              variant="secondary"
              render={
                <Link href="/home/esg/data-entry">
                  <Trans i18nKey="esg:completeFields" />
                </Link>
              }
              nativeButton={false}
            />
            <GenerateEsgReportButton />
          </div>
        </div>
      </CardContent>
    </Card>
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
          <ChevronRight className="text-muted-foreground ml-auto h-5 w-5" />
        </CardContent>
      </Card>
    </Link>
  );
}

function NoSubscriptionPreview() {
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
        {/* Preview Banner - shows what the report would look like */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">
                    Reporting ESG
                  </h2>
                  <Badge className="border-indigo-400 bg-indigo-500/30 text-white">
                    T1 2026
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    72% <Trans i18nKey="esg:completed" />
                  </span>
                  <span>
                    42 <Trans i18nKey="esg:autoFilledFields" />
                  </span>
                  <span>
                    6 <Trans i18nKey="esg:fieldsRemaining" />
                  </span>
                </div>

                <div className="mt-4">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-indigo-500/40">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-700"
                      style={{ width: '72%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-filled overview */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              <Trans i18nKey="esg:reportContent" />
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              <Trans i18nKey="esg:noSubscriptionDesc" />
            </p>

            <div className="space-y-3">
              {[
                {
                  title: 'esg:carbonBalance',
                  pct: 94,
                  badges: ['Auto', 'Blockchain'],
                  locked: false,
                },
                {
                  title: 'esg:circularEconomy',
                  pct: 98,
                  badges: ['Auto'],
                  locked: false,
                },
                {
                  title: 'esg:climateChange',
                  pct: 72,
                  badges: ['Auto', 'Manuel'],
                  locked: true,
                },
                {
                  title: 'esg:socialImpact',
                  pct: 45,
                  badges: ['Manuel'],
                  locked: true,
                },
                {
                  title: 'esg:governance',
                  pct: 60,
                  badges: ['Manuel'],
                  locked: true,
                },
              ].map((section) => (
                <div
                  key={section.title}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    section.locked ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {section.pct >= 90 ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-400">
                        <span className="text-[10px] text-amber-500">!</span>
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      <Trans i18nKey={section.title} />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {section.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm font-semibold">
                      {section.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature pills + CTA */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
            <div className="bg-muted rounded-full p-4">
              <BarChart3 className="text-muted-foreground h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                <Trans i18nKey="esg:noSubscription" />
              </h3>
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
              <div className="flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm text-purple-700 dark:bg-purple-950/30 dark:text-purple-300">
                <Shield className="h-4 w-4" />
                Blockchain
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
      </div>
    </PageBody>
  );
}

export default ESGPage;
