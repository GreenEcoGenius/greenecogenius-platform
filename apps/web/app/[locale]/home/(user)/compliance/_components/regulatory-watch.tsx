'use client';

import { Calendar, Eye as EyeIcon } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';
import { Trans } from '@kit/ui/trans';

type ImpactLevel = 'low' | 'medium' | 'high' | 'strategic';

interface WatchItem {
  id: string;
  date: string;
  title: string;
  description: string;
  impact: ImpactLevel;
}

const MOCK_WATCH: WatchItem[] = [
  {
    id: 'csrd-pme',
    date: '2026-06-01',
    title: 'Extension CSRD aux PME cot\u00e9es',
    description:
      'Les PME cot\u00e9es devront publier un rapport de durabilit\u00e9 simplifi\u00e9 selon les normes ESRS-LSME d\u00e8s l\u2019exercice 2026.',
    impact: 'strategic',
  },
  {
    id: 'dpp',
    date: '2026-09-01',
    title: 'Passeport num\u00e9rique produit (DPP) — phase 1',
    description:
      'Les batteries industrielles et les textiles devront int\u00e9grer un passeport num\u00e9rique produit accessible via QR code.',
    impact: 'high',
  },
  {
    id: 'cbam-phase2',
    date: '2026-07-01',
    title: 'CBAM — Phase de transition termin\u00e9e',
    description:
      'Fin de la p\u00e9riode transitoire du m\u00e9canisme d\u2019ajustement carbone aux fronti\u00e8res. D\u00e9clarations d\u00e9finitives obligatoires.',
    impact: 'high',
  },
  {
    id: 'nis2-deadline',
    date: '2026-05-15',
    title: 'NIS2 — Date limite de mise en conformit\u00e9',
    description:
      'Les entit\u00e9s essentielles et importantes doivent avoir notifi\u00e9 leur statut et mis en place les mesures de cybers\u00e9curit\u00e9 requises.',
    impact: 'medium',
  },
];

const IMPACT_STYLES: Record<
  ImpactLevel,
  { className: string; i18nKey: string }
> = {
  low: {
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    i18nKey: 'compliance:impactLow',
  },
  medium: {
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    i18nKey: 'compliance:impactMedium',
  },
  high: {
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    i18nKey: 'compliance:impactHigh',
  },
  strategic: {
    className:
      'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
    i18nKey: 'compliance:impactStrategic',
  },
};

export function RegulatoryWatch() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <EyeIcon className="h-5 w-5 text-blue-500" />
          <Trans i18nKey="compliance:watchTitle" />
        </h3>

        <div className="space-y-4">
          {MOCK_WATCH.map((item) => {
            const impactStyle = IMPACT_STYLES[item.impact];

            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <div className="flex shrink-0 flex-col items-center">
                  <Calendar className="text-muted-foreground mb-1 h-4 w-4" />
                  <span className="text-muted-foreground text-xs font-medium">
                    {new Date(item.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(item.date).getFullYear()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">{item.title}</span>
                    <Badge variant="outline" className={impactStyle.className}>
                      <Trans i18nKey={impactStyle.i18nKey} />
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
