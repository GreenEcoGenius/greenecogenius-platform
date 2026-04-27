'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Leaf, TrendingUp, Recycle, Award } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';

function HomeContent() {
  const t = useTranslations('home');
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const stats = [
    { label: t('esgScore'), value: '87', delta: '+4', icon: Leaf, color: '#B8D4E3' },
    { label: t('co2Saved'), value: '2.4t', delta: '+12%', icon: TrendingUp, color: '#F5F5F0' },
    { label: t('recycling'), value: '94%', delta: '+2%', icon: Recycle, color: '#B8D4E3' },
    { label: t('certifications'), value: '7', delta: 'B-Corp', icon: Award, color: '#F5F5F0' },
  ];

  return (
    <AppShell title={t('greeting')} subtitle={user?.email}>
      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('overview')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value, delta, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] p-4">
                <Icon className="mb-3 h-5 w-5" style={{ color }} />
                <div className="text-2xl font-bold text-[#F5F5F0]">{value}</div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-xs text-[#F5F5F0]/60">{label}</span>
                  <span className="text-xs font-medium text-[#B8D4E3]">{delta}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#F5F5F0]/50">
            {t('modules')}
          </h2>
          <div className="space-y-2">
            {[
              { name: 'Circular Economy', desc: 'Traçabilité produits' },
              { name: 'Blockchain Ledger', desc: 'Polygon network' },
              { name: 'ESG Reporting', desc: 'CSRD compliant' },
            ].map((mod) => (
              <div key={mod.name} className="flex items-center justify-between rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-[#F5F5F0]">{mod.name}</div>
                  <div className="text-xs text-[#F5F5F0]/60">{mod.desc}</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-[#B8D4E3]" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
