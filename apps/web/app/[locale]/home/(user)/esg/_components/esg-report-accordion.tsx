'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

import type {
  ReportSection,
  SectionStatus,
  SourceType,
} from '../_lib/esg-mock-data';

const SOURCE_STYLES: Record<
  SourceType,
  { variant: 'default' | 'secondary' | 'outline'; className: string }
> = {
  auto: {
    variant: 'default',
    className:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  manual: {
    variant: 'outline',
    className:
      'border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-300',
  },
  blockchain: {
    variant: 'secondary',
    className:
      'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  },
};

function getSourceLabel(source: SourceType): string {
  switch (source) {
    case 'auto':
      return 'Auto';
    case 'manual':
      return 'Manuel';
    case 'blockchain':
      return 'Blockchain';
  }
}

function getStatusIcon(status: SectionStatus, pct: number) {
  if (status === 'complete' || pct >= 90) {
    return <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />;
  }
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-teal-400">
      <span className="text-[10px] font-bold text-teal-500">!</span>
    </div>
  );
}

export function ESGReportAccordion({
  sections,
}: {
  sections: ReportSection[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-sm font-semibold">Contenu du rapport</h3>

        <div className="space-y-2">
          {sections.map((section) => {
            const isExpanded = expandedId === section.id;
            const isComplete =
              section.status === 'complete' || section.completionPct >= 90;

            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-lg border"
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : section.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(section.status, section.completionPct)}
                    <span className="text-sm font-medium">
                      {section.esrsCode && (
                        <span className="text-muted-foreground mr-1.5 font-normal">
                          {section.esrsCode}
                        </span>
                      )}
                      <Trans i18nKey={section.titleKey} />
                    </span>
                    {section.id === 'methodology' && (
                      <Badge
                        variant="outline"
                        className="border-purple-300 text-[10px] text-purple-600"
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        Auto
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden gap-1 sm:flex">
                      {section.sources.map((source) => {
                        const style = SOURCE_STYLES[source];
                        return (
                          <Badge
                            key={source}
                            variant={style.variant}
                            className={`text-[10px] ${style.className}`}
                          >
                            {getSourceLabel(source)}
                          </Badge>
                        );
                      })}
                    </div>
                    <span
                      className={`min-w-[3rem] text-right text-sm font-semibold ${
                        isComplete ? 'text-emerald-600' : 'text-teal-600'
                      }`}
                    >
                      {section.completionPct}%
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <ChevronRight className="text-muted-foreground h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t bg-gray-50/50 px-4 py-3 dark:bg-gray-900/20">
                    {/* Description */}
                    {section.description && (
                      <p className="text-muted-foreground mb-3 text-xs italic">
                        {section.description}
                      </p>
                    )}

                    {/* Fields list */}
                    {section.fields.length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        {section.fields.map((field) => (
                          <div
                            key={field.label}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {field.complete ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-teal-300" />
                              )}
                              <span
                                className={
                                  field.complete ? '' : 'text-muted-foreground'
                                }
                              >
                                {field.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">
                                {field.value}
                              </span>
                              {field.sourceLink ? (
                                <Link href={field.sourceLink}>
                                  <Badge
                                    variant={
                                      SOURCE_STYLES[field.source].variant
                                    }
                                    className={`cursor-pointer text-[9px] hover:opacity-80 ${SOURCE_STYLES[field.source].className}`}
                                  >
                                    {field.sourceLabel ??
                                      getSourceLabel(field.source)}
                                  </Badge>
                                </Link>
                              ) : (
                                <Badge
                                  variant={SOURCE_STYLES[field.source].variant}
                                  className={`text-[9px] ${SOURCE_STYLES[field.source].className}`}
                                >
                                  {field.sourceLabel ??
                                    getSourceLabel(field.source)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Blockchain hash */}
                    {section.blockchainHash && (
                      <p className="text-muted-foreground mb-2 font-mono text-[10px]">
                        Hash blockchain : {section.blockchainHash}
                      </p>
                    )}

                    {/* Progress bar */}
                    <div className="bg-muted h-1.5 w-full max-w-md overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete ? 'bg-emerald-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${section.completionPct}%` }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {!isComplete && section.wizardStep !== undefined && (
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs"
                          render={
                            <Link
                              href={`/home/esg/wizard?step=${section.wizardStep}`}
                            >
                              <Bot className="mr-1 h-3 w-3" />
                              Completer avec l&apos;IA
                              {section.estimatedMinutes &&
                                ` (~${section.estimatedMinutes} min)`}
                            </Link>
                          }
                          nativeButton={false}
                        />
                      )}
                      {section.linkHref && section.linkLabelKey && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          render={
                            <Link href={section.linkHref}>
                              <Trans i18nKey={section.linkLabelKey} />
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Link>
                          }
                          nativeButton={false}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
