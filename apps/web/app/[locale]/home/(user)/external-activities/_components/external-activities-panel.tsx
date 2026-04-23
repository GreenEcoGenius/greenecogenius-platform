'use client';

import { useMemo, useState } from 'react';

import {
  Building2,
  FileText,
  Heart,
  Inbox,
  Leaf,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@kit/ui/utils';

import {
  EnviroEmptyState,
  EnviroFilterChips,
} from '~/components/enviro/dashboard';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
} from '~/components/enviro/enviro-card';

import { DeleteActivityButton } from './delete-activity-button';
import { ExternalActivityForm } from './external-activity-form';

type Category =
  | 'governance'
  | 'social'
  | 'environment'
  | 'procurement'
  | 'community';

const CATEGORY_ORDER: Category[] = [
  'governance',
  'social',
  'environment',
  'procurement',
  'community',
];

const CATEGORY_ICON: Record<Category, React.ReactNode> = {
  governance: <Building2 aria-hidden="true" className="h-3.5 w-3.5" />,
  social: <Users aria-hidden="true" className="h-3.5 w-3.5" />,
  environment: <Leaf aria-hidden="true" className="h-3.5 w-3.5" />,
  procurement: <ShoppingBag aria-hidden="true" className="h-3.5 w-3.5" />,
  community: <Heart aria-hidden="true" className="h-3.5 w-3.5" />,
};

export interface ExternalActivityRow {
  id: string;
  category: Category;
  subcategory: string;
  title: string;
  description: string | null;
  quantitative_value: number | null;
  quantitative_unit: string | null;
  document_path: string | null;
  document_url: string | null;
  verified: boolean;
}

const KNOWN_SUBCATEGORIES = new Set<string>([
  'board_composition',
  'anti_corruption',
  'code_of_conduct',
  'esg_committee',
  'remuneration',
  'employee_count',
  'training_rate',
  'diversity',
  'working_conditions',
  'social_dialogue',
  'water_consumption',
  'renewable_energy',
  'biodiversity',
  'zero_waste',
  'mobility',
  'local_purchasing',
  'supplier_audit',
  'responsible_procurement_policy',
  'esg_criteria',
  'patronage',
  'volunteering',
  'ngo_partnership',
  'local_action',
]);

interface ExternalActivitiesPanelProps {
  rows: ExternalActivityRow[];
  /** Map of activity id -> short-lived signed URL for uploaded documents. */
  signedUrls: Record<string, string>;
}

export function ExternalActivitiesPanel({
  rows,
  signedUrls,
}: ExternalActivitiesPanelProps) {
  const t = useTranslations('externalActivities');
  const [active, setActive] = useState<Category>('governance');

  const counts = useMemo(() => {
    const c: Record<Category, number> = {
      governance: 0,
      social: 0,
      environment: 0,
      procurement: 0,
      community: 0,
    };
    for (const r of rows) {
      if (r.category in c) c[r.category]++;
    }
    return c;
  }, [rows]);

  const visibleRows = useMemo(
    () => rows.filter((r) => r.category === active),
    [rows, active],
  );

  const activeLabel = t(`categories.${active}.label`);
  const activeDescription = t(`categories.${active}.description`);

  return (
    <div className="flex flex-col gap-6">
      <EnviroFilterChips
        ariaLabel={t('savedData')}
        value={active}
        onChange={(next) => setActive(next as Category)}
        items={CATEGORY_ORDER.map((cat) => ({
          value: cat,
          label: (
            <span className="inline-flex items-center gap-1.5">
              {CATEGORY_ICON[cat]}
              {t(`categories.${cat}.label`)}
            </span>
          ),
          count: counts[cat],
        }))}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <EnviroCard variant="cream" hover="none" padding="md">
          <EnviroCardHeader>
            <h3 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
              {t('addData', { category: activeLabel })}
            </h3>
            <p className="text-sm text-[--color-enviro-forest-700]">
              {activeDescription}
            </p>
          </EnviroCardHeader>
          <EnviroCardBody className="pt-5">
            <ExternalActivityForm category={active} />
          </EnviroCardBody>
        </EnviroCard>

        <EnviroCard variant="cream" hover="none" padding="md">
          <EnviroCardHeader>
            <h3 className="text-lg font-semibold text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
              {t('savedData')} ({visibleRows.length})
            </h3>
          </EnviroCardHeader>
          <EnviroCardBody className="pt-5">
            {visibleRows.length === 0 ? (
              <EnviroEmptyState
                icon={<Inbox aria-hidden="true" className="h-7 w-7" />}
                title={t('noDataYet')}
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {visibleRows.map((r) => (
                  <ActivityRow
                    key={r.id}
                    row={r}
                    signedUrl={signedUrls[r.id]}
                  />
                ))}
              </ul>
            )}
          </EnviroCardBody>
        </EnviroCard>
      </div>
    </div>
  );
}

function ActivityRow({
  row,
  signedUrl,
}: {
  row: ExternalActivityRow;
  signedUrl?: string;
}) {
  const t = useTranslations('externalActivities');

  const subcategoryLabel = KNOWN_SUBCATEGORIES.has(row.subcategory)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      t(`subcategories.${row.subcategory}` as any)
    : row.subcategory;

  const docHref = signedUrl ?? row.document_url ?? null;
  const docLabel = signedUrl
    ? row.document_path?.split('/').pop() ?? 'Document'
    : t('list.externalLink');

  return (
    <li className="flex items-start justify-between gap-3 rounded-[--radius-enviro-md] border border-[--color-enviro-cream-200] bg-[--color-enviro-bg-elevated] p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[--color-enviro-forest-900]">
          {row.title}
        </p>
        <p className="text-xs text-[--color-enviro-forest-700]">
          {subcategoryLabel}
          {row.quantitative_value !== null
            ? ` - ${row.quantitative_value}${row.quantitative_unit ? ` ${row.quantitative_unit}` : ''}`
            : ''}
        </p>
        {row.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-[--color-enviro-forest-700]">
            {row.description}
          </p>
        ) : null}
        {docHref ? (
          <a
            href={docHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[--color-enviro-lime-700] transition-colors hover:text-[--color-enviro-lime-800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-enviro-lime-300]/60',
              'rounded-sm',
            )}
          >
            <FileText aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="max-w-[200px] truncate">{docLabel}</span>
          </a>
        ) : null}
        {row.verified && !docHref ? (
          <span className="mt-1 inline-block rounded-[--radius-enviro-pill] bg-[--color-enviro-lime-100] px-2 py-0.5 text-[10px] font-semibold text-[--color-enviro-lime-800]">
            {t('list.proofProvided')}
          </span>
        ) : null}
      </div>
      <DeleteActivityButton id={row.id} />
    </li>
  );
}
