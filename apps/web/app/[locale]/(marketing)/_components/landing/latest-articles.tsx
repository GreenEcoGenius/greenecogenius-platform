import { cache } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { createCmsClient } from '@kit/cms';

import { AnimateOnScroll } from '../animate-on-scroll';

const getLatestPosts = cache(async (language: string | undefined) => {
  const client = await createCmsClient();

  try {
    return await client.getContentItems({
      collection: 'posts',
      limit: 2,
      offset: 0,
      language,
      content: false,
      sortBy: 'publishedAt',
      sortDirection: 'desc',
    });
  } catch {
    return { total: 0, items: [] };
  }
});

export async function LatestArticles() {
  const t = await getTranslations('marketing');
  const language = await getLocale();
  const { items: posts } = await getLatestPosts(language);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-metal-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation="fade-up">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-primary mb-2 text-sm font-semibold tracking-wider uppercase">
                Blog
              </p>
              <h2 className="text-metal-900 text-3xl font-bold tracking-tight sm:text-4xl">
                {t('blog')}
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-primary hidden items-center gap-1 text-sm font-semibold transition-colors hover:underline sm:flex"
            >
              {t('blogViewAll', { defaultValue: 'Voir tout' })}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Desktop: 2 cards side by side */}
        <div className="mt-10 hidden gap-8 md:grid md:grid-cols-2">
          {posts.map((post, idx) => (
            <AnimateOnScroll key={post.slug} animation="fade-up" delay={idx * 150}>
              <ArticleCard post={post} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* Mobile: horizontal scroll carousel */}
        <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:hidden">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="min-w-[85vw] max-w-[85vw] flex-shrink-0 snap-center"
            >
              <ArticleCard post={post} />
            </div>
          ))}
        </div>

        {/* Mobile "Voir tout" link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/blog"
            className="text-primary inline-flex items-center gap-1 text-sm font-semibold"
          >
            {t('blogViewAll', { defaultValue: 'Voir tout' })}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ post }: { post: { slug: string; title: string; description?: string; image?: string; publishedAt: string } }) {
  const date = new Date(post.publishedAt);
  const formatted = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      {post.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <time className="text-metal-500 text-xs font-medium">{formatted}</time>
        <h3 className="text-metal-900 mt-2 text-lg font-semibold leading-snug group-hover:underline">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-metal-600 mt-2 line-clamp-3 text-sm leading-relaxed">
            {post.description}
          </p>
        )}
      </div>
    </Link>
  );
}
