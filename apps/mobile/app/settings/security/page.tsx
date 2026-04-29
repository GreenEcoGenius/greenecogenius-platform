'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, Check, Loader2, ShieldCheck } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { useTranslations } from 'next-intl';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';

function SecurityContent() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const t = useTranslations('settings');
  const [error, setError] = useState<string | null>(null);

  const isValid = newPw.length >= 8 && newPw === confirmPw;

  async function handleChangePassword() {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const { error: err } = await supabase.auth.updateUser({
        password: newPw,
      });
      if (err) throw err;
      setSaved(true);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      if (msg.includes('same')) {
        setError('Le nouveau mot de passe doit être différent de l\'ancien');
      } else {
        setError(msg);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title={t("securityTitle")} subtitle="Mot de passe et accès" showBack hideTabBar>
      <div className="space-y-5 pb-6">
        {/* Icon */}
        <div className="flex justify-center py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        {/* Password form */}
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              Nouveau mot de passe
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] px-3.5 py-3">
              <Lock className="h-4 w-4 shrink-0 text-[#F5F5F0]/30" />
              <input
                type={showNew ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 8 caractères"
                className="flex-1 bg-transparent text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/20 focus:outline-none"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="text-[#F5F5F0]/30"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPw.length > 0 && newPw.length < 8 && (
              <p className="mt-1 px-1 text-[11px] text-amber-400">
                Minimum 8 caractères requis
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              Confirmer le mot de passe
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] px-3.5 py-3">
              <Lock className="h-4 w-4 shrink-0 text-[#F5F5F0]/30" />
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Retapez le mot de passe"
                className="flex-1 bg-transparent text-[14px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/20 focus:outline-none"
              />
              {confirmPw.length > 0 && confirmPw === newPw && (
                <Check className="h-4 w-4 text-emerald-400" />
              )}
            </div>
            {confirmPw.length > 0 && confirmPw !== newPw && (
              <p className="mt-1 px-1 text-[11px] text-red-400">
                Les mots de passe ne correspondent pas
              </p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-2.5 text-[12px] text-red-300">
            {error}
          </div>
        )}

        {/* Success */}
        {saved && (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-2.5 text-[12px] text-emerald-300 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Mot de passe modifié avec succès
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleChangePassword}
          disabled={!isValid || saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8D4E3] py-3.5 text-[14px] font-semibold text-[#0A2F1F] active:opacity-80 transition-opacity disabled:opacity-30"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Modifier le mot de passe'
          )}
        </button>

        {/* Info */}
        <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-4">
          <p className="text-[11px] text-[#F5F5F0]/40 leading-relaxed">
            Votre compte est protégé par un chiffrement de bout en bout. Le mot de passe doit contenir au minimum 8 caractères. Nous recommandons d&apos;utiliser un mélange de lettres, chiffres et caractères spéciaux.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

export default function SecurityPage() {
  return (
    <AuthGuard>
      <SecurityContent />
    </AuthGuard>
  );
}
