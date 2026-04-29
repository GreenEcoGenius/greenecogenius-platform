'use client';
import { useTranslations } from 'next-intl';
import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';

function TermsContent() {
  const t = useTranslations('settings');
  return (
    <AppShell title={t("termsTitle")} showBack hideTabBar>
      <div className="space-y-5 pb-6">
        <Section title={t("termsArt1Title")}>
          <p>
            {t('termsArt1Desc')}
          </p>
        </Section>
        <Section title={t("termsArt2Title")}>
          <p>
            {t('termsArt2Desc')}
          </p>
        </Section>
        <Section title={t("termsArt3Title")}>
          <p>
            {t('termsArt3Desc')}
          </p>
        </Section>
        <Section title={t("termsArt4Title")}>
          <p>
            {t('termsArt4Desc')}
          </p>
          <p className="mt-2">
            {t('termsArt4Trial')}
          </p>
        </Section>
        <Section title={t("termsArt5Title")}>
          <p>
            {t('termsArt5Desc')}
          </p>
        </Section>
        <Section title={t("termsArt6Title")}>
          <p>
            {t('termsArt6Desc')}
          </p>
        </Section>
        <Section title={t("termsArt7Title")}>
          <p>
            {t('termsArt7Desc')}
          </p>
        </Section>
        <Section title={t("termsArt8Title")}>
          <p>
            {t('termsArt8Desc')}
          </p>
        </Section>
        <Section title={t("termsArt9Title")}>
          <p>
            {t('termsArt9Desc')}
          </p>
        </Section>
        <Section title={t("termsArt10Title")}>
          <p>
            {t('termsArt10Desc')}
          </p>
        </Section>
        <Section title={t("termsArt11Title")}>
          <p>
            {t('termsArt11Desc')}
          </p>
        </Section>
        <p className="text-center text-[10px] text-[#F5F5F0]/20">
          {t('legalLastUpdate')}
        </p>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-4">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
        {title}
      </h2>
      <div className="text-[13px] leading-relaxed text-[#F5F5F0]/70 [&_strong]:text-[#F5F5F0]">
        {children}
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <AuthGuard>
      <TermsContent />
    </AuthGuard>
  );
}
