import { cn } from '@kit/ui/utils';

export function SitePageHeader({
  title,
  subtitle,
  container = true,
  className = '',
}: {
  title: string;
  subtitle: string;
  container?: boolean;
  className?: string;
}) {
  const containerClass = container ? 'container' : '';

  return (
    <div
      className={cn(
        'border-[#1A5C3E] border-b py-6 xl:py-8 2xl:py-10',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center gap-y-2 lg:gap-y-3',
          containerClass,
        )}
      >
        <h1
          className={
            'font-heading text-[#F5F5F0] text-3xl tracking-tighter xl:text-5xl dark:text-white'
          }
        >
          {title}
        </h1>

        <h2 className={'text-[#B8D4E3] text-lg tracking-tight 2xl:text-2xl'}>
          {subtitle}
        </h2>
      </div>
    </div>
  );
}
