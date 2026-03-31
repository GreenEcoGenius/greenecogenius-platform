import Link from 'next/link';

import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileText,
  Lightbulb,
  Shield,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

const PREVIEW_SECTIONS = [
  { title: 'esg:carbonBalance', pct: 94, badges: ['Auto', 'Blockchain'] },
  { title: 'esg:circularEconomy', pct: 98, badges: ['Auto'] },
  { title: 'esg:climateChange', pct: 72, badges: ['Auto', 'Manuel'] },
  { title: 'esg:socialImpact', pct: 45, badges: ['Manuel'] },
  { title: 'esg:governance', pct: 60, badges: ['Manuel'] },
];

export function NoSubscriptionPreview() {
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
        {/* Status preview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Reporting ESG</h2>
              <Badge variant="outline" className="text-xs">
                T1 2026
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                72% complete
              </span>
              <span className="text-muted-foreground">
                42 champs auto-remplis
              </span>
            </div>
            <div className="mt-3 max-w-lg">
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: '72%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections preview */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              <Trans i18nKey="esg:reportContent" />
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              <Trans i18nKey="esg:noSubscriptionDesc" />
            </p>

            <div className="space-y-3">
              {PREVIEW_SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="flex items-center justify-between rounded-lg border p-4 opacity-60"
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

        {/* CTA */}
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
                IA Recommendations
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
