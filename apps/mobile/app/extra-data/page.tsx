'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Building2,
  Users,
  Leaf,
  ShoppingCart,
  Heart,
  Plus,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { useExtraData } from '~/hooks/use-extra-data';
import type { ExternalActivityCategory } from '~/lib/queries/extra-data';

interface CategoryInfo {
  key: ExternalActivityCategory;
  icon: typeof Building2;
  color: string;
}

const CATEGORIES: CategoryInfo[] = [
  { key: 'governance', icon: Building2, color: '#6EE7B7' },
  { key: 'social', icon: Users, color: '#F59E0B' },
  { key: 'environment', icon: Leaf, color: '#34D399' },
  { key: 'procurement', icon: ShoppingCart, color: '#B8D4E3' },
  { key: 'community', icon: Heart, color: '#A78BFA' },
];

type Tab = ExternalActivityCategory;

function ExtraDataContent() {
  const t = useTranslations('extraData');
  const { activities, loading, addActivity } = useExtraData();
  const [activeTab, setActiveTab] = useState<Tab>('governance');

  const filtered = activities.filter((a) => a.category === activeTab);
  const currentCat = CATEGORIES.find((c) => c.key === activeTab)!;

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!formTitle.trim()) return;
    setSaving(true);
    try {
      await addActivity({
        category: activeTab,
        subcategory: 'general',
        title: formTitle.trim(),
        description: formDesc.trim() || undefined,
        quantitative_value: formValue ? Number(formValue) : undefined,
        quantitative_unit: formUnit.trim() || undefined,
      });
      setFormTitle('');
      setFormDesc('');
      setFormValue('');
      setFormUnit('');
      setShowForm(false);
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title={t('title')} subtitle={t('subtitle')} showBack>
      <div className="space-y-4 pb-4">
        {/* Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const count = activities.filter(
              (a) => a.category === cat.key,
            ).length;
            const isActive = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveTab(cat.key);
                  setShowForm(false);
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#F5F5F0]/[0.08] text-[#F5F5F0]'
                    : 'text-[#F5F5F0]/40'
                }`}
              >
                <cat.icon className="h-3.5 w-3.5" />
                <span>{t(cat.key)}</span>
                {count > 0 && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                    style={{
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Activity list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F5F5F0]/10 border-t-emerald-400" />
          </div>
        ) : filtered.length === 0 && !showForm ? (
          <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-6 text-center">
            <currentCat.icon
              className="mx-auto mb-2 h-8 w-8"
              style={{ color: `${currentCat.color}60` }}
            />
            <p className="text-[12px] text-[#F5F5F0]/40">
              {t('emptyCategory')}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02]">
            {filtered.map((activity, i) => (
              <div
                key={activity.id}
                className={`flex items-center gap-3 px-3.5 py-3 ${
                  i > 0 ? 'border-t border-[#F5F5F0]/[0.05]' : ''
                }`}
              >
                <FileText
                  className="h-4 w-4 shrink-0"
                  style={{ color: currentCat.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[12px] font-medium text-[#F5F5F0]">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="truncate text-[10px] text-[#F5F5F0]/35">
                      {activity.description}
                    </p>
                  )}
                </div>
                {activity.quantitative_value != null && (
                  <span className="shrink-0 text-[11px] font-medium text-[#F5F5F0]/60">
                    {activity.quantitative_value}
                    {activity.quantitative_unit
                      ? ` ${activity.quantitative_unit}`
                      : ''}
                  </span>
                )}
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#F5F5F0]/15" />
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <div className="space-y-3 rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3.5">
            <input
              type="text"
              placeholder={t('formTitlePlaceholder')}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded-xl bg-[#F5F5F0]/[0.04] px-3 py-2.5 text-[13px] text-[#F5F5F0] placeholder-[#F5F5F0]/25 outline-none focus:ring-1 focus:ring-emerald-500/30"
            />
            <textarea
              placeholder={t('formDescPlaceholder')}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              rows={2}
              className="w-full rounded-xl bg-[#F5F5F0]/[0.04] px-3 py-2.5 text-[13px] text-[#F5F5F0] placeholder-[#F5F5F0]/25 outline-none focus:ring-1 focus:ring-emerald-500/30"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={t('formValuePlaceholder')}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                className="flex-1 rounded-xl bg-[#F5F5F0]/[0.04] px-3 py-2.5 text-[13px] text-[#F5F5F0] placeholder-[#F5F5F0]/25 outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
              <input
                type="text"
                placeholder={t('formUnitPlaceholder')}
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                className="w-24 rounded-xl bg-[#F5F5F0]/[0.04] px-3 py-2.5 text-[13px] text-[#F5F5F0] placeholder-[#F5F5F0]/25 outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl bg-[#F5F5F0]/[0.04] py-2.5 text-[12px] font-medium text-[#F5F5F0]/50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !formTitle.trim()}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-[12px] font-medium text-white disabled:opacity-40"
              >
                {saving ? '...' : t('save')}
              </button>
            </div>
          </div>
        )}

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#F5F5F0]/[0.1] bg-[#F5F5F0]/[0.02] py-3 text-[12px] font-medium text-[#F5F5F0]/40 transition-colors active:bg-[#F5F5F0]/[0.04]"
          >
            <Plus className="h-4 w-4" />
            {t('addActivity')}
          </button>
        )}
      </div>
    </AppShell>
  );
}

export default function ExtraDataPage() {
  return (
    <AuthGuard>
      <ExtraDataContent />
    </AuthGuard>
  );
}
