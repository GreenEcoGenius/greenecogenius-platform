'use client';
import { useTranslations } from 'next-intl';
import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';

function LegalContent() {
  const t = useTranslations('settings');
  return (
    <AppShell title={t("legalTitle")} showBack hideTabBar>
      <div className="space-y-5 pb-6">
        <Section title={t("legalEditor")}>
          <p>
            <strong>{t('legalCompany')}</strong><br />
            {t('legalCompanyType')}<br />
            {t('legalRegNumber')}<br />
            {t('legalCapital')}
          </p>
        </Section>
        <Section title={t("legalAddress")}>
          <p>
            {t('legalAddressLine1')}<br />
            {t('legalAddressLine2')}<br />
            {t('legalAddressLine3')}<br />
            {t('legalAddressCountry')}
          </p>
        </Section>
        <Section title={t("legalDirector")}>
          <p>
            <strong>{t('legalDirectorName')}</strong><br />
            {t('legalDirectorRole')}<br />
            {t('legalDirectorBoard')}
          </p>
        </Section>
        <Section title={t("legalContact")}>
          <p>
            {t('legalContactEmail')}<br />
            {t('legalContactWebsite')}
          </p>
        </Section>
        <Section title={t("legalActivity")}>
          <p>
            {t('legalActivityDesc')}<br />
            {t('legalActivityCode')}
          </p>
        </Section>
        <Section title={t("legalRegistry")}>
          <p>
            {t('legalRegistryDesc')}<br />
            {t('legalRegistryDate')}<br />
            {t('legalRegistrySource')}<span className="text-[#B8D4E3]">ariregister.rik.ee</span>
          </p>
        </Section>
        <Section title={t("legalHosting")}>
          <p>
            {t('legalHostingApp')}<br />
            <strong>Vercel Inc.</strong><br />
            340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
            <br />
            {t('legalHostingDb')}<br />
            <strong>Supabase Inc.</strong><br />
            970 Toa Payoh North #07-04, Singapore 318992
          </p>
        </Section>
        <Section title={t("legalIntellectual")}>
          <p>
            {t('legalIntellectualDesc')}
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

export default function LegalPage() {
  return (
    <AuthGuard>
      <LegalContent />
    </AuthGuard>
  );
}
