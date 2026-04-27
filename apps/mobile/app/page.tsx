'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '~/lib/supabase-client';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? '/home' : '/auth/sign-in');
    });
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0A2F1F]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#F5F5F0] border-t-transparent" />
        <p className="text-sm text-[#F5F5F0]/60">GreenEcoGenius</p>
      </div>
    </div>
  );
}
