'use client';
import { useTranslations } from 'next-intl';
import { AppShell } from '~/components/app-shell';
import { AuthGuard } from '~/components/auth-guard';

function PrivacyContent() {
  const t = useTranslations('settings');
  return (
    <AppShell title={t("privacyTitle")} showBack hideTabBar>
      <div className="space-y-5 pb-6">
        <Section title={t("privacyControllerTitle")}>
          <p>
            <strong>GreenEcoGenius OÜ</strong>, {t('privacyControllerDesc')}
          </p>
          <p className="mt-2">
            {t('privacyDpoContact')}
          </p>
        </Section>
        <Section title={t("privacyDataTitle")}>
          <p>
            {t('privacyDataIntro')}
          </p>
          <ul className="mt-2 list-disc pl-4 space-y-1">
            <li>{t('privacyDataId')}</li>
            <li>{t('privacyDataCompany')}</li>
            <li>{t('privacyDataTransactions')}</li>
            <li>{t('privacyDataEnvironment')}</li>
            <li>{t('privacyDataTechnical')}</li>
          </ul>
        </Section>
        <Section title={t("privacyPurposeTitle")}>
          <p>
            {t('privacyPurposeIntro')}
          </p>
          <ul className="mt-2 list-disc pl-4 space-y-1">
            <li>{t('privacyPurposeAccount')}</li>
            <li>{t('privacyPurposeMarketplace')}</li>
            <li>{t('privacyPurposeBlockchain')}</li>
            <li>{t('privacyPurposeCarbon')}</li>
            <li>{t('privacyPurposeEsg')}</li>
            <li>{t('privacyPurposeGenius')}</li>
            <li>{t('privacyPurposeBilling')}</li>
          </ul>
        </Section>
        <Section title={t("privacyLegalBasisTitle")}>
          <p>
            {t('privacyLegalBasisDesc')}
          </p>
        </Section>
        <Section title={t("privacyRetentionTitle")}>
          <p>
            {t('privacyRetentionDesc')}
          </p>
        </Section>
        <Section title={t("privacySubprocessorsTitle")}>
          <p>
            {t('privacySubprocessorsIntro')}
          </p>
          <ul className="mt-2 list-disc pl-4 space-y-1">
            <li>{t('privacySubSupabase')}</li>
            <li>{t('privacySubVercel')}</li>
            <li>{t('privacySubStripe')}</li>
            <li>{t('privacySubOpenai')}</li>
            <li>{t('privacySubPolygon')}</li>
          </ul>
        </Section>
        <Section title={t("privacyRightsTitle")}>
          <p>
            {t('privacyRightsIntro')}
          </p>
          <ul className="mt-2 list-disc pl-4 space-y-1">
            <li>{t('privacyRightAccess')}</li>
            <li>{t('privacyRightRectification')}</li>
            <li>{t('privacyRightErasure')}</li>
            <li>{t('privacyRightRestriction')}</li>
            <li>{t('privacyRightPortability')}</li>
            <li>{t('privacyRightObjection')}</li>
          </ul>
          <p className="mt-2">
            {t('privacyRightsContact')}
          </p>
        </Section>
        <Section title={t("privacyCookiesTitle")}>
          <p>
            {t('privacyCookiesDesc')}
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
      <div className="text-[13px] leading-relaxed text-[#F5F5F0]/70 [&_strong]:text-[#F5F5F0] [&_li]:text-[12px]">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <AuthGuard>
      <PrivacyContent />
    </AuthGuard>
  );
}
