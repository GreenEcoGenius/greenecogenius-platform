'use client';
import { useTranslations } from 'next-intl';
import {
  Award,
  BarChart3,
  Target,
  Link2,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { useCompliance } from '~/hooks/use-compliance';

const LABELS = [
  {
    id: 'bcorp',
    name: 'B Corp',
    organism: 'B Lab',
    icon: '🅱️',
    color: '#6EE7B7',
  },
  {
    id: 'bas-carbone',
    name: 'Label Bas-Carbone',
    organism: 'Min. Transition Écologique',
    icon: '🌿',
    color: '#34D399',
  },
  {
    id: 'sbti',
    name: 'SBTi',
    organism: 'Science Based Targets',
    icon: '🎯',
    color: '#F59E0B',
  },
  {
    id: 'lucie',
    name: 'Label Lucie 26000',
    organism: 'Agence Lucie / AFNOR',
    icon: '🏅',
    color: '#B8D4E3',
  },
  {
    id: 'ecovadis',
    name: 'EcoVadis',
    organism: 'EcoVadis',
    icon: '📊',
    color: '#A78BFA',
  },
  {
    id: 'cdp',
    name: 'CDP',
    organism: 'CDP Worldwide',
    icon: '🌍',
    color: '#60A5FA',
  },
  {
    id: 'greentech',
    name: 'GreenTech Innovation',
    organism: 'Ecolab / Ministère',
    icon: '💚',
    color: '#6EE7B7',
  },
];

function RSEContent() {
  const t = useTranslations('rse');
  const { rows, loading } = useCompliance();

  const features = [
    {
      icon: BarChart3,
      title: t('scoreTitle'),
      desc: t('scoreDesc'),
      color: '#6EE7B7',
    },
    {
      icon: Award,
      title: t('labelsTitle'),
      desc: t('labelsDesc'),
      color: '#F59E0B',
    },
    {
      icon: Target,
      title: t('actionPlanTitle'),
      desc: t('actionPlanDesc'),
      color: '#B8D4E3',
    },
    {
      icon: Link2,
      title: t('ecosystemTitle'),
      desc: t('ecosystemDesc'),
      color: '#A78BFA',
    },
  ];

  return (
    <AppShell title={t('title')} subtitle={t('subtitle')} showBack>
      <div className="space-y-5 pb-4">
        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3.5"
            >
              <div
                className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${f.color}15` }}
              >
                <f.icon className="h-4 w-4" style={{ color: f.color }} />
              </div>
              <p className="text-[12px] font-medium text-[#F5F5F0]">{f.title}</p>
              <p className="mt-0.5 text-[10px] text-[#F5F5F0]/40">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Label eligibility */}
        <section>
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
              {t('eligibilityTitle')}
            </h2>
            <span className="text-[10px] text-[#F5F5F0]/30">
              0/{LABELS.length} {t('accessible')}
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02]">
            {LABELS.map((label, i) => (
              <div
                key={label.id}
                className={`flex items-center gap-3 px-3.5 py-3 ${
                  i > 0 ? 'border-t border-[#F5F5F0]/[0.05]' : ''
                }`}
              >
                <span className="text-lg">{label.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#F5F5F0]">
                    {label.name}
                  </p>
                  <p className="text-[10px] text-[#F5F5F0]/35">
                    {label.organism}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#F5F5F0]/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-[#F5F5F0]/40">
                    0%
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#F5F5F0]/15" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Diagnostic CTA */}
        <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-4 text-center">
          <Shield className="mx-auto mb-2 h-8 w-8 text-[#6EE7B7]/60" />
          <p className="text-[13px] font-medium text-[#F5F5F0]">
            {t('diagnosticCta')}
          </p>
          <p className="mt-1 text-[11px] text-[#F5F5F0]/40">
            {t('diagnosticCtaDesc')}
          </p>
        </div>
      </div>
    </AppShell>
  );
}

export default function RSEPage() {
  return (
    <AuthGuard>
      <RSEContent />
    </AuthGuard>
  );
}
