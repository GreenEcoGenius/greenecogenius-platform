'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { supabase } from '~/lib/supabase-client';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.replace('/home');
  }

  async function handleMagicLink() {
    if (!email) {
      toast.error('Email requis');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Lien envoyé, vérifie tes mails');
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A2F1F] px-6 py-12">
      <div className="mx-auto w-full max-w-sm flex-1 flex flex-col justify-center">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#F5F5F0]">GreenEcoGenius</h1>
          <p className="mt-2 text-sm text-[#F5F5F0]/60">Connexion à votre compte</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F5F5F0]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-[#F5F5F0]/20 bg-[#F5F5F0]/5 px-4 py-3 text-[#F5F5F0] placeholder:text-[#F5F5F0]/40 focus:border-[#B8D4E3] focus:outline-none"
              placeholder="ervis@greenecogenius.fr"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F5F5F0]">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-[#F5F5F0]/20 bg-[#F5F5F0]/5 px-4 py-3 text-[#F5F5F0] placeholder:text-[#F5F5F0]/40 focus:border-[#B8D4E3] focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#F5F5F0] py-3 font-semibold text-[#0A2F1F] transition disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full rounded-lg border border-[#F5F5F0]/20 py-3 font-medium text-[#F5F5F0] transition disabled:opacity-50"
          >
            Magic link par email
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-[#F5F5F0]/60">
          Pas de compte ?{' '}
          <Link href="/auth/sign-up" className="text-[#B8D4E3] underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
