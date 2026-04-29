'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';
import { supabase } from '~/lib/supabase-client';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? '/home' : '/auth/sign-in');
    });
  }, [router]);

  return (
    <div
      className="flex h-screen items-center justify-center bg-[#0A2F1F]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="text-center animate-fade-in">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B8D4E3]/10">
          <Leaf className="h-8 w-8 text-[#B8D4E3] animate-pulse" />
        </div>
        <p className="text-[15px] font-semibold text-[#F5F5F0]">GreenEcoGenius</p>
        <p className="mt-1 text-[11px] text-[#F5F5F0]/40">Chargement...</p>
      </div>
    </div>
  );
}
