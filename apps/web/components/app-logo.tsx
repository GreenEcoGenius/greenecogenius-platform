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
      width={4232}
      height={2362}
      className={cn(
        'h-14 w-auto sm:h-20 lg:h-28',
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
      className="flex-shrink-0"
    >
      <LogoImage className={className} />
    </Link>
  );
}
