'use client';

import { type VariantProps, cva } from 'class-variance-authority';

import {
  Card as KitCard,
  CardContent as KitCardContent,
  CardFooter as KitCardFooter,
  CardHeader as KitCardHeader,
  CardTitle as KitCardTitle,
} from '@kit/ui/card';
import { cn } from '@kit/ui/utils';

const enviroCardClasses = cva(
  'group/enviro-card relative flex flex-col overflow-hidden border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
  {
    variants: {
      variant: {
        cream:
          'bg-[--color-enviro-cream-50] text-[--color-enviro-forest-900] border-[--color-enviro-cream-300] shadow-[--shadow-enviro-card]',
        dark: 'bg-[--color-enviro-forest-900] text-[--color-enviro-fg-inverse] border-[--color-enviro-forest-700] shadow-[--shadow-enviro-elevated]',
        lime: 'bg-[--color-enviro-lime-300] text-[--color-enviro-forest-900] border-[--color-enviro-lime-400] shadow-[--shadow-enviro-card]',
        glass:
          'bg-white/10 text-[--color-enviro-fg-inverse] border-white/15 shadow-[--shadow-enviro-card] backdrop-blur-md',
        outline:
          'bg-transparent text-[--color-enviro-forest-900] border-[--color-enviro-cream-300]',
      },
      radius: {
        sm: 'rounded-[--radius-enviro-md]',
        md: 'rounded-[--radius-enviro-xl]',
        lg: 'rounded-[--radius-enviro-3xl]',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-[--shadow-enviro-lg]',
        glow: 'hover:shadow-[--shadow-enviro-glow-lime]',
        tilt: 'hover:[transform:perspective(800px)_rotateX(2deg)_rotateY(-2deg)]',
      },
      padding: {
        none: '',
        sm: 'p-4 md:p-5',
        md: 'p-6 md:p-8',
        lg: 'p-8 md:p-12',
      },
    },
    defaultVariants: {
      variant: 'cream',
      radius: 'md',
      hover: 'lift',
      padding: 'md',
    },
  },
);

type EnviroCardClassesProps = VariantProps<typeof enviroCardClasses>;

type KitCardProps = React.ComponentProps<typeof KitCard>;

interface EnviroCardProps
  extends Omit<KitCardProps, 'size'>,
    EnviroCardClassesProps {}

export function EnviroCard({
  variant,
  radius,
  hover,
  padding,
  className,
  children,
  ...props
}: EnviroCardProps) {
  return (
    <KitCard
      className={cn(
        enviroCardClasses({ variant, radius, hover, padding }),
        className,
      )}
      {...props}
    >
      {children}
    </KitCard>
  );
}

export function EnviroCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof KitCardHeader>) {
  return (
    <KitCardHeader
      className={cn(
        'flex flex-col gap-3 p-0 [.has-padding+&]:pt-6',
        className,
      )}
      {...props}
    />
  );
}

export function EnviroCardTitle({
  className,
  ...props
}: React.ComponentProps<typeof KitCardTitle>) {
  return (
    <KitCardTitle
      className={cn(
        'text-2xl leading-tight tracking-tight font-semibold font-[family-name:var(--font-enviro-display)]',
        className,
      )}
      {...props}
    />
  );
}

export function EnviroCardBody({
  className,
  ...props
}: React.ComponentProps<typeof KitCardContent>) {
  return (
    <KitCardContent
      className={cn(
        'p-0 text-base leading-relaxed text-current/80 font-[family-name:var(--font-enviro-sans)]',
        className,
      )}
      {...props}
    />
  );
}

export function EnviroCardFooter({
  className,
  ...props
}: React.ComponentProps<typeof KitCardFooter>) {
  return (
    <KitCardFooter
      className={cn(
        'mt-6 flex items-center gap-3 rounded-none border-t-0 bg-transparent p-0',
        className,
      )}
      {...props}
    />
  );
}

export { enviroCardClasses };
