import { cache } from 'react';

import type { Metadata } from 'next';

import { getFormatter, getLocale, getTranslations } from 'next-intl/server';

import { type Cms, createCmsClient } from '@kit/cms';
import { getLogger } from '@kit/shared/logger';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import { EnviroBlogCard, EnviroPageHero } from '~/components/enviro';
import {
  StaggerContainer,
  StaggerItem,
} from '~/components/enviro/animations/stagger-container';

import { BlogPagination } from './_components/blog-pagination';

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

const BLOG_POSTS_PER_PAGE = 10;

export const generateMetadata = async (
  props: BlogPageProps,
): Promise<Metadata> => {
  const t = await getTranslations('blog');
  const resolvedLanguage = await getLocale();
  const searchParams = await props.searchParams;
  const limit = BLOG_POSTS_PER_PAGE;

  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const offset = page * limit;

  const { total } = await getContentItems(resolvedLanguage, limit, offset);

  return {
    title: t('title'),
    description: t('subtitle'),
    pagination: {
      previous: page > 0 ? `/blog?page=${page - 1}` : undefined,
      next: offset + limit < total ? `/blog?page=${page + 1}` : undefined,
    },
  };
};

const getContentItems = cache(
  async (language: string | undefined, limit: number, offset: number) => {
    const client = await createCmsClient();
    const logger = await getLogger();

    try {
      return await client.getContentItems({
        collection: 'posts',
        limit,
        offset,
        language,
        content: false,
        sortBy: 'publishedAt',
        sortDirection: 'desc',
      });
    } catch (error) {
      logger.error({ error }, 'Failed to load blog posts');

      return { total: 0, items: [] };
    }
  },
);

async function BlogPage(props: BlogPageProps) {
  const t = await getTranslations('blog');
  const language = await getLocale();
  const formatter = await getFormatter();
  const searchParams = await props.searchParams;

  const limit = BLOG_POSTS_PER_PAGE;
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const offset = page * limit;

  const { total, items: posts } = await getContentItems(
    language,
    limit,
    offset,
  );

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      <EnviroPageHero
        tag={t('heroTag')}
        title={t('title')}
        subtitle={t('subtitle')}
        tone="cream"
        align="center"
      />

      <section className="bg-[--color-enviro-cream-50] py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <If
            condition={posts.length > 0}
            fallback={
              <p className="py-20 text-center text-base text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
                <Trans i18nKey="blog.noPosts" />
              </p>
            }
          >
            <StaggerContainer
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              stagger={0.08}
            >
              {posts.map((post) => (
                <StaggerItem key={post.slug}>
                  <BlogTeaserCard
                    post={post}
                    categoryLabel={t('categoryTag')}
                    formattedDate={formatter.dateTime(
                      new Date(post.publishedAt),
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="mt-12 flex justify-center">
              <BlogPagination
                currentPage={page}
                canGoToNextPage={offset + limit < total}
                canGoToPreviousPage={page > 0}
              />
            </div>
          </If>
        </div>
      </section>
    </div>
  );
}

function BlogTeaserCard({
  post,
  categoryLabel,
  formattedDate,
}: {
  post: Cms.ContentItem;
  categoryLabel: string;
  formattedDate: string;
}) {
  return (
    <EnviroBlogCard
      href={`/blog/${post.slug}`}
      category={categoryLabel}
      title={post.title}
      excerpt={post.description ?? undefined}
      date={formattedDate}
      image={post.image ?? undefined}
      imageAlt={post.title}
    />
  );
}

export default BlogPage;
