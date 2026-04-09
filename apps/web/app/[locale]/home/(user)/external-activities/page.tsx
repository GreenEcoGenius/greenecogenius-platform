import {
  Building2,
  FileText,
  Heart,
  Leaf,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';

import {
  ExternalActivitiesService,
  type ExternalActivity,
  type ExternalActivityCategory,
} from '~/lib/services/external-activities-service';

import { SectionFooterImage } from '../_components/section-footer-image';
import { SectionHeader } from '../_components/section-header';
import { DeleteActivityButton } from './_components/delete-activity-button';
import { ExternalActivityForm } from './_components/external-activity-form';

export async function generateMetadata() {
  const t = await getTranslations('externalActivities');
  return { title: t('title') };
}

type CategoryMeta = {
  id: ExternalActivityCategory;
  icon: typeof Building2;
};

const CATEGORIES: CategoryMeta[] = [
  { id: 'governance', icon: Building2 },
  { id: 'social', icon: Users },
  { id: 'environment', icon: Leaf },
  { id: 'procurement', icon: ShoppingBag },
  { id: 'community', icon: Heart },
];

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

async function ExternalActivitiesPage() {
  const t = await getTranslations('externalActivities');
  const client = getSupabaseServerClient();
  const { data: user, error } = await requireUser(client);
  if (error || !user) return null;

  const all = await ExternalActivitiesService.listForAccount(client, user.id);

  // Generate short-lived signed URLs for any uploaded documents so the list
  // can render a working download link. External URLs go through as-is.
  const signedUrlByRowId = new Map<string, string>();
  await Promise.all(
    all
      .filter((r) => r.document_path)
      .map(async (r) => {
        const signed = await ExternalActivitiesService.getSignedDocumentUrl(
          client,
          r.document_path,
        );
        if (signed) signedUrlByRowId.set(r.id, signed);
      }),
  );

  const byCategory = new Map<ExternalActivityCategory, ExternalActivity[]>();
  for (const cat of CATEGORIES) byCategory.set(cat.id, []);
  for (const row of all) byCategory.get(row.category)?.push(row);

  return (
    <PageBody>
      <SectionHeader titleKey="externalTitle" descKey="externalDesc" />
        <Tabs defaultValue={CATEGORIES[0]!.id} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const count = byCategory.get(c.id)?.length ?? 0;
              const label = t(`categories.${c.id}.label`);
              return (
                <TabsTrigger key={c.id} value={c.id} className="gap-1.5">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{label}</span>
                  {count > 0 ? (
                    <span className="ml-1 rounded-full bg-[#A8E6C8] px-1.5 text-xs text-[#159B5C]">
                      {count}
                    </span>
                  ) : null}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {CATEGORIES.map((c) => {
            const rows = byCategory.get(c.id) ?? [];
            const label = t(`categories.${c.id}.label`);
            const description = t(`categories.${c.id}.description`);
            return (
              <TabsContent key={c.id} value={c.id} className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border bg-white p-6">
                    <h3 className="mb-1 text-lg font-semibold">
                      {t('addData', { category: label })}
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">{description}</p>
                    <ExternalActivityForm category={c.id} />
                  </div>

                  <div className="rounded-xl border bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      {t('savedData')} ({rows.length})
                    </h3>
                    {rows.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-gray-400">
                        <FileText className="h-8 w-8" strokeWidth={1.5} />
                        {t('noDataYet')}
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {rows.map((r) => {
                          const signedUrl = signedUrlByRowId.get(r.id);
                          const docHref = signedUrl ?? r.document_url ?? null;
                          const subcategoryLabel = KNOWN_SUBCATEGORIES.has(
                            r.subcategory,
                          )
                            ? t(
                                // Narrowed by KNOWN_SUBCATEGORIES above.
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                `subcategories.${r.subcategory}` as any,
                              )
                            : r.subcategory;
                          const docLabel = signedUrl
                            ? (r.document_path?.split('/').pop() ?? 'Document')
                            : t('list.externalLink');
                          return (
                            <li
                              key={r.id}
                              className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {r.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {subcategoryLabel}
                                  {r.quantitative_value !== null
                                    ? ` — ${r.quantitative_value}${r.quantitative_unit ? ` ${r.quantitative_unit}` : ''}`
                                    : ''}
                                </p>
                                {r.description ? (
                                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                    {r.description}
                                  </p>
                                ) : null}
                                {docHref ? (
                                  <a
                                    href={docHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#159B5C] hover:underline"
                                  >
                                    <FileText
                                      className="h-3.5 w-3.5"
                                      strokeWidth={1.5}
                                    />
                                    <span className="max-w-[200px] truncate">
                                      {docLabel}
                                    </span>
                                  </a>
                                ) : null}
                                {r.verified && !docHref ? (
                                  <span className="mt-1 inline-block rounded-full bg-[#E8F8F0] px-2 py-0.5 text-[10px] font-medium text-[#159B5C]">
                                    {t('list.proofProvided')}
                                  </span>
                                ) : null}
                              </div>
                              <DeleteActivityButton id={r.id} />
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <SectionFooterImage
          src="https://fnlenvefzwlncgorsmib.supabase.co/storage/v1/object/public/account_image/Home%20Page/gouvernance.png"
          alt={t('title')}
        />
    </PageBody>
  );
}

export default ExternalActivitiesPage;
