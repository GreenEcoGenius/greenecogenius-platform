'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Lock,
  Bell,
  CreditCard,
  Globe,
  Shield,
  FileText,
  Scale,
  CircleHelp,
  LogOut,
  ChevronRight,
  Loader2,
  Wallet,
  Megaphone,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';
import { detectInitialLocale, type Locale } from '~/lib/locale';

const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  et: 'Eesti',
};

interface SettingsItem {
  icon: typeof Lock;
  label: string;
  desc?: string;
  value?: string;
  href?: string;
  onClick?: () => void;
  color: string;
  danger?: boolean;
}

function SettingsContent() {
  const router = useRouter();
  const t = useTranslations('settings');
  const tc = useTranslations('common');

  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [locale, setLocaleValue] = useState<Locale>('fr');
  const [initials, setInitials] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.auth.getUser().then(({ data: { user } }) => {
        setEmail(user?.email ?? null);
        const name =
          user?.user_metadata?.display_name ||
          user?.email?.split('@')[0] ||
          '?';
        setDisplayName(name);
        const parts = name.trim().split(/\s+/);
        setInitials(
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase()
        );
      }),
      detectInitialLocale().then(setLocaleValue),
    ]).finally(() => setLoading(false));
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/auth/sign-in');
  }

  const sections: { title: string; items: SettingsItem[] }[] = [
    {
      title: t('account'),
      items: [
        {
          icon: Lock,
          label: t('security'),
          desc: t('securityDesc'),
          href: '/settings/security',
          color: '#6EE7B7',
        },
        {
          icon: Bell,
          label: t('notifications'),
          desc: t('notificationsDesc'),
          href: '/settings/notifications',
          color: '#F59E0B',
        },
        {
          icon: CreditCard,
          label: t('billing'),
          desc: t('billingDesc'),
          href: '/settings/billing',
          color: '#A78BFA',
        },
        {
          icon: Wallet,
          label: t('wallet'),
          desc: t('walletDesc'),
          href: '/settings/wallet',
          color: '#10B981',
        },
        {
          icon: Megaphone,
          label: t('myListings'),
          desc: t('myListingsDesc'),
          href: '/settings/my-listings',
          color: '#F97316',
        },
      ],
    },
    {
      title: t('preferences'),
      items: [
        {
          icon: Globe,
          label: t('language'),
          desc: localeLabels[locale],
          href: '/settings/language',
          color: '#B8D4E3',
        },
      ],
    },
    {
      title: t('support'),
      items: [
        {
          icon: Scale,
          label: t('legal'),
          desc: t('legalDesc'),
          href: '/settings/legal',
          color: '#F5F5F0',
        },
        {
          icon: Shield,
          label: t('privacy'),
          desc: t('privacyDesc'),
          href: '/settings/privacy',
          color: '#6EE7B7',
        },
        {
          icon: FileText,
          label: t('terms'),
          desc: t('termsDesc'),
          href: '/settings/terms',
          color: '#B8D4E3',
        },
        {
          icon: CircleHelp,
          label: t('help'),
          desc: t('helpDesc'),
          href: 'mailto:contact@greenecogenius.tech',
          color: '#F59E0B',
        },
      ],
    },
    {
      title: '',
      items: [
        {
          icon: LogOut,
          label: tc('logout'),
          desc: 'Se déconnecter de votre compte',
          onClick: handleSignOut,
          danger: true,
          color: '#EF4444',
        },
      ],
    },
  ];

  if (loading) {
    return (
      <AppShell title={t('title')}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#F5F5F0]/30" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t('title')}>
      <div className="space-y-5 pb-4">
        {/* Profile Card */}
        <Link
          href="/settings/profile"
          className="flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] transition-colors"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B8D4E3]/15">
            <span className="text-[15px] font-bold text-[#B8D4E3]">
              {initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[13px] font-medium text-[#F5F5F0]">
              {displayName}
            </span>
            <p className="text-[11px] text-[#F5F5F0]/35 truncate">{email}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#F5F5F0]/15" />
        </Link>

        {/* Sections — same pattern as More page */}
        {sections.map((section, i) => (
          <section key={i}>
            {section.title && (
              <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                {section.title}
              </h2>
            )}
            <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02]">
              {section.items.map((item, j) => {
                const inner = (
                  <>
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: item.danger
                          ? 'rgba(239,68,68,0.1)'
                          : `${item.color}12`,
                      }}
                    >
                      <item.icon
                        className="h-4 w-4"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-[13px] font-medium ${
                          item.danger ? 'text-red-400' : 'text-[#F5F5F0]'
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.desc && (
                        <p
                          className={`text-[11px] ${
                            item.danger
                              ? 'text-red-400/50'
                              : 'text-[#F5F5F0]/35'
                          }`}
                        >
                          {item.desc}
                        </p>
                      )}
                    </div>
                    {!item.danger && (
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#F5F5F0]/15" />
                    )}
                  </>
                );

                const rowClass = `flex items-center gap-3 px-3.5 py-3 transition-colors ${
                  j > 0 ? 'border-t border-[#F5F5F0]/[0.05]' : ''
                }`;

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={rowClass}
                    >
                      {inner}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`${rowClass} w-full text-left`}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <p className="pt-2 text-center text-[10px] text-[#F5F5F0]/20">
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
