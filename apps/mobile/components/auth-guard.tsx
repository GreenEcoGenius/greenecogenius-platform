'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '~/lib/supabase-client';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const isAuthRoute = pathname?.startsWith('/auth');
      if (!session && !isAuthRoute) {
        router.replace('/auth/sign-in');
      } else if (session && isAuthRoute) {
        router.replace('/home');
      } else {
        setReady(true);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const isAuthRoute = pathname?.startsWith('/auth');
      if (!session && !isAuthRoute) router.replace('/auth/sign-in');
      if (session && isAuthRoute) router.replace('/home');
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A2F1F]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F5F5F0] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
