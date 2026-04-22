import { cache } from 'react';

import type { Metadata } from 'next';

import { getLocale, getTranslations } from 'next-intl/server';

import { type Cms, createCmsClient } from '@kit/cms';
import { getLogger } from '@kit/shared/logger';

import {
  EnviroPageHero,
  EnviroSectionHeader,
} from '~/components/enviro';
import { FadeInSection } from '~/components/enviro/animations/fade-in-section';

import {
  type ChangelogClientEntry,
  type ChangelogType,
  ChangelogContent,
} from './_components/changelog-content';
import { ChangelogPagination } from './_components/changelog-pagination';

interface ChangelogPageProps {
  searchParams: Promise<{ page?: string }>;
}

const CHANGELOG_ENTRIES_PER_PAGE = 50;

const KNOWN_TYPES: readonly ChangelogType[] = [
  'feat',
  'fix',
  'improvement',
  'security',
  'docs',
  'chore',
];

export const generateMetadata = async (
  props: ChangelogPageProps,
): Promise<Metadata> => {
  const t = await getTranslations('changelog');
  const resolvedLanguage = await getLocale();
  const searchParams = await props.searchParams;
  const limit = CHANGELOG_ENTRIES_PER_PAGE;

  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const offset = page * limit;

  const { total } = await getContentItems(resolvedLanguage, limit, offset);

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    pagination: {
      previous: page > 0 ? `/changelog?page=${page - 1}` : undefined,
      next: offset + limit < total ? `/changelog?page=${page + 1}` : undefined,
    },
  };
};

const getContentItems = cache(
  async (language: string | undefined, limit: number, offset: number) => {
    const client = await createCmsClient();
    const logger = await getLogger();

    try {
      return await client.getContentItems({
        collection: 'changelog',
        limit,
        offset,
        content: false,
        language,
        sortBy: 'publishedAt',
        sortDirection: 'desc',
      });
    } catch (error) {
      logger.error({ error }, 'Failed to load changelog entries');

      return { total: 0, items: [] };
    }
  },
);

/**
 * Derive the entry "type" used by the chip filter from the entry tags.
 * Falls back to "feat" so older entries published before the type
 * convention still appear under the most useful filter.
 *
 * Recognised tag aliases:
 *   feat / feature / new          -> feat
 *   fix / bugfix / bug            -> fix
 *   improvement / improve / perf  -> improvement
 *   security                      -> security
 *   docs / doc / documentation    -> docs
 *   chore / maintenance           -> chore
 */
function deriveType(entry: Cms.ContentItem): ChangelogType {
  for (const tag of entry.tags ?? []) {
    const normalised = tag.slug?.toLowerCase() ?? tag.name?.toLowerCase() ?? '';

    if (
      KNOWN_TYPES.includes(normalised as ChangelogType) &&
      normalised.length > 0
    ) {
      return normalised as ChangelogType;
    }
    if (['feature', 'new'].includes(normalised)) return 'feat';
    if (['bug', 'bugfix'].includes(normalised)) return 'fix';
    if (['improve', 'perf', 'performance'].includes(normalised)) {
      return 'improvement';
    }
    if (['doc', 'documentation'].includes(normalised)) return 'docs';
    if (['maintenance', 'refactor'].includes(normalised)) return 'chore';
  }

  return 'feat';
}

/**
 * Try to extract a "version" string from the entry. Looks for a leading
 * `v1.2.3`-style token in the title, then falls back to the first tag
 * slug that looks like a version (`v\d`), then to nothing.
 */
function deriveVersion(entry: Cms.ContentItem): string | undefined {
  const titleMatch = entry.title.match(/^(v\d+\.\d+(?:\.\d+)?)/i);
  if (titleMatch) return titleMatch[1]!.toLowerCase();

  const tagVersion = entry.tags?.find((tag) =>
    /^v\d+\.\d+(?:\.\d+)?$/i.test(tag.slug ?? tag.name ?? ''),
  );
  if (tagVersion) return (tagVersion.slug ?? tagVersion.name).toLowerCase();

  return undefined;
}

function toClientEntry(
  entry: Cms.ContentItem,
  index: number,
): ChangelogClientEntry {
  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    publishedAt: entry.publishedAt,
    type: deriveType(entry),
    version: deriveVersion(entry),
    highlight: index === 0,
  };
}

export default async function ChangelogPage(props: ChangelogPageProps) {
  const t = await getTranslations('changelog');
  const language = await getLocale();
  const searchParams = await props.searchParams;

  const limit = CHANGELOG_ENTRIES_PER_PAGE;
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const offset = page * limit;

  const { total, items: entries } = await getContentItems(
    language,
    limit,
    offset,
  );

  const clientEntries = entries.map(toClientEntry);

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      <EnviroPageHero
        tag={t('heroTag')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        tone="cream"
        align="center"
      />

      <section className="bg-[--color-enviro-cream-50] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <FadeInSection>
            <EnviroSectionHeader
              tag={t('filtersTag')}
              title={t('filtersTitle')}
              tone="cream"
              align="center"
            />
          </FadeInSection>

          <ChangelogContent entries={clientEntries} />

          {clientEntries.length > 0 ? (
            <div className="mt-12 flex justify-center">
              <ChangelogPagination
                currentPage={page}
                canGoToNextPage={offset + limit < total}
                canGoToPreviousPage={page > 0}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
