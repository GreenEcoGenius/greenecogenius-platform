'use client';

import { type VariantProps, cva } from 'class-variance-authority';

import { Button as KitButton } from '@kit/ui/button';
import { cn } from '@kit/ui/utils';

import { MagneticWrapper } from './animations/magnetic-wrapper';

const enviroButtonClasses = cva(
  'group/enviro-button relative inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[--color-enviro-lime-300]/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[--color-enviro-cta] text-[--color-enviro-cta-fg] shadow-[--shadow-enviro-md] hover:bg-[--color-enviro-cta-hover] hover:shadow-[--shadow-enviro-lg]',
        secondary:
          'border border-[--color-enviro-forest-700] bg-transparent text-[--color-enviro-forest-900] hover:bg-[--color-enviro-forest-900] hover:text-[--color-enviro-fg-inverse]',
        outlineCream:
          'border border-[--color-enviro-cream-300] bg-transparent text-[--color-enviro-fg-inverse] hover:bg-[--color-enviro-fg-inverse] hover:text-[--color-enviro-forest-900]',
        ghost:
          'bg-transparent text-[--color-enviro-forest-900] hover:bg-[--color-enviro-cream-100]',
        lime: 'bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900] hover:bg-[--color-enviro-lime-400]',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-[--radius-enviro-sm]',
        md: 'h-11 px-6 text-base rounded-[--radius-enviro-md]',
        lg: 'h-14 px-8 text-base rounded-[--radius-enviro-lg]',
        pill: 'h-12 px-8 text-base rounded-[--radius-enviro-pill]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type EnviroButtonClassesProps = VariantProps<typeof enviroButtonClasses>;

type KitButtonProps = React.ComponentProps<typeof KitButton>;

interface EnviroButtonProps
  extends Omit<KitButtonProps, 'variant' | 'size'>,
    EnviroButtonClassesProps {
  /** Wraps the button in `MagneticWrapper`. Disabled under reduced motion. */
  magnetic?: boolean;
  /** Magnetic strength in pixels. Forwarded to MagneticWrapper. */
  magneticStrength?: number;
}

/**
 * Enviro-flavoured button. Wraps `@kit/ui/button` (Base UI underneath) and
 * adds:
 *   - 5 brand variants (`primary`, `secondary`, `outlineCream`, `ghost`,
 *     `lime`);
 *   - 4 sizes (`sm`, `md`, `lg`, `pill`);
 *   - optional `magnetic` effect on hover.
 *
 * Inherits everything else from `KitButton` (asChild not exposed because the
 * underlying primitive does not support it; use `<a>` children with `as-link`
 * styling at the page level when needed).
 */
export function EnviroButton({
  variant,
  size,
  magnetic = false,
  magneticStrength,
  className,
  ...props
}: EnviroButtonProps) {
  const buttonNode = (
    <KitButton
      variant="custom"
      size="custom"
      className={cn(enviroButtonClasses({ variant, size }), className)}
      {...props}
    />
  );

  if (magnetic) {
    return (
      <MagneticWrapper strength={magneticStrength}>
        {buttonNode}
      </MagneticWrapper>
    );
  }

  return buttonNode;
}

export { enviroButtonClasses };
