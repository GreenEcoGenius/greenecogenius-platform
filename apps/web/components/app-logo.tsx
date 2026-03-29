import Link from 'next/link';

import { cn } from '@kit/ui/utils';

export function LogoImage({
  className,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <span
      className={cn(
        'flex items-baseline gap-0 text-lg font-bold tracking-tight lg:text-xl',
        className,
      )}
    >
      <span className="text-[#064E3B] dark:text-[#D1FAE5]">Green</span>
      <span className="text-[#059669] dark:text-[#6EE7B7]">Eco</span>
      <span className="text-[#064E3B] dark:text-[#D1FAE5]">Genius</span>
    </span>
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
