import { getLocale, getTranslations } from 'next-intl/server';

import { EnviroDocsCard } from '~/components/enviro/docs';

import { getDocs } from './_lib/server/docs.loader';

type DocsPageProps = {
  params: Promise<{ locale?: string }>;
};

export const generateMetadata = async () => {
  const t = await getTranslations('docs');

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
};

async function DocsPage({ params }: DocsPageProps) {
  const t = await getTranslations('docs');
  let { locale } = await params;

  if (!locale) {
    locale = await getLocale();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-8 px-4 py-10 md:px-6 md:py-14">
      <header className="flex flex-col gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
          [ {t('header.breadcrumbDocs')} ]
        </span>
        <h1 className="text-3xl font-bold leading-tight text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)] md:text-4xl">
          {t('title')}
        </h1>
        <p className="max-w-2xl text-base text-[--color-enviro-forest-700]">
          {t('subtitle')}
        </p>
      </header>

      <DocsCardsList locale={locale} emptyState={t('sidebar.emptyState')} />
    </div>
  );
}

async function DocsCardsList({
  locale,
  emptyState,
}: {
  locale: string;
  emptyState: string;
}) {
  const items = await getDocs(locale);

  // Filter out child pages so the index only shows top-level entries.
  const cards = items.filter((item) => !item.parentId);
  const cardsSorted = [...cards].sort((a, b) => a.order - b.order);

  if (cardsSorted.length === 0) {
    return (
      <p className="rounded-[--radius-enviro-md] border border-dashed border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] px-4 py-6 text-center text-sm text-[--color-enviro-forest-700]">
        {emptyState}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {cardsSorted.map((item) => (
        <EnviroDocsCard
          key={item.id}
          title={item.title}
          description={item.description}
          href={`/docs/${item.slug}`}
        />
      ))}
    </div>
  );
}

export default DocsPage;
