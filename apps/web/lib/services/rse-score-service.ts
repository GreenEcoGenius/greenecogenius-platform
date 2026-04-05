import { RSE_PILLARS } from '~/lib/config/rse-pillars';

export interface PillarScore {
  pillar_id: string;
  name_fr: string;
  name_en: string;
  icon: string;
  color: string;
  score: number;
  max_score: number;
  percentage: number;
  weight: number;
  answered: number;
  total_questions: number;
}

export interface ActionItem {
  pillar_id: string;
  pillar_color: string;
  question_id: string;
  question_fr: string;
  question_en: string;
  current_level: number;
  target_level: number;
  impact: number;
  priority: 'high' | 'medium' | 'low';
  norms: string[];
  labels: string[];
}

export interface RSEResult {
  globalScore: number;
  levelKey: string;
  pillarScores: PillarScore[];
  actionPlan: ActionItem[];
}

export function calculateRSEScore(answers: Record<string, number | string>): RSEResult {
  const pillarScores: PillarScore[] = [];

  for (const pillar of RSE_PILLARS) {
    let totalScore = 0;
    let maxPossible = 0;
    let answered = 0;
    const scoredQuestions = pillar.questions.filter((q) => q.max_score > 0);

    for (const question of scoredQuestions) {
      maxPossible += question.max_score;
      const answer = answers[question.id];
      if (answer !== undefined && answer !== '') {
        totalScore += typeof answer === 'number' ? answer : 0;
        answered++;
      }
    }

    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

    pillarScores.push({
      pillar_id: pillar.id,
      name_fr: pillar.name_fr,
      name_en: pillar.name_en,
      icon: pillar.icon,
      color: pillar.color,
      score: totalScore,
      max_score: maxPossible,
      percentage,
      weight: pillar.weight,
      answered,
      total_questions: scoredQuestions.length,
    });
  }

  const globalScore = Math.round(
    pillarScores.reduce((sum, p) => sum + (p.percentage * p.weight) / 100, 0),
  );

  let levelKey: string;
  if (globalScore <= 25) levelKey = 'beginner';
  else if (globalScore <= 50) levelKey = 'intermediate';
  else if (globalScore <= 75) levelKey = 'advanced';
  else levelKey = 'expert';

  const actionPlan = generateActionPlan(answers);

  return { globalScore, levelKey, pillarScores, actionPlan };
}

function generateActionPlan(answers: Record<string, number | string>): ActionItem[] {
  const actions: ActionItem[] = [];

  for (const pillar of RSE_PILLARS) {
    for (const question of pillar.questions) {
      if (question.max_score === 0) continue;
      const answer = typeof answers[question.id] === 'number' ? (answers[question.id] as number) : 0;
      const gap = question.max_score - answer;

      if (gap > 0) {
        actions.push({
          pillar_id: pillar.id,
          pillar_color: pillar.color,
          question_id: question.id,
          question_fr: question.question_fr,
          question_en: question.question_en,
          current_level: answer,
          target_level: question.max_score,
          impact: gap * (pillar.weight / 100),
          priority: gap >= 2 ? 'high' : gap >= 1 ? 'medium' : 'low',
          norms: question.norms_impacted,
          labels: question.labels_impacted,
        });
      }
    }
  }

  return actions.sort((a, b) => b.impact - a.impact);
}
