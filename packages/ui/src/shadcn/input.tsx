import * as React from 'react';

import { cn } from '#lib/utils';
import { Input as InputPrimitive } from '@base-ui/react/input';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'border-[1.5px] border-gray-200 file:text-foreground placeholder:text-gray-400 focus-visible:border-brand focus-visible:ring-brand/10 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:border-input dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-9 w-full min-w-0 rounded-xl bg-white px-4 py-2 text-sm transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 dark:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
