import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { DEMO_DATA } from '~/lib/demo/demo-data';

import { RoadmapTimeline } from './_components/roadmap-timeline';

export const generateMetadata = async () => {
  return { title: 'Feuille de route RSE' };
};

const mockActions = DEMO_DATA.rse.roadmapActions;

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
