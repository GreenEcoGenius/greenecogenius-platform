'use client';

import { useState } from 'react';

import {
  EnviroFilterChips,
  type EnviroFilterChipItem,
} from '~/components/enviro/dashboard';

interface FilterChipsDemoProps {
  items: EnviroFilterChipItem[];
  initial: string;
  ariaLabel: string;
}

export function FilterChipsDemo({
  items,
  initial,
  ariaLabel,
}: FilterChipsDemoProps) {
  const [value, setValue] = useState<string>(initial);

  return (
    <EnviroFilterChips
      items={items}
      value={value}
      onChange={setValue}
      ariaLabel={ariaLabel}
    />
  );
}
