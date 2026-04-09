import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { RSE_PILLARS } from '~/lib/config/rse-pillars';
import type { RSEResult } from '~/lib/services/rse-score-service';

const TEAL: [number, number, number] = [13, 148, 136];
const BLACK: [number, number, number] = [17, 24, 39];
const GRAY: [number, number, number] = [107, 114, 128];
const LIGHT: [number, number, number] = [243, 244, 246];
const WHITE: [number, number, number] = [255, 255, 255];
const GREEN: [number, number, number] = [16, 185, 129];
const RED: [number, number, number] = [239, 68, 68];
const AMBER: [number, number, number] = [245, 158, 11];

type Lang = 'fr' | 'en';

const L = {
  fr: {
    title: 'Rapport Diagnostic RSE',
    subtitle: 'Structure selon le cadre ISO 26000',
    score: 'Score Global',
    level: 'Niveau',
    pillarScores: 'Scores par pilier',
    pillar: 'Pilier',
    scoreCol: 'Score',
    pct: '%',
    actionPlan: "Plan d'action recommande",
    priority: 'Priorite',
    question: 'Action',
    current: 'Actuel',
    target: 'Cible',
    labels: 'Labels impactes',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
    methodology: 'Ce diagnostic est structure selon le cadre ISO 26000, la norme internationale de responsabilite societale. GreenEcoGenius utilise ce referentiel comme grille d\'evaluation — ISO 26000 n\'etant pas certifiable.',
    footer1: 'GreenEcoGenius OU (Estonie) · GreenEcoGenius, Inc. (Delaware, USA) -- greenecogenius.tech',
    footer2: "Batir Aujourd'hui Pour Preserver Demain.",
    generated: 'Document genere par IA — Diagnostic RSE ISO 26000',
    beginner: 'Debutant', intermediate: 'Intermediaire', advanced: 'Avance', expert: 'Expert',
  },
  en: {
    title: 'CSR Diagnostic Report',
    subtitle: 'Structured according to ISO 26000 framework',
    score: 'Global Score',
    level: 'Level',
    pillarScores: 'Pillar Scores',
    pillar: 'Pillar',
    scoreCol: 'Score',
    pct: '%',
    actionPlan: 'Recommended Action Plan',
    priority: 'Priority',
    question: 'Action',
    current: 'Current',
    target: 'Target',
    labels: 'Labels impacted',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    methodology: 'This diagnostic is structured according to the ISO 26000 framework, the international standard for social responsibility. GreenEcoGenius uses this reference as an evaluation grid — ISO 26000 is not certifiable.',
    footer1: 'GreenEcoGenius, Inc. (Delaware, USA) · GreenEcoGenius OU (Estonia) -- greenecogenius.tech',
    footer2: 'Building Today to Preserve Tomorrow.',
    generated: 'AI-generated document — ISO 26000 CSR Diagnostic',
    beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert',
  },
} as const;

function addFooter(doc: jsPDF, lang: Lang) {
  const l = L[lang];
  const pw = 210;
  const ph = 297;
  doc.setFillColor(...TEAL);
  doc.rect(0, ph - 12, pw, 12, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...WHITE);
  doc.text(l.footer1, pw / 2, ph - 7, { align: 'center' });
  doc.text(l.footer2, pw / 2, ph - 3.5, { align: 'center' });
}

