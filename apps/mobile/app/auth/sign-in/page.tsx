'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '~/lib/supabase-client';

export default function SignInPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.replace('/home');
    }
  }

  async function handleMagicLink() {
    if (!email) return;
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithOtp({ email });
    if (err) {
      setError(err.message);
    } else {
      setError('');
      alert(t('emailSent'));
    }
    setLoading(false);
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
          <h1 className="text-[22px] font-bold text-[#F5F5F0]">GreenEcoGenius</h1>
          <p className="mt-1 text-[13px] text-[#F5F5F0]/40">{t('tagline')}</p>
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
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-3.5 pl-11 pr-4 text-[15px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/25 focus:border-[#B8D4E3]/30 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B8D4E3] py-3.5 text-[15px] font-semibold text-[#0A2F1F] transition-all active:opacity-80 disabled:opacity-40"
          >
            {loading ? t('signingIn') : t('signIn')}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading || !email}
            className="w-full rounded-xl border border-[#F5F5F0]/[0.08] py-3.5 text-[14px] font-medium text-[#F5F5F0]/70 transition-all active:bg-[#F5F5F0]/[0.04] disabled:opacity-30"
          >
            {t('magicLink')}
          </button>
        </form>
        <p className="mt-8 text-center text-[13px] text-[#F5F5F0]/40">
          {t('noAccount')}{' '}
          <Link href="/auth/sign-up" className="font-medium text-[#B8D4E3]">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
