import Image from 'next/image';

export function SectionFooterImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl">
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={400}
        className={`h-48 w-full object-cover sm:h-56 lg:h-64 ${className ?? ''}`}
      />
    </div>
  );
}
