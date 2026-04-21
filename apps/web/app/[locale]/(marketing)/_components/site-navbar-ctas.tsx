'use client';

import Link from 'next/link';

import { LayoutDashboard } from 'lucide-react';

import { JWTUserData } from '@kit/supabase/types';
import { Trans } from '@kit/ui/trans';

import { EnviroButton } from '~/components/enviro';
import pathsConfig from '~/config/paths.config';

interface SiteNavbarCtasProps {
  user: JWTUserData | null;
  /** "primary" returns the high-emphasis right-most CTA (Sign Up / Dashboard). */
  /** "secondary" returns the lower-emphasis CTA (Sign In, only when logged out). */
  slot: 'primary' | 'secondary';
}

/**
 * Auth-aware CTAs rendered in the EnviroNavbar shell.
 *
 * - Logged out: primary = Sign Up (ember filled), secondary = Sign In
 *   (secondary outline).
 * - Logged in:  primary = Dashboard (lime accent), secondary = null.
 *
 * This component exists because EnviroNavbar is a Client Component but the
 * marketing layout is a Server Component (it calls `requireUser`). We keep
 * the auth state on the server and only ship a tiny client island with the
 * Trans + Link renderers.
 */
export function SiteNavbarCtas({ user, slot }: SiteNavbarCtasProps) {
  if (user) {
    if (slot === 'primary') {
      return (
        <Link href={pathsConfig.app.home}>
          <EnviroButton variant="primary" size="sm">
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
            <Trans i18nKey="common.dashboardTabLabel" />
          </EnviroButton>
        </Link>
      );
    }

    return null;
  }

  if (slot === 'primary') {
    return (
      <Link href={pathsConfig.auth.signUp}>
        <EnviroButton variant="primary" size="sm">
          <Trans i18nKey="auth.signUp" />
        </EnviroButton>
      </Link>
    );
  }

  // Use the cream-bordered variant so the button stays legible on the
  // forest-toned navbar shipped by Phase 5.
  return (
    <Link href={pathsConfig.auth.signIn}>
      <EnviroButton variant="outlineCream" size="sm">
        <Trans i18nKey="auth.signIn" />
      </EnviroButton>
    </Link>
  );
}
