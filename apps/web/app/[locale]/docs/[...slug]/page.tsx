import { cache } from 'react';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import { ContentRenderer, createCmsClient } from '@kit/cms';

import { EnviroDocsProse, EnviroDocsTOC } from '~/components/enviro/docs';

const getPageBySlug = cache(pageLoader);

interface DocumentationPageProps {
  params: Promise<{ slug: string[] }>;
}

async function pageLoader(slug: string) {
  const client = await createCmsClient();

  return client.getContentItemBySlug({ slug, collection: 'documentation' });
}

export async function generateMetadata({
  params,
}: DocumentationPageProps): Promise<Metadata> {
  const slug = (await params).slug.join('/');
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const { title, description } = page;

  return {
    title,
    description,
  };
}

async function DocumentationPage({ params }: DocumentationPageProps) {
  const slug = (await params).slug.join('/');
  const page = await getPageBySlug(slug);
  const t = await getTranslations('docs');

  if (!page) {
    notFound();
  }

  const description = page?.description ?? '';

  return (
    <div className="relative mx-auto flex w-full max-w-7xl gap-10 px-4 py-10 md:px-6 md:py-14">
      <article className="min-w-0 flex-1">
        <header className="flex flex-col gap-3 border-b border-[--color-enviro-cream-200] pb-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
            [ {t('header.breadcrumbDocs')} ]
          </span>
          <h1 className="text-3xl font-bold leading-tight text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)] md:text-4xl">
            {page.title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-base text-[--color-enviro-forest-700]">
              {description}
            </p>
          ) : null}
        </header>

        <EnviroDocsProse className="mt-2 pb-24">
          <ContentRenderer content={page.content} />
        </EnviroDocsProse>
      </article>

      <EnviroDocsTOC heading={t('article.tableOfContents')} />
    </div>
  );
}

export default DocumentationPage;
