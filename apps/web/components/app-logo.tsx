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
      width={240}
      height={48}
      className={cn('h-9 w-auto dark:brightness-150 dark:saturate-150 sm:h-10 lg:h-11', className)}
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
