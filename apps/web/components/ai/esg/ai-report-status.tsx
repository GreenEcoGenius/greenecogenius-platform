'use client';

import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Link2,
  PenLine,
} from 'lucide-react';

import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { cn } from '@kit/ui/utils';

interface AIReportStatusProps {
  autoFilledPercent: number;
  scope1Complete: boolean;
  scope2Complete: boolean;
  scope3Complete: boolean;
  blockchainProofs: number;
  className?: string;
}

function ScopeItem({ label, complete }: { label: string; complete: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {complete ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-[#E6F2ED]0" />
      )}
      <span className={complete ? '' : 'text-muted-foreground'}>{label}</span>
      <span
        className={cn(
          'ml-auto text-xs font-medium',
          complete ? 'text-emerald-600' : 'text-[#E6F2ED]0',
        )}
      >
        {complete ? 'Complet' : 'Incomplet'}
      </span>
    </div>
  );
}

export function AIReportStatus({
  autoFilledPercent,
  scope1Complete,
  scope2Complete,
  scope3Complete,
  blockchainProofs,
  className,
}: AIReportStatusProps) {
  const allComplete = scope1Complete && scope2Complete && scope3Complete;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Statut du rapport ESG</CardTitle>
        <CardDescription>
          Compl\u00e9tude des donn\u00e9es pour la g\u00e9n\u00e9ration du
          rapport
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Auto-filled progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Donn\u00e9es auto-remplies
            </span>
            <span className="font-medium">{autoFilledPercent}%</span>
          </div>
          <div className="bg-muted h-2.5 overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                autoFilledPercent >= 80
                  ? 'bg-emerald-500'
                  : autoFilledPercent >= 50
                    ? 'bg-[#E6F2ED]0'
                    : 'bg-emerald-800',
              )}
              style={{ width: `${autoFilledPercent}%` }}
            />
          </div>
        </div>

        {/* Scope checklist */}
        <div className="space-y-2.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            V\u00e9rification des scopes
          </p>
          <ScopeItem
            label="Scope 1 — \u00c9missions directes"
            complete={scope1Complete}
          />
          <ScopeItem
            label="Scope 2 — \u00c9nergie indirecte"
            complete={scope2Complete}
          />
          <ScopeItem
            label="Scope 3 — Cha\u00eene de valeur"
            complete={scope3Complete}
          />
        </div>

        {/* Blockchain proofs */}
        <div className="bg-muted/40 flex items-center gap-2 rounded-lg p-3">
          <Link2 className="text-primary h-4 w-4" />
          <span className="text-sm">
            <span className="font-medium">{blockchainProofs}</span>{' '}
            <span className="text-muted-foreground">
              preuves blockchain enregistr\u00e9es
            </span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={!allComplete}
            data-test="generate-esg-report"
          >
            <FileText className="mr-2 h-4 w-4" />
            G\u00e9n\u00e9rer le rapport
          </Button>
          {!allComplete && (
            <Button
              variant="outline"
              className="flex-1"
              data-test="complete-missing-fields"
            >
              <PenLine className="mr-2 h-4 w-4" />
              Compl\u00e9ter les champs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
