'use client';

import { useState } from 'react';

import { Check, FileText, Lock } from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Checkbox } from '@kit/ui/checkbox';

import { DEMO_DATA } from '~/lib/demo/demo-data';

type ReportFormatId = (typeof DEMO_DATA.esg.reportFormats)[number]['id'];

export function FormatSelector({
  onGenerate,
  generating,
}: {
  onGenerate: (
    format: ReportFormatId,
    options: { blockchain: boolean; equivalences: boolean; csrd: boolean },
  ) => void;
  generating: boolean;
}) {
  const [selectedFormat, setSelectedFormat] =
    useState<ReportFormatId>('ghg_protocol');
  const [options, setOptions] = useState({
    blockchain: true,
    equivalences: true,
    csrd: true,
  });

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold">Generer un rapport</h3>
        <p className="text-muted-foreground mb-4 text-xs">
          Choisissez le format et les options du rapport
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DEMO_DATA.esg.reportFormats.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            const isLocked = !fmt.available;

            return (
              <button
                key={fmt.id}
                type="button"
                disabled={isLocked}
                onClick={() => !isLocked && setSelectedFormat(fmt.id)}
                className={`relative rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-[#E8F8F0]0 bg-[#E8F8F0]/50 ring-1 ring-[#E8F8F0]0 dark:bg-[#0A5C35]/20'
                    : isLocked
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-[#1BAF6A]" />
                  </div>
                )}
                {isLocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                )}
                <p className="text-sm font-medium">{fmt.name}</p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {fmt.description}
                </p>
                {isLocked && (
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    Plan {fmt.plan === 'avance' ? 'Avance' : 'Enterprise'}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={options.blockchain}
              onCheckedChange={(v) =>
                setOptions((o) => ({ ...o, blockchain: !!v }))
              }
            />
            Preuves blockchain
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={options.equivalences}
              onCheckedChange={(v) =>
                setOptions((o) => ({ ...o, equivalences: !!v }))
              }
            />
            Equivalences CO2
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={options.csrd}
              onCheckedChange={(v) => setOptions((o) => ({ ...o, csrd: !!v }))}
            />
            Tableau CSRD
          </label>
        </div>

        <div className="mt-4">
          <Button
            size="sm"
            disabled={generating}
            onClick={() => onGenerate(selectedFormat, options)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {generating
              ? 'Generation en cours...'
              : 'Generer et telecharger le PDF'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
