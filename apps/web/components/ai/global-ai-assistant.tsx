'use client';

import { usePathname } from 'next/navigation';

import { AIAssistant } from './ai-assistant';

const ROUTE_TO_AGENT: Record<string, 'comptoir' | 'carbon' | 'esg' | 'traceability' | 'rse' | 'compliance'> = {
  '/marketplace': 'comptoir',
  '/my-listings': 'comptoir',
  '/carbon': 'carbon',
  '/esg': 'esg',
  '/traceability': 'traceability',
  '/rse': 'rse',
  '/compliance': 'compliance',
};

export function GlobalAIAssistant() {
  const pathname = usePathname();

  // Determine which agent to use based on the current route
  let section: 'comptoir' | 'carbon' | 'esg' | 'traceability' | 'rse' | 'compliance' = 'comptoir';

  for (const [route, agent] of Object.entries(ROUTE_TO_AGENT)) {
    if (pathname?.includes(route)) {
      section = agent;
      break;
    }
  }

  return <AIAssistant section={section} />;
}
