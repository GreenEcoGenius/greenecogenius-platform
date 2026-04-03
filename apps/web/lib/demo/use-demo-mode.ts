import { DEMO_DATA, type DemoData } from './demo-data';

const isDemoEnabled =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/**
 * Client-side hook for demo mode.
 */
export function useDemoMode(): { isDemoMode: boolean; demoData: DemoData } {
  return { isDemoMode: isDemoEnabled, demoData: DEMO_DATA };
}

/**
 * Server-side helper for demo mode (usable in server components / actions).
 */
export function getDemoMode(): { isDemoMode: boolean; demoData: DemoData } {
  return { isDemoMode: isDemoEnabled, demoData: DEMO_DATA };
}
