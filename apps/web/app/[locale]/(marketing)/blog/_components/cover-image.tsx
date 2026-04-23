import Image from 'next/image';

import { cn } from '@kit/ui/utils';

type Props = {
  title: string;
  src: string;
  preloadImage?: boolean;
  className?: string;
  /**
   * Tailwind / CSS `sizes` hint passed to the underlying next/image.
   * Defaults to a sensible value for a 3-col grid teaser. Override on
   * the article hero where the image takes the full content width.
   */
  sizes?: string;
};

export function CoverImage({
  title,
  src,
  preloadImage,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
}: Props) {
  return (
    <Image
      className={cn('block rounded-md object-cover', className)}
      src={src}
      priority={preloadImage}
      alt={`Cover image for ${title}`}
      fill
      sizes={sizes}
    />
  );
}