export function generateRSEReport(
  result: RSEResult,
  answers: Record<string, number | string>,
  lang: Lang = 'fr',
): jsPDF {
  const l = L[lang];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = 210;

  // Cover page
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, 297, 'F');
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pw, 3, 'F');

  doc.setFontSize(28);
  doc.setTextColor(...TEAL);
  doc.setFont('helvetica', 'bold');
  doc.text('GreenEcoGenius', pw / 2, 50, { align: 'center' });

  doc.setFontSize(20);
  doc.setTextColor(...BLACK);
  doc.text(l.title, pw / 2, 80, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(...GRAY);
  doc.text(l.subtitle, pw / 2, 90, { align: 'center' });

  doc.setFontSize(48);
  doc.setTextColor(...TEAL);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.globalScore}`, pw / 2, 130, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(...GRAY);
  doc.text(`${l.score} / 100`, pw / 2, 140, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(...BLACK);
  const levelLabel = l[result.levelKey as keyof typeof l] ?? result.levelKey;
  doc.text(`${l.level} : ${levelLabel}`, pw / 2, 152, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text(new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  }), pw / 2, 165, { align: 'center' });

  addFooter(doc, lang);

  // Pillar scores page
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(...BLACK);
  doc.setFont('helvetica', 'bold');
  doc.text(l.pillarScores, 15, 20);

  let y = 30;
  for (const ps of result.pillarScores) {
    const name = lang === 'fr' ? ps.name_fr : ps.name_en;
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.setFont('helvetica', 'bold');
    doc.text(name, 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(`${ps.percentage}%`, pw - 15, y, { align: 'right' });

    // Progress bar
    doc.setFillColor(...LIGHT);
    doc.rect(15, y + 2, pw - 30, 4, 'F');
    const barColor: [number, number, number] = ps.percentage >= 60 ? GREEN : ps.percentage >= 30 ? AMBER : RED;
    doc.setFillColor(...barColor);
    doc.rect(15, y + 2, (pw - 30) * (ps.percentage / 100), 4, 'F');

    y += 16;
  }

  // Detailed answers
  y += 10;
  for (const pillar of RSE_PILLARS) {
    if (y > 260) { doc.addPage(); y = 20; addFooter(doc, lang); }

    doc.setFontSize(12);
    doc.setTextColor(...TEAL);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'fr' ? pillar.name_fr : pillar.name_en, 15, y);
    y += 6;

    for (const q of pillar.questions) {
      if (y > 270) { doc.addPage(); y = 20; addFooter(doc, lang); }
      const answer = answers[q.id];
      const label = lang === 'fr' ? q.question_fr : q.question_en;
      const answerText = q.type === 'scale' && q.options
        ? q.options.find((o) => o.value === answer)?.[lang === 'fr' ? 'label_fr' : 'label_en'] ?? '-'
        : q.type === 'boolean'
          ? answer === q.max_score ? (lang === 'fr' ? 'Oui' : 'Yes') : (lang === 'fr' ? 'Non' : 'No')
          : String(answer ?? '-');

      doc.setFontSize(9);
      doc.setTextColor(...BLACK);
      doc.setFont('helvetica', 'normal');
      doc.text(label, 18, y, { maxWidth: 120 });
      doc.setTextColor(...GRAY);
      doc.text(answerText, pw - 15, y, { align: 'right', maxWidth: 50 });
      y += 6;
    }
    y += 4;
  }

  addFooter(doc, lang);

  // Action plan page
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(...BLACK);
  doc.setFont('helvetica', 'bold');
  doc.text(l.actionPlan, 15, 20);

  const top10 = result.actionPlan.slice(0, 10);
  autoTable(doc, {
    startY: 28,
    head: [[l.priority, l.question, `${l.current}/${l.target}`, l.labels]],
    body: top10.map((a) => [
      a.priority === 'high' ? l.high : a.priority === 'medium' ? l.medium : l.low,
      lang === 'fr' ? a.question_fr : a.question_en,
      `${a.current_level}/${a.target_level}`,
      a.labels.join(', '),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: TEAL, textColor: WHITE },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 15, right: 15 },
  });

  // Methodology
  const finalY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 200;
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'italic');
  doc.text(l.methodology, 15, finalY + 15, { maxWidth: pw - 30 });

  doc.setFontSize(7);
  doc.text(l.generated, pw / 2, finalY + 30, { align: 'center' });

  addFooter(doc, lang);

  return doc;
}
