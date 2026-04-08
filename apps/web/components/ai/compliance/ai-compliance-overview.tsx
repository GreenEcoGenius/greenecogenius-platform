'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gavel,
  Link2,
  Play,
  Shield,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { cn } from '@kit/ui/utils';

import { AILoadingState } from '~/components/ai/shared/ai-loading-state';
import { AIPoweredBadge } from '~/components/ai/shared/ai-powered-badge';
import { useComplianceAI } from '~/lib/hooks/use-ai';

interface Regulation {
  name: string;
  status: 'conforme' | 'partiel' | 'non-conforme';
  detail?: string;
  method?: string;
}

interface RegulatoryUpdate {
  title: string;
  date: string;
  impact: 'info' | 'warning';
  description: string;
}

const regulations: Regulation[] = [
  { name: 'RGPD', status: 'conforme' },
  { name: 'Loi AGEC', status: 'conforme' },
  { name: 'CSRD / ESRS', status: 'partiel', detail: '72%' },
  {
    name: 'D\u00e9cret tra\u00e7abilit\u00e9',
    status: 'conforme',
    method: 'via blockchain',
  },
  { name: 'AI Act', status: 'conforme' },
];

const upcomingChanges: RegulatoryUpdate[] = [
  {
    title: 'CSRD \u2014 Extension PME cot\u00e9es',
    date: 'Janvier 2027',
    impact: 'warning',
    description:
      'Les PME cot\u00e9es devront publier un rapport CSRD simplifi\u00e9. Anticipez la collecte de donn\u00e9es.',
  },
  {
    title: 'Devoir de vigilance europ\u00e9en (CS3D)',
    date: 'Juillet 2027',
    impact: 'warning',
    description:
      'Obligation de diligence raisonn\u00e9e sur toute la cha\u00eene de valeur pour les grandes entreprises.',
  },
  {
    title: 'Taxonomie verte \u2014 Mise \u00e0 jour crit\u00e8res',
    date: 'Mars 2027',
    impact: 'info',
    description:
      'Nouveaux crit\u00e8res techniques pour les activit\u00e9s \u00e9conomiques \u00e9ligibles \u00e0 la taxonomie.',
  },
];

function StatusBadge({ regulation }: { regulation: Regulation }) {
  switch (regulation.status) {
    case 'conforme':
      return (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Conforme
          {regulation.method && (
            <span className="text-muted-foreground ml-0.5">
              ({regulation.method})
            </span>
          )}
        </span>
      );
    case 'partiel':
      return (
        <span className="inline-flex items-center gap-1 text-xs text-[#2D8C6A] dark:text-[#2D8C6A]">
          <AlertTriangle className="h-3.5 w-3.5" />
          Partiel{regulation.detail ? ` (${regulation.detail})` : ''}
        </span>
      );
    case 'non-conforme':
      return (
        <Badge variant="destructive" className="text-xs">
          Non conforme
        </Badge>
      );
  }
}

export function AIComplianceOverview({ className }: { className?: string }) {
  const { ask, loading: aiLoading } = useComplianceAI();
  const [auditStarted, setAuditStarted] = useState(false);

  async function handleAudit() {
    setAuditStarted(true);
    await ask(
      'Lance un pr\u00e9-audit de conformit\u00e9 r\u00e9glementaire complet pour cette entreprise.',
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Conformit\u00e9 r\u00e9glementaire
          </CardTitle>
          <AIPoweredBadge />
        </div>
        <CardDescription>
          Vue d&apos;ensemble de la conformit\u00e9 aux r\u00e9glementations en
          vigueur
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Regulations list */}
        <div className="space-y-2">
          {regulations.map((reg) => (
            <div
              key={reg.name}
              className="odd:bg-muted/40 flex items-center justify-between rounded-lg px-3 py-2"
            >
              <span className="text-sm font-medium">{reg.name}</span>
              <StatusBadge regulation={reg} />
            </div>
          ))}
        </div>

        {/* Regulatory watch */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Gavel className="text-muted-foreground h-4 w-4" />
            <p className="text-sm font-medium">Veille r\u00e9glementaire</p>
          </div>

          {upcomingChanges.map((change, index) => (
            <div key={index} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{change.title}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {change.description}
                  </p>
                </div>
                <Badge
                  variant={change.impact === 'warning' ? 'default' : 'outline'}
                  className="shrink-0 text-xs"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {change.date}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Audit button */}
        {auditStarted && aiLoading ? (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">
              Pr\u00e9-audit en cours...
            </p>
            <AILoadingState lines={3} />
          </div>
        ) : (
          <Button
            onClick={handleAudit}
            className="w-full"
            disabled={auditStarted && aiLoading}
            data-test="launch-pre-audit"
          >
            <Play className="mr-2 h-4 w-4" />
            {auditStarted
              ? 'Relancer un pr\u00e9-audit'
              : 'Lancer un pr\u00e9-audit'}
          </Button>
        )}

        {/* Blockchain link */}
        <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
          <Link2 className="h-3 w-3" />
          Preuves de conformit\u00e9 ancr\u00e9es sur blockchain
        </div>
      </CardContent>
    </Card>
  );
}
