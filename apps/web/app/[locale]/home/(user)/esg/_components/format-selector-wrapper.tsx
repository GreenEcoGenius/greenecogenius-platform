'use client';

import { useState } from 'react';

import type { ReportFormatId } from '../_lib/esg-mock-data';
import { FormatSelector } from './format-selector';

export function FormatSelectorWrapper() {
  const [generating, setGenerating] = useState(false);

  async function handleGenerate(
    format: ReportFormatId,
    _options: { blockchain: boolean; equivalences: boolean; csrd: boolean },
  ) {
    setGenerating(true);

    try {
      const response = await fetch('/api/reports/esg-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportingYear: new Date().getFullYear(),
          format: format === 'cdp' ? 'ghg_protocol' : format,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const disposition = response.headers.get('Content-Disposition');
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      a.download = filenameMatch?.[1] ?? 'Rapport-ESG-GreenEcoGenius.pdf';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // Error state handled by button reset
    } finally {
      setGenerating(false);
    }
  }

  return <FormatSelector onGenerate={handleGenerate} generating={generating} />;
}
