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
      width={320}
      height={64}
      className={cn(
        'h-12 w-auto sm:h-14 lg:h-16',
        'dark:brightness-200 dark:saturate-50',
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
