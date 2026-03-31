import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { RoadmapTimeline } from './_components/roadmap-timeline';

export const generateMetadata = async () => {
  return { title: 'Feuille de route RSE' };
};

const mockActions = [
  {
    id: '1',
    title: 'Publier la politique environnementale',
    pillar: 'environment',
    impact: 3,
    effort: '1 jour',
    priority: 'quick_win' as const,
    status: 'done' as const,
    dueDate: '2026-04-15',
    norms: ['ISO 14001'],
    quarter: 'Q2 2026',
  },
  {
    id: '2',
    title: 'Formaliser politique parties prenantes',
    pillar: 'stakeholders',
    impact: 8,
    effort: '2-3 jours',
    priority: 'urgent' as const,
    status: 'in_progress' as const,
    dueDate: '2026-04-30',
    norms: ['ISO 26000', 'AA1000'],
    quarter: 'Q2 2026',
  },
  {
    id: '3',
    title: 'Documenter conditions de travail',
    pillar: 'social',
    impact: 6,
    effort: '1-2 jours',
    priority: 'important' as const,
    status: 'todo' as const,
    dueDate: '2026-05-15',
    norms: ['ESRS S1'],
    quarter: 'Q2 2026',
  },
  {
    id: '4',
    title: 'Mettre en place comite RSE',
    pillar: 'governance',
    impact: 10,
    effort: '3-5 jours',
    priority: 'urgent' as const,
    status: 'todo' as const,
    dueDate: '2026-05-30',
    norms: ['ISO 26000'],
    quarter: 'Q2 2026',
  },
  {
    id: '5',
    title: 'Deployer code ethique fournisseurs',
    pillar: 'ethics',
    impact: 7,
    effort: '5-7 jours',
    priority: 'important' as const,
    status: 'todo' as const,
    dueDate: '2026-06-15',
    norms: ['ISO 37001', 'B Corp'],
    quarter: 'Q2 2026',
  },
  {
    id: '6',
    title: 'Lancer enquete satisfaction employes',
    pillar: 'social',
    impact: 5,
    effort: '2-3 jours',
    priority: 'quick_win' as const,
    status: 'todo' as const,
    dueDate: '2026-07-15',
    norms: ['SA8000', 'GRI 404'],
    quarter: 'Q3 2026',
  },
  {
    id: '7',
    title: 'Obtenir certification ISO 14001',
    pillar: 'environment',
    impact: 12,
    effort: '30+ jours',
    priority: 'important' as const,
    status: 'todo' as const,
    dueDate: '2026-08-30',
    norms: ['ISO 14001'],
    quarter: 'Q3 2026',
  },
  {
    id: '8',
    title: "Former equipe a l'anti-corruption",
    pillar: 'ethics',
    impact: 4,
    effort: '2 jours',
    priority: 'quick_win' as const,
    status: 'todo' as const,
    dueDate: '2026-09-15',
    norms: ['ISO 37001'],
    quarter: 'Q3 2026',
  },
  {
    id: '9',
    title: 'Publier rapport de transparence annuel',
    pillar: 'governance',
    impact: 9,
    effort: '10-15 jours',
    priority: 'urgent' as const,
    status: 'todo' as const,
    dueDate: '2026-10-30',
    norms: ['CSRD', 'GRI'],
    quarter: 'Q4 2026',
  },
  {
    id: '10',
    title: 'Cartographier et consulter parties prenantes',
    pillar: 'stakeholders',
    impact: 15,
    effort: '15-20 jours',
    priority: 'urgent' as const,
    status: 'todo' as const,
    dueDate: '2026-12-15',
    norms: ['AA1000', 'ISO 26000'],
    quarter: 'Q4 2026',
  },
];

async function RoadmapPage() {
  const totalImpact = mockActions.reduce((sum, a) => sum + a.impact, 0);

  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey="rse:roadmapTitle" />
        </Heading>
      </PageHeader>

      <div className="space-y-6">
        {/* Score projection */}
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-6 sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Feuille de route RSE — 12 mois
              </h2>
              <p className="text-muted-foreground text-sm">
                {mockActions.length} actions prioritaires identifiees
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs">
                <Trans i18nKey="rse:projectedScore" />
              </p>
              <p className="text-3xl font-bold text-green-600">88/100</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <RoadmapTimeline actions={mockActions} />
      </div>
    </PageBody>
  );
}

export default RoadmapPage;
