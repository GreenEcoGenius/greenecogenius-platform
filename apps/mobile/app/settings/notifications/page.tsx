'use client';

import { useEffect, useState } from 'react';
import { Bell, ShoppingBag, Leaf, Shield, Sparkles, FileText, Check, Loader2 } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { useTranslations } from 'next-intl';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';

interface NotifPrefs {
  marketplace: boolean;
  carbon: boolean;
  traceability: boolean;
  genius: boolean;
  reports: boolean;
  marketing: boolean;
}

const DEFAULT_PREFS: NotifPrefs = {
  marketplace: true,
  carbon: true,
  traceability: true,
  genius: true,
  reports: true,
  marketing: false,
};

function NotificationsContent() {
  const t = useTranslations('settings');
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.notification_prefs) {
        setPrefs({ ...DEFAULT_PREFS, ...user.user_metadata.notification_prefs });
      }
    }).finally(() => setLoading(false));
  }, []);

  function toggle(key: keyof NotifPrefs) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await supabase.auth.updateUser({
        data: { notification_prefs: prefs },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save notification prefs error:', err);
    } finally {
      setSaving(false);
    }
  }

  const items: Array<{
    key: keyof NotifPrefs;
    icon: typeof Bell;
    label: string;
    desc: string;
    color: string;
  }> = [
    { key: 'marketplace', icon: ShoppingBag, label: 'Marketplace', desc: 'Nouvelles annonces et messages', color: '#B8D4E3' },
    { key: 'carbon', icon: Leaf, label: 'Bilan Carbone', desc: 'Alertes émissions et objectifs', color: '#6EE7B7' },
    { key: 'traceability', icon: Shield, label: 'Traçabilité', desc: 'Certificats et vérifications blockchain', color: '#A78BFA' },
    { key: 'genius', icon: Sparkles, label: 'Genius IA', desc: 'Recommandations et analyses', color: '#F59E0B' },
    { key: 'reports', icon: FileText, label: 'Rapports', desc: 'Rapports ESG et conformité prêts', color: '#F5F5F0' },
    { key: 'marketing', icon: Bell, label: t('notifMarketing'), desc: 'Nouveautés et mises à jour produit', color: '#F5F5F0' },
  ];

  if (loading) {
    return (
      <AppShell title={t("notificationsTitle")} showBack hideTabBar>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#F5F5F0]/30" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("notificationsTitle")} subtitle="Gérer vos alertes" showBack hideTabBar>
      <div className="space-y-4 pb-6">
        <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04]">
          {items.map((item, i) => (
            <div
              key={item.key}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i > 0 ? 'border-t border-[#F5F5F0]/[0.05]' : ''
              }`}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${item.color}10` }}
              >
                <item.icon className="h-4 w-4" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#F5F5F0]">{item.label}</p>
                <p className="text-[11px] text-[#F5F5F0]/35">{item.desc}</p>
              </div>
              <button
                onClick={() => toggle(item.key)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  prefs[item.key] ? 'bg-[#B8D4E3]' : 'bg-[#F5F5F0]/10'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                    prefs[item.key] ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Success */}
        {saved && (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2.5 text-[12px] text-emerald-300 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Préférences enregistrées
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8D4E3] py-3.5 text-[14px] font-semibold text-[#0A2F1F] active:opacity-80 transition-opacity disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Enregistrer les préférences'
          )}
        </button>

        <p className="text-center text-[11px] text-[#F5F5F0]/25 leading-relaxed px-4">
          Les notifications push nécessitent d&apos;être activées dans les Réglages iOS de votre appareil.
        </p>
      </div>
    </AppShell>
  );
}

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsContent />
    </AuthGuard>
  );
}
