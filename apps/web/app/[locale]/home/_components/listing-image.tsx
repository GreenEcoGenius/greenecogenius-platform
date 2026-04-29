import {
  Boxes,
  CircuitBoard,
  Factory,
  FlaskConical,
  Leaf,
  Package,
  Recycle,
  Shirt,
  TreePine,
  Wine,
} from 'lucide-react';

type IconSize = 'hero' | 'thumbnail';

const ICON_CLASS: Record<IconSize, string> = {
  hero: 'h-12 w-12',
  thumbnail: 'h-6 w-6',
};

function getCategoryIcon(slug: string | null, size: IconSize) {
  const cls = ICON_CLASS[size];
  switch (slug) {
    case 'metals':
      return <Factory className={cls} strokeWidth={1} />;
    case 'plastics':
      return <Recycle className={cls} strokeWidth={1} />;
    case 'paper-cardboard':
      return <Package className={cls} strokeWidth={1} />;
    case 'glass':
      return <Wine className={cls} strokeWidth={1} />;
    case 'wood':
      return <TreePine className={cls} strokeWidth={1} />;
    case 'textiles':
      return <Shirt className={cls} strokeWidth={1} />;
    case 'electronic-waste':
      return <CircuitBoard className={cls} strokeWidth={1} />;
    case 'organic':
      return <Leaf className={cls} strokeWidth={1} />;
    case 'construction':
      return <Boxes className={cls} strokeWidth={1} />;
    case 'chemicals':
      return <FlaskConical className={cls} strokeWidth={1} />;
    default:
      return <Package className={cls} strokeWidth={1} />;
  }
}

interface ListingImageProps {
  imageUrl: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  title: string;
  size?: IconSize;
  imageCount?: number;
}

export function ListingImage({
  imageUrl,
  categorySlug,
  categoryName,
  title,
  size = 'hero',
  imageCount,
}: ListingImageProps) {
  if (size === 'thumbnail') {
    const extra = imageCount && imageCount > 1 ? imageCount - 1 : 0;

    if (imageUrl) {
      return (
        <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
          {extra > 0 && (
            <span className="absolute right-1 bottom-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
              +{extra}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="bg-[#0D3A26] flex aspect-square h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg sm:h-24 sm:w-24">
        <span className="text-verdure-500">
          {getCategoryIcon(categorySlug, 'thumbnail')}
        </span>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="bg-muted mb-6 flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl">
      <span className="text-[#B8D4E3]/50">
        {getCategoryIcon(categorySlug, 'hero')}
      </span>
      {categoryName && (
        <span className="text-[#B8D4E3] text-sm">{categoryName}</span>
      )}
    </div>
  );
}
