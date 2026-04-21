import Link from 'next/link';

import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { type Cms, ContentRenderer } from '@kit/cms';

import { EnviroButton, EnviroNewsletterCta } from '~/components/enviro';

import { PostHeader } from './post-header';
import { PostShare } from './post-share';

export async function Post({
  post,
  content,
}: {
  post: Cms.ContentItem;
  content: unknown;
}) {
  const t = await getTranslations('blog');

  // Build absolute URL for share buttons. Falls back to a relative path on
  // the rare server contexts where the env var is missing.
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
  const fullUrl = `${siteUrl}/blog/${post.slug}`;

  return (
    <div className="flex flex-col bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900]">
      <PostHeader post={post} />

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <article className="markdoc lg:col-span-8 prose prose-neutral max-w-none prose-headings:font-[family-name:var(--font-enviro-display)] prose-headings:tracking-tight prose-a:text-[--color-enviro-cta] prose-a:no-underline hover:prose-a:underline prose-img:rounded-[--radius-enviro-xl] prose-blockquote:border-l-[--color-enviro-lime-400] prose-blockquote:bg-[--color-enviro-cream-50] prose-blockquote:not-italic">
              <ContentRenderer content={content} />
            </article>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 flex flex-col gap-8">
                <PostShare
                  url={fullUrl}
                  title={post.title}
                  shareLabel={t('shareTitle')}
                  linkedinLabel={t('shareLinkedin')}
                  twitterLabel={t('shareTwitter')}
                  emailLabel={t('shareEmail')}
                  copyLabel={t('shareCopy')}
                  copiedLabel={t('shareCopied')}
                />

                <div className="flex flex-col gap-3 rounded-[--radius-enviro-xl] border border-[--color-enviro-cream-300] bg-[--color-enviro-cream-50] p-5">
                  <p className="text-xs uppercase tracking-[0.08em] text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-mono)]">
                    <span aria-hidden="true">[ </span>
                    {t('relatedTitle')}
                    <span aria-hidden="true"> ]</span>
                  </p>
                  <p className="text-sm leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
                    {t('subtitle')}
                  </p>
                  <Link href="/blog">
                    <EnviroButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      {t('backToBlog')}
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </EnviroButton>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[--color-enviro-cream-50] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[--container-enviro-xl] px-4 lg:px-8">
          <EnviroNewsletterCta
            title={t('ctaTitle')}
            subtitle={t('ctaSub')}
            placeholder="email@entreprise.com"
            ctaLabel={t('ctaButton')}
            tone="forest"
          />
        </div>
      </section>
    </div>
  );
}
