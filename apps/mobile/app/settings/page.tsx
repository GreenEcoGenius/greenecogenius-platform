'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, User, Bell, Globe, Lock, LogOut, FileText, CircleHelp } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';

function SettingsContent() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/auth/sign-in');
  }

  const sections: Array<{
    title: string;
    items: Array<{ icon: typeof User; label: string; value?: string; onClick?: () => void; danger?: boolean }>;
  }> = [
    {
      title: 'Compte',
      items: [
        { icon: User, label: 'Profil', value: email ?? '' },
        { icon: Lock, label: 'Sécurité' },
        { icon: Bell, label: 'Notifications' },
      ],
    },
    {
      title: 'Préférences',
      items: [
        { icon: Globe, label: 'Langue', value: 'Français' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: FileText, label: 'Conditions générales' },
        { icon: CircleHelp, label: 'Aide & contact' },
      ],
    },
    {
      title: '',
      items: [
        { icon: LogOut, label: 'Déconnexion', onClick: handleSignOut, danger: true },
      ],
    },
  ];

  return (
    <AppShell title="Réglages">
      <div className="space-y-6">
        {sections.map((section, i) => (
          <section key={i}>
            {section.title && (
              <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
                {section.title}
              </h2>
            )}
            <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03]">
              {section.items.map((item, j) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-[#F5F5F0]/5 ${
                    j > 0 ? 'border-t border-[#F5F5F0]/10' : ''
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${item.danger ? 'text-red-400' : 'text-[#F5F5F0]/70'}`}
                  />
                  <span
                    className={`flex-1 text-sm ${
                      item.danger ? 'text-red-400 font-medium' : 'text-[#F5F5F0]'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.value && (
                    <span className="truncate text-xs text-[#F5F5F0]/50">{item.value}</span>
                  )}
                  {!item.danger && <ChevronRight className="h-4 w-4 text-[#F5F5F0]/30" />}
                </button>
              ))}
            </div>
          </section>
        ))}
        <p className="pt-2 text-center text-xs text-[#F5F5F0]/30">
          GreenEcoGenius · v1.0.0
        </p>
      </div>
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
