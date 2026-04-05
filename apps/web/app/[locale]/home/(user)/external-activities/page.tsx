import {
  Building2,
  FileText,
  Heart,
  Leaf,
  ShoppingBag,
  Users,
} from 'lucide-react';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';

import {
  ExternalActivitiesService,
  type ExternalActivity,
  type ExternalActivityCategory,
} from '~/lib/services/external-activities-service';

import { DeleteActivityButton } from './_components/delete-activity-button';
import { ExternalActivityForm } from './_components/external-activity-form';

export async function generateMetadata() {
  return { title: 'Donnees complementaires' };
}

type CategoryMeta = {
  id: ExternalActivityCategory;
  label: string;
  icon: typeof Building2;
  description: string;
};

const CATEGORIES: CategoryMeta[] = [
  {
    id: 'governance',
    label: 'Gouvernance',
    icon: Building2,
    description:
      'Composition du conseil, politiques anti-corruption, code de conduite, comite RSE.',
  },
  {
    id: 'social',
    label: 'Social & RH',
    icon: Users,
    description:
      'Effectifs, formation, diversite, conditions de travail, dialogue social.',
  },
  {
    id: 'environment',
    label: 'Environnement',
    icon: Leaf,
    description:
      "Consommation d'eau, energies renouvelables, biodiversite, mobilite.",
  },
  {
    id: 'procurement',
    label: 'Achats',
    icon: ShoppingBag,
    description:
      'Achats locaux, audits fournisseurs, politiques achats responsables.',
  },
  {
    id: 'community',
    label: 'Communaute',
    icon: Heart,
    description:
      'Mecenat, benevolat, partenariats ONG, actions locales.',
  },
];

async function ExternalActivitiesPage() {
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
    <>
      <PageHeader
        title="Donnees complementaires"
        description="Renseignez vos activites exterieures a la plateforme pour enrichir votre score de conformite et preparer vos rapports ESG."
      />

      <PageBody>
        <Tabs defaultValue={CATEGORIES[0]!.id} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const count = byCategory.get(c.id)?.length ?? 0;
              return (
                <TabsTrigger key={c.id} value={c.id} className="gap-1.5">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{c.label}</span>
                  {count > 0 ? (
                    <span className="ml-1 rounded-full bg-emerald-100 px-1.5 text-xs text-emerald-700">
                      {count}
                    </span>
                  ) : null}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {CATEGORIES.map((c) => {
            const rows = byCategory.get(c.id) ?? [];
            return (
              <TabsContent key={c.id} value={c.id} className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl border bg-white p-6">
                    <h3 className="mb-1 text-lg font-semibold">
                      Ajouter une donnee — {c.label}
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">{c.description}</p>
                    <ExternalActivityForm category={c.id} />
                  </div>

                  <div className="rounded-xl border bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Donnees enregistrees ({rows.length})
                    </h3>
                    {rows.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-gray-400">
                        <FileText className="h-8 w-8" strokeWidth={1.5} />
                        Aucune donnee enregistree.
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {rows.map((r) => {
                          const signedUrl = signedUrlByRowId.get(r.id);
                          const docHref = signedUrl ?? r.document_url ?? null;
                          const docLabel = signedUrl
                            ? r.document_path?.split('/').pop() ?? 'Document'
                            : 'Lien externe';
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
                                  {r.subcategory}
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
                                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:underline"
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
                                  <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                    Piece justificative fournie
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
      </PageBody>
    </>
  );
}

export default ExternalActivitiesPage;
