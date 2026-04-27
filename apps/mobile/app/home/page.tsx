'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '~/components/auth-guard';
import { supabase } from '~/lib/supabase-client';

function HomeContent() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/auth/sign-in');
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A2F1F] px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F0]">GreenEcoGenius</h1>
          <p className="mt-1 text-xs text-[#F5F5F0]/60">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-[#F5F5F0]/20 px-3 py-1.5 text-xs text-[#F5F5F0]"
        >
          Déconnexion
        </button>
      </header>
      <main className="flex-1 space-y-4">
        <div className="rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/5 p-5">
          <h2 className="font-semibold text-[#F5F5F0]">Dashboard</h2>
          <p className="mt-2 text-sm text-[#F5F5F0]/60">
            Bienvenue dans la version mobile. Les modules circular economy, blockchain,
            et ESG arrivent dans les prochains sprints.
          </p>
        </div>
        <div className="rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/5 p-5">
          <h2 className="font-semibold text-[#F5F5F0]">Statut connexion</h2>
          <p className="mt-2 text-sm text-[#F5F5F0]/60">API : {process.env.NEXT_PUBLIC_API_URL}</p>
          <p className="text-sm text-[#F5F5F0]/60">Plateforme : iOS native</p>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
