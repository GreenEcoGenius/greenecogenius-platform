'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import { supabase } from '~/lib/supabase-client';

/**
 * Build the redirect URL for email confirmation.
 * On native iOS, use the Universal Link so the OS opens the app directly.
 * On web, fall back to the standard web callback.
 */
function getEmailRedirectUrl(): string {
  const webCallback = `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`;
  if (
    typeof window !== 'undefined' &&
    Capacitor.isNativePlatform()
  ) {
    // Universal Link registered in apple-app-site-association
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/callback?redirect_to=tech.greenecogenius.app://auth/callback`;
  }
  return webCallback;
}

export default function SignUpPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: getEmailRedirectUrl() },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success(t('emailSent'));
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A2F1F] px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F5F5F0]">{t('emailSent')}</h2>
          <p className="mt-3 text-sm text-[#F5F5F0]/60">{t('checkInbox')}</p>
          <Link href="/auth/sign-in" className="mt-6 inline-block text-[#B8D4E3] underline">{t('signIn')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A2F1F] px-6 py-12">
      <div className="mx-auto w-full max-w-sm flex-1 flex flex-col justify-center">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#F5F5F0]">{t('createAccount')}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F5F5F0]">{t('email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoCapitalize="none" autoComplete="email" required
              className="w-full rounded-lg border border-[#F5F5F0]/20 bg-[#F5F5F0]/5 px-4 py-3 text-[#F5F5F0] focus:border-[#B8D4E3] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F5F5F0]">{t('password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} autoComplete="new-password" required
              className="w-full rounded-lg border border-[#F5F5F0]/20 bg-[#F5F5F0]/5 px-4 py-3 text-[#F5F5F0] focus:border-[#B8D4E3] focus:outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-[#F5F5F0] py-3 font-semibold text-[#0A2F1F] transition disabled:opacity-50">
            {loading ? t('creating') : t('createAccount')}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-[#F5F5F0]/60">
          {t('haveAccount')}{' '}
          <Link href="/auth/sign-in" className="text-[#B8D4E3] underline">{t('signIn')}</Link>
        </p>
      </div>
    </div>
  );
}
