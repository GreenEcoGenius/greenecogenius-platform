'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from '~/lib/supabase-client';

export default function SignUpPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName.trim() },
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-[#0A2F1F] px-6"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 mb-5">
          <Mail className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-[18px] font-bold text-[#F5F5F0] text-center">{t('emailSent')}</h2>
        <p className="mt-2 text-[13px] text-[#F5F5F0]/50 text-center max-w-[280px]">
          {t('checkInbox')}
        </p>
        <Link
          href="/auth/sign-in"
          className="mt-6 rounded-xl bg-[#B8D4E3] px-6 py-3 text-[14px] font-semibold text-[#0A2F1F] active:opacity-80"
        >
          {t('backToSignIn')}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-[#0A2F1F]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex flex-1 flex-col justify-center px-6">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="GreenEcoGenius"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
              priority
            />
          </div>
          <h1 className="text-[22px] font-bold text-[#F5F5F0]">{t('createAccount')}</h1>
          <p className="mt-1 text-[13px] text-[#F5F5F0]/40">{t('joinTagline')}</p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5">
              <p className="text-[12px] text-red-300">{error}</p>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
              {t('fullName')}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/25" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('yourName')}
                className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3.5 pl-11 pr-4 text-[15px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/25" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none"
                autoComplete="email"
                required
                placeholder="vous@entreprise.com"
                className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3.5 pl-11 pr-4 text-[15px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-[#F5F5F0]/60">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/25" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                placeholder={t('minChars')}
                className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3.5 pl-11 pr-4 text-[15px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8D4E3] py-3.5 text-[15px] font-semibold text-[#0A2F1F] transition-all active:opacity-80 disabled:opacity-40"
          >
            {loading ? t('creating') : t('createAccount')}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
        <p className="mt-8 text-center text-[13px] text-[#F5F5F0]/40">
          {t('haveAccount')}{' '}
          <Link href="/auth/sign-in" className="font-medium text-[#B8D4E3]">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
