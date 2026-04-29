'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';

import Link from 'next/link';

import {
  Building2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Heart,
  Leaf,
  Handshake,
  Sparkles,
  Users,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

import { RSE_PILLARS, TOTAL_QUESTIONS } from '~/lib/config/rse-pillars';
import type { RSEPillar, RSEQuestion } from '~/lib/config/rse-pillars';
import { calculateRSEScore } from '~/lib/services/rse-score-service';
import type { RSEResult } from '~/lib/services/rse-score-service';

import { useChat } from '~/components/ai/chat-context';

import { saveDiagnostic } from '../../_lib/rse-actions';
import { generateRSEReport } from '../../_lib/rse-pdf';

const PILLAR_ICONS: Record<string, React.ElementType> = {
  Building2, Users, Leaf, Handshake, Heart,
};

function getLabel(q: RSEQuestion, locale: string) {
  return locale === 'fr' ? q.question_fr : q.question_en;
}

function getHelp(q: RSEQuestion, locale: string) {
  return locale === 'fr' ? q.help_fr : q.help_en;
}

function getPillarName(p: RSEPillar, locale: string) {
  return locale === 'fr' ? p.name_fr : p.name_en;
}

function getPillarDesc(p: RSEPillar, locale: string) {
  return locale === 'fr' ? p.description_fr : p.description_en;
}

function ScaleQuestion({
  question,
  value,
  onChange,
  locale,
}: {
  question: RSEQuestion;
  value: number | undefined;
  onChange: (v: number) => void;
  locale: string;
}) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="rounded-xl border border-[#D5E8DD] bg-card p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900">{getLabel(question, locale)}</p>
        {question.auto_from && (
          <Badge variant="outline" className="shrink-0 border-[#8FDAB5] bg-[#E6F7EF] text-[10px] text-[#008F5A]">
            Auto
          </Badge>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowHelp(!showHelp)}
        className="mb-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
      >
        {showHelp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {getHelp(question, locale)}
      </button>

      {showHelp && (
        <p className="mb-3 rounded-lg bg-[#E8F5EE] p-2 text-xs text-gray-500">
          {getHelp(question, locale)}
        </p>
      )}

      {question.type === 'scale' && question.options && (
        <div className="space-y-2">
          {question.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${
                value === opt.value
                  ? 'border-[#8FDAB5] bg-[#E6F7EF] text-[#008F5A]'
                  : 'border-[#D5E8DD] hover:border-[#C5DDD0] hover:bg-[#E8F5EE]'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="accent-[#00A86B]"
              />
              <span className="flex-1">{locale === 'fr' ? opt.label_fr : opt.label_en}</span>
              <span className="text-xs text-gray-400">{opt.value}/{question.max_score}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'boolean' && (
        <div className="flex gap-3">
          {[
            { val: question.max_score, lbl: locale === 'fr' ? 'Oui' : 'Yes' },
            { val: 0, lbl: locale === 'fr' ? 'Non' : 'No' },
          ].map((opt) => (
            <label
              key={opt.val}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                value === opt.val
                  ? 'border-[#8FDAB5] bg-[#E6F7EF] text-[#008F5A]'
                  : 'border-[#D5E8DD] hover:border-[#C5DDD0] hover:bg-[#E8F5EE]'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.val}
                checked={value === opt.val}
                onChange={() => onChange(opt.val)}
                className="accent-[#00A86B]"
              />
              {opt.lbl}
            </label>
          ))}
        </div>
      )}

      {question.type === 'text' && (
        <input
          type="text"
          className="w-full rounded-lg border border-[#C5DDD0] px-3 py-2 text-sm outline-none focus:border-[#8FDAB5] focus:ring-1 focus:ring-[#8FDAB5]"
          placeholder={locale === 'fr' ? 'Votre reponse...' : 'Your answer...'}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
      )}

      {question.labels_impacted.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {question.labels_impacted.map((l) => (
            <span key={l} className="rounded bg-[#E8F5EE] px-1.5 py-0.5 text-[10px] text-gray-400">
              {l.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function RadarChart({ scores }: { scores: { name: string; percentage: number }[] }) {
  const cx = 150;
  const cy = 150;
  const maxR = 100;
  const angleStep = (2 * Math.PI) / scores.length;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, radius: number) {
    const angle = startAngle + index * angleStep;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const dataPoints = scores.map((s, i) => {
    const r = (Math.min(s.percentage, 100) / 100) * maxR;
    return getPoint(i, r);
  });

  return (
    <svg viewBox="0 0 300 300" className="mx-auto h-64 w-64 sm:h-72 sm:w-72">
      {gridLevels.map((level) => {
        const points = scores.map((_, i) => {
          const p = getPoint(i, maxR * level);
          return `${p.x},${p.y}`;
        }).join(' ');
        return <polygon key={level} points={points} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
      })}
      {scores.map((_, i) => {
        const p = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth="1" />;
      })}
      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="rgba(13,148,136,0.2)"
        stroke="#00A86B"
        strokeWidth="2"
      />
      {scores.map((s, i) => {
        const p = getPoint(i, maxR + 24);
        return (
          <text key={s.name} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-current text-[0.6rem]">
            {s.name}
          </text>
        );
      })}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#00A86B" />
      ))}
    </svg>
  );
}

export function DiagnosticWizard() {
  const t = useTranslations('rse');
  const locale = useLocale();
  const { openChatWithPrompt } = useChat();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [result, setResult] = useState<RSEResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalSteps = RSE_PILLARS.length + 2; // overview + 5 pillars + results

  const answeredCount = useMemo(
    () => Object.keys(answers).filter((k) => answers[k] !== '' && answers[k] !== undefined).length,
    [answers],
  );

  const updateAnswer = useCallback((id: string, value: number | string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleFinish = useCallback(() => {
    const res = calculateRSEScore(answers);
    setResult(res);
    setStep(totalSteps - 1);
    startTransition(async () => {
      try { await saveDiagnostic(answers); } catch { /* noop */ }
    });
  }, [answers, totalSteps]);

  const currentPillar = step >= 1 && step <= RSE_PILLARS.length ? RSE_PILLARS[step - 1] : null;
  const isResults = step === totalSteps - 1;
  const isOverview = step === 0;
  const isLastPillar = step === RSE_PILLARS.length;

  return (
    <div className="space-y-6">
      {/* ISO 26000 banner */}
      <p className="text-center text-xs text-gray-400">
        {locale === 'fr'
          ? 'Diagnostic structure selon le cadre ISO 26000 — la norme internationale de responsabilite societale'
          : 'Diagnostic structured according to the ISO 26000 framework — the international standard for social responsibility'}
      </p>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {t('step')} {step + 1} {t('of')} {totalSteps}
          </span>
          <span className="text-gray-500">
            {answeredCount}/{TOTAL_QUESTIONS} {locale === 'fr' ? 'reponses' : 'answers'}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#E6F7EF]0 transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Overview step */}
      {isOverview && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">~15 {locale === 'fr' ? 'minutes' : 'minutes'}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RSE_PILLARS.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.icon] ?? Building2;
              const scoredQ = pillar.questions.filter((q) => q.max_score > 0);
              const autoQ = pillar.questions.filter((q) => q.auto_from);
              return (
                <Card key={pillar.id}>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-[#00A86B]" strokeWidth={1.5} />
                      <h3 className="text-sm font-semibold">{getPillarName(pillar, locale)}</h3>
                    </div>
                    <p className="mb-2 text-xs text-gray-500">{getPillarDesc(pillar, locale)}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{scoredQ.length} questions</span>
                      {autoQ.length > 0 && (
                        <Badge variant="outline" className="border-[#8FDAB5] bg-[#E6F7EF] text-[10px] text-[#008F5A]">
                          {autoQ.length} auto
                        </Badge>
                      )}
                      <span className="ml-auto font-medium">{pillar.weight}%</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Pillar questions */}
      {currentPillar && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = PILLAR_ICONS[currentPillar.icon] ?? Building2;
              return <Icon className="h-6 w-6 text-[#00A86B]" strokeWidth={1.5} />;
            })()}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{getPillarName(currentPillar, locale)}</h2>
              <p className="text-sm text-gray-500">{getPillarDesc(currentPillar, locale)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {currentPillar.questions.map((q) => (
              <ScaleQuestion
                key={q.id}
                question={q}
                value={answers[q.id] as number | undefined}
                onChange={(v) => updateAnswer(q.id, v)}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {isResults && result && (
        <div className="space-y-6">
          {/* Score */}
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <div className="text-6xl font-bold text-[#00A86B]">{result.globalScore}</div>
              <p className="text-sm text-gray-500">/ 100</p>
              <Badge className="bg-[#E6F7EF]0 text-white">
                {t('level')} : {t(result.levelKey)}
              </Badge>
            </CardContent>
          </Card>

          {/* Radar */}
          <Card>
            <CardContent className="py-6">
              <RadarChart
                scores={result.pillarScores.map((p) => ({
                  name: locale === 'fr' ? p.name_fr : p.name_en,
                  percentage: p.percentage,
                }))}
              />
            </CardContent>
          </Card>

          {/* Pillar bars */}
          <Card>
            <CardContent className="space-y-3 p-5">
              {result.pillarScores.map((p) => (
                <div key={p.pillar_id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{locale === 'fr' ? p.name_fr : p.name_en}</span>
                    <span className="text-gray-500">{p.percentage}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#E6F7EF]0 transition-all"
                      style={{ width: `${p.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top 5 actions */}
          {result.actionPlan.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-semibold">
                  {locale === 'fr' ? 'Actions prioritaires' : 'Priority actions'}
                </h3>
                <div className="space-y-2">
                  {result.actionPlan.slice(0, 5).map((a) => (
                    <div key={a.question_id} className="flex items-start gap-3 rounded-lg border border-[#D5E8DD] p-3">
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] ${
                          a.priority === 'high'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : a.priority === 'medium'
                              ? 'border-amber-200 bg-amber-50 text-amber-700'
                              : 'border-[#C5DDD0] text-gray-500'
                        }`}
                      >
                        {a.priority === 'high' ? (locale === 'fr' ? 'Haute' : 'High') : a.priority === 'medium' ? (locale === 'fr' ? 'Moyenne' : 'Medium') : (locale === 'fr' ? 'Basse' : 'Low')}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-700">{locale === 'fr' ? a.question_fr : a.question_en}</p>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {a.current_level}/{a.target_level} — {a.labels.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="default"
              onClick={() => {
                if (!result) return;
                const doc = generateRSEReport(result, answers, locale === 'fr' ? 'fr' : 'en');
                doc.save(`Diagnostic-RSE-GreenEcoGenius-${new Date().toISOString().slice(0, 10)}.pdf`);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              {locale === 'fr' ? 'Telecharger le rapport RSE' : 'Download CSR report'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!result) return;
                const pillarSummary = result.pillarScores
                  .map((p) => `${locale === 'fr' ? p.name_fr : p.name_en}: ${p.percentage}%`)
                  .join(', ');
                const weakest = [...result.pillarScores].sort((a, b) => a.percentage - b.percentage).slice(0, 2);
                const weakNames = weakest.map((w) => locale === 'fr' ? w.name_fr : w.name_en).join(' et ');
                const prompt = locale === 'fr'
                  ? `Mon diagnostic RSE ISO 26000 donne un score global de ${result.globalScore}/100 (niveau ${t(result.levelKey)}). Scores par pilier : ${pillarSummary}. Mes piliers les plus faibles sont ${weakNames}. Donne-moi des conseils personnalises pour ameliorer mon score et atteindre l'eligibilite aux labels B Corp et Lucie.`
                  : `My ISO 26000 CSR diagnostic gives a global score of ${result.globalScore}/100 (level ${t(result.levelKey)}). Pillar scores: ${pillarSummary}. My weakest pillars are ${weakNames}. Give me personalized advice to improve my score and achieve B Corp and Lucie label eligibility.`;
                openChatWithPrompt(prompt);
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {locale === 'fr' ? 'Demander conseil a Genius' : 'Ask Genius for advice'}
            </Button>
          </div>
          <p className="text-center text-[11px] text-gray-400">
            {locale === 'fr'
              ? 'Accompagnement personnalise propulse par Genius, notre IA Anthropic.'
              : 'Personalized guidance powered by Genius, our Anthropic AI.'}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" render={<Link href="/home/rse" />} nativeButton={false}>
              {locale === 'fr' ? 'Retour RSE & Labels' : 'Back to CSR & Labels'}
            </Button>
            <Button variant="outline" render={<Link href="/home/rse/roadmap" />} nativeButton={false}>
              {t('viewRoadmap')}
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!isResults && (
        <div className="flex justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              {t('back')}
            </Button>
          ) : (
            <div />
          )}
          {isLastPillar ? (
            <Button onClick={handleFinish} disabled={isPending}>
              {isPending
                ? (locale === 'fr' ? 'Calcul en cours...' : 'Calculating...')
                : (locale === 'fr' ? 'Voir les resultats' : 'View results')}
            </Button>
          ) : (
            <Button onClick={() => setStep((s) => s + 1)}>
              {t('next')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
