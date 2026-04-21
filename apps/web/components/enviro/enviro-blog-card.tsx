import type { ReactNode } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@kit/ui/utils';

interface EnviroBlogCardProps {
  /** Internal href to the article. */
  href: string;
  /** Already-translated category. */
  category: ReactNode;
  /** Already-translated title. */
  title: ReactNode;
  /** Already-translated excerpt. */
  excerpt?: ReactNode;
  /** Already-formatted publication date string. */
  date?: ReactNode;
  /** Cover image URL (AVIF or WebP recommended). */
  image?: string;
  /** Translated alt text. */
  imageAlt?: string;
  /** Optional author name (translated). */
  author?: ReactNode;
  className?: string;
}

/**
 * Blog teaser card. 3:2 image, category bracket-tag, display title, soft
 * lift on hover. Links via Next.js `Link`.
 */
export function EnviroBlogCard({
  href,
  category,
  title,
  excerpt,
  date,
  image,
  imageAlt,
  author,
  className,
}: EnviroBlogCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group/blog-card flex flex-col gap-4 rounded-[--radius-enviro-lg] bg-[--color-enviro-cream-50] p-4 text-[--color-enviro-forest-900] shadow-[--shadow-enviro-card] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[--shadow-enviro-lg]',
        className,
      )}
    >
      {image ? (
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[--radius-enviro-md] bg-[--color-enviro-cream-100]">
          <Image
            src={image}
            alt={imageAlt ?? ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover/blog-card:scale-[1.04]"
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-3 px-1 pb-3">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.04em] font-[family-name:var(--font-enviro-mono)]">
          <span className="text-[--color-enviro-forest-700]">
            <span aria-hidden="true">[</span>
            <span className="px-1">{category}</span>
            <span aria-hidden="true">]</span>
          </span>
          {date ? (
            <span className="text-[--color-enviro-forest-600]">{date}</span>
          ) : null}
        </div>

        <h3 className="text-xl leading-snug font-semibold font-[family-name:var(--font-enviro-display)] text-[--color-enviro-forest-900] group-hover/blog-card:underline underline-offset-4">
          {title}
        </h3>

        {excerpt ? (
          <p className="text-sm leading-relaxed text-[--color-enviro-forest-700] font-[family-name:var(--font-enviro-sans)]">
            {excerpt}
          </p>
        ) : null}

        {author ? (
          <p className="text-xs text-[--color-enviro-forest-600] font-[family-name:var(--font-enviro-sans)]">
            {author}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
