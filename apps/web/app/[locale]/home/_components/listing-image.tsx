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

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  metals: <Factory className="h-12 w-12" strokeWidth={1} />,
  plastics: <Recycle className="h-12 w-12" strokeWidth={1} />,
  'paper-cardboard': <Package className="h-12 w-12" strokeWidth={1} />,
  glass: <Wine className="h-12 w-12" strokeWidth={1} />,
  wood: <TreePine className="h-12 w-12" strokeWidth={1} />,
  textiles: <Shirt className="h-12 w-12" strokeWidth={1} />,
  'electronic-waste': <CircuitBoard className="h-12 w-12" strokeWidth={1} />,
  organic: <Leaf className="h-12 w-12" strokeWidth={1} />,
  construction: <Boxes className="h-12 w-12" strokeWidth={1} />,
  chemicals: <FlaskConical className="h-12 w-12" strokeWidth={1} />,
};

interface ListingImageProps {
  imageUrl: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  title: string;
}

export function ListingImage({
  imageUrl,
  categorySlug,
  categoryName,
  title,
}: ListingImageProps) {
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

  const icon = CATEGORY_ICONS[categorySlug ?? ''] ?? (
    <Package className="h-12 w-12" strokeWidth={1} />
  );

  return (
    <div className="bg-muted mb-6 flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl">
      <span className="text-muted-foreground/50">{icon}</span>
      {categoryName && (
        <span className="text-muted-foreground text-sm">{categoryName}</span>
      )}
    </div>
  );
}
