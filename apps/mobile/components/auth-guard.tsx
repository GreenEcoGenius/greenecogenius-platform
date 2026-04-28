'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '~/hooks/use-auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname?.startsWith('/auth');

    if (!isAuthenticated && !isAuthRoute) {
      router.replace('/auth/sign-in');
    } else if (isAuthenticated && isAuthRoute) {
      router.replace('/home');
    } else {
      setReady(true);
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading || !ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A2F1F]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F5F5F0] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
