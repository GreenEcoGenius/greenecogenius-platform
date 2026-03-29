import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@kit/ui/utils';

export function LogoImage({
  className,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <Image
      src="/images/logo.png"
      alt="GreenEcoGenius"
      width={280}
      height={56}
      className={cn(
        'h-10 w-auto mix-blend-multiply sm:h-11 lg:h-12',
        'dark:mix-blend-normal dark:invert dark:hue-rotate-180',
        className,
      )}
      priority
    />
  );
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link
      aria-label={label ?? 'GreenEcoGenius'}
      href={href ?? '/'}
      prefetch={true}
      className="mx-auto md:mx-0"
    >
      <LogoImage className={className} />
    </Link>
  );
}
