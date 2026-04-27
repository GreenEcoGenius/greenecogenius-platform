'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { supabase } from '~/lib/supabase-client';

export default function SignUpPage() {
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
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success('Vérifie tes mails pour confirmer');
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A2F1F] px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F5F5F0]">Email envoyé</h2>
          <p className="mt-3 text-sm text-[#F5F5F0]/60">
            Confirme ton inscription via le lien reçu sur {email}
          </p>
          <Link
            href="/auth/sign-in"
            className="mt-6 inline-block text-[#B8D4E3] underline"
          >
            Retour connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0A2F1F] px-6 py-12">
      <div className="mx-auto w-full max-w-sm flex-1 flex flex-col justify-center">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#F5F5F0]">Créer un compte</h1>
          <p className="mt-2 text-sm text-[#F5F5F0]/60">Rejoindre GreenEcoGenius</p>
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
              className="w-full rounded-lg border border-[#F5F5F0]/20 bg-[#F5F5F0]/5 px-4 py-3 text-[#F5F5F0] focus:border-[#B8D4E3] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F5F5F0]">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-[#F5F5F0]/20 bg-[#F5F5F0]/5 px-4 py-3 text-[#F5F5F0] focus:border-[#B8D4E3] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#F5F5F0] py-3 font-semibold text-[#0A2F1F] transition disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-[#F5F5F0]/60">
          Déjà inscrit ?{' '}
          <Link href="/auth/sign-in" className="text-[#B8D4E3] underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
