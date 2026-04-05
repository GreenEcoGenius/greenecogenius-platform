'use client';

import { useRef, useState } from 'react';

import {
  FileText,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';

const ACCEPT =
  '.pdf,.jpg,.jpeg,.png,.docx,application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export interface AnalysisSuggestion {
  title: string | null;
  description: string | null;
  quantitative_value: number | null;
  quantitative_unit: string | null;
}

interface DocumentUploaderProps {
  /** Current uploaded document path in Supabase Storage */
  path: string | null;
  /** Short-lived signed URL for the uploaded doc */
  signedUrl: string | null;
  /** Filename to display */
  filename: string | null;
  /** Mime type of the uploaded doc (used to enable PDF analysis) */
  contentType: string | null;
  /** Category of the activity — passed to the analyzer for context */
  category: string;
  onUploaded: (payload: {
    path: string;
    signedUrl: string;
    filename: string;
    contentType: string;
  }) => void;
  onRemoved: () => void;
  onAnalyzed: (suggestion: AnalysisSuggestion) => void;
}

export function DocumentUploader({
  path,
  signedUrl,
  filename,
  contentType,
  category,
  onUploaded,
  onRemoved,
  onAnalyzed,
}: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0]!;

    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/external-activities/upload', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? 'Upload echoue');
      }

      const data = (await res.json()) as {
        path: string;
        signedUrl: string;
        filename: string;
        contentType: string;
      };

      onUploaded(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload echoue');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function analyze() {
    if (!path) return;
    setError(null);
    setAnalyzing(true);
    try {
      const res = await fetch('/api/external-activities/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, category }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? 'Analyse echouee');
      }
      const data = (await res.json()) as AnalysisSuggestion;
      onAnalyzed(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analyse echouee');
    } finally {
      setAnalyzing(false);
    }
  }

  const isPdf = contentType === 'application/pdf';

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900">
        Piece justificative (optionnel)
      </label>

      {path && signedUrl ? (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
          <FileText
            className="h-5 w-5 shrink-0 text-emerald-600"
            strokeWidth={1.5}
          />
          <a
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-sm font-medium text-emerald-700 hover:underline"
          >
            {filename ?? 'Document'}
          </a>
          {isPdf ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={analyzing}
              onClick={analyze}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Sparkles
                    className="mr-1.5 h-3.5 w-3.5"
                    strokeWidth={1.5}
                  />
                  Analyser avec Genius
                </>
              )}
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRemoved}
            aria-label="Retirer le document"
          >
            <Trash2 className="h-4 w-4 text-red-500" strokeWidth={1.5} />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Upload className="mr-1.5 h-4 w-4" strokeWidth={1.5} />
                Uploader un fichier
              </>
            )}
          </Button>
          <span className="text-xs text-gray-400">
            PDF, JPG, PNG, DOCX — max 10 Mo
          </span>
          <Input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
