'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Building2, Check, Loader2 } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { useTranslations } from 'next-intl';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';

function ProfileContent() {
  const router = useRouter();
  const t = useTranslations('settings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [company, setCompany] = useState('');
  const [initials, setInitials] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? '');
      const name = user.user_metadata?.display_name || user.email?.split('@')[0] || '';
      setDisplayName(name);
      setCompany(user.user_metadata?.company || '');
      setInitials(name.substring(0, 2).toUpperCase());
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: displayName.trim(),
          company: company.trim(),
        },
      });
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell title={t("profileTitle")} showBack hideTabBar>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#F5F5F0]/30" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("profileTitle")} subtitle="Gérer votre compte" showBack hideTabBar>
      <div className="space-y-5 pb-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#B8D4E3]/15 ring-2 ring-[#B8D4E3]/20">
            <span className="text-[24px] font-bold text-[#B8D4E3]">{initials}</span>
          </div>
          <p className="text-[12px] text-[#F5F5F0]/40">Touchez pour changer la photo</p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              Nom d&apos;affichage
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] px-3.5 py-3">
              <User className="h-4 w-4 shrink-0 text-[#F5F5F0]/30" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre nom"
                className="flex-1 bg-transparent text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              Email
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] px-3.5 py-3">
              <Mail className="h-4 w-4 shrink-0 text-[#F5F5F0]/20" />
              <p className="flex-1 text-[14px] text-[#F5F5F0]/40">{email}</p>
            </div>
            <p className="mt-1 px-1 text-[11px] text-[#F5F5F0]/25">
              L&apos;email ne peut pas être modifié ici
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              Entreprise
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] px-3.5 py-3">
              <Building2 className="h-4 w-4 shrink-0 text-[#F5F5F0]/30" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nom de votre entreprise"
                className="flex-1 bg-transparent text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8D4E3] py-3.5 text-[14px] font-semibold text-[#0A2F1F] active:opacity-80 transition-opacity disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Enregistré
            </>
          ) : (
            'Enregistrer les modifications'
          )}
        </button>
      </div>
    </AppShell>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
