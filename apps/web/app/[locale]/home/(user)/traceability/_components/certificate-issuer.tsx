'use client';

import { useState } from 'react';

import {
  Award,
  CheckCircle,
  Download,
  ExternalLink,
  Loader2,
  Shield,
} from 'lucide-react';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Checkbox } from '@kit/ui/checkbox';

interface EligibleLot {
  lotId: string;
  material: string;
  weight: number;
}

interface IssuedCertificate {
  lotId: string;
  certNumber: string;
  hash: string;
  txHash: string | null;
  downloadUrl: string;
}

export function CertificateIssuer({
  eligibleLots,
  onClose,
}: {
  eligibleLots: EligibleLot[];
  onClose?: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(eligibleLots.map((l) => l.lotId)),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [issued, setIssued] = useState<IssuedCertificate[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleLot(lotId: string) {
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(lotId)) {
        next.delete(lotId);
      } else {
        next.add(lotId);
      }

      return next;
    });
  }

  function toggleAll() {
    if (selected.size === eligibleLots.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(eligibleLots.map((l) => l.lotId)));
    }
  }

  async function handleIssue() {
    if (selected.size === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotIds: Array.from(selected) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Erreur lors de l\'emission');
      }

      const data = await res.json();
      setIssued(data.certificates);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      alert(`Erreur: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Success state
  if (issued) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">
            {issued.length} certificat{issued.length > 1 ? 's' : ''} emis avec
            succes
          </span>
        </div>

        <div className="space-y-3">
          {issued.map((cert) => (
            <div
              key={cert.lotId}
              className="bg-muted/50 flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">{cert.certNumber}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {cert.lotId}
                  </Badge>
                </div>
                {cert.txHash && (
                  <div className="mt-1 flex items-center gap-1">
                    <Shield className="h-3 w-3 text-emerald-500" />
                    <span className="text-muted-foreground text-[10px]">
                      Blockchain: {cert.txHash.slice(0, 10)}...
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  data-test="certificate-download"
                  onClick={() => {
                    window.open(cert.downloadUrl, '_blank');
                  }}
                >
                  <Download className="mr-1 h-3 w-3" />
                  Telecharger
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  data-test="certificate-view"
                  onClick={() => {
                    window.open(cert.downloadUrl, '_blank');
                  }}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Voir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {onClose && (
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-test="certificate-close"
            >
              Fermer
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Selection state
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Selectionnez les lots pour lesquels vous souhaitez emettre un certificat
        de tracabilite.
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 border-b pb-2">
          <Checkbox
            checked={selected.size === eligibleLots.length}
            onCheckedChange={toggleAll}
            data-test="certificate-select-all"
          />
          <span className="text-muted-foreground text-xs font-medium">
            Tout selectionner ({selected.size}/{eligibleLots.length})
          </span>
        </div>

        {eligibleLots.map((lot) => (
          <label
            key={lot.lotId}
            className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
          >
            <Checkbox
              checked={selected.has(lot.lotId)}
              onCheckedChange={() => toggleLot(lot.lotId)}
              data-test={`certificate-select-${lot.lotId}`}
            />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <span className="text-sm font-medium font-mono">
                  {lot.lotId}
                </span>
                <span className="text-muted-foreground ml-2 text-xs capitalize">
                  {lot.material}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {lot.weight.toLocaleString('fr-FR')} kg
              </Badge>
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onClose && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-test="certificate-cancel"
          >
            Annuler
          </Button>
        )}
        <Button
          size="sm"
          disabled={selected.size === 0 || isLoading}
          onClick={handleIssue}
          data-test="certificate-issue"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Emission en cours...
            </>
          ) : (
            <>
              <Award className="mr-2 h-4 w-4" />
              Emettre {selected.size} certificat{selected.size > 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
