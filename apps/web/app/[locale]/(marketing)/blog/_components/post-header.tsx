import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';
import { getFormatter, getTranslations } from 'next-intl/server';

import { Cms } from '@kit/cms';
import { If } from '@kit/ui/if';

import { CoverImage } from './cover-image';

export async function PostHeader({ post }: { post: Cms.ContentItem }) {
  const t = await getTranslations('blog');
  const formatter = await getFormatter();
  const { title, publishedAt, description, image } = post;

  return (
    <header className="bg-[--color-enviro-cream-50]">
      <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 pt-12 pb-6 lg:px-8 lg:pt-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] transition-colors hover:text-[--color-enviro-cta] font-[family-name:var(--font-enviro-mono)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t('backToBlog')}
        </Link>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-5">
          <p className="text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
            <span aria-hidden="true">[ </span>
            {t('categoryTag')}
            <span aria-hidden="true"> ]</span>
          </p>

          <h1 className="text-balance text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-[-0.02em] text-[--color-enviro-forest-900] font-[family-name:var(--font-enviro-display)]">
            {title}
          </h1>

          <p className="text-xs text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-mono)]">
            {t('publishedOn')}{' '}
            <time dateTime={publishedAt}>
              {formatter.dateTime(new Date(publishedAt), {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </p>

          {description ? (
            <p
              className="text-base md:text-lg leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : null}
        </div>
      </div>

      <If condition={image}>
        {(imageUrl) => (
          <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 pb-8 lg:px-8 lg:pb-12">
            <div className="relative mx-auto aspect-[3/2] w-full max-w-4xl overflow-hidden rounded-[--radius-enviro-3xl] shadow-[--shadow-enviro-card]">
              <CoverImage
                preloadImage
                title={title}
                src={imageUrl}
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        )}
      </If>
    </header>
  );
}
