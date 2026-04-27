/**
 * Format a number of kg of CO2 into the most readable unit.
 * < 1000 kg → "X kg", else → "X.Xt"
 */
export function formatCO2(kg: number | null | undefined): string {
  if (kg == null || isNaN(kg)) return '—';
  const abs = Math.abs(kg);
  if (abs < 1000) return `${Math.round(kg)} kg`;
  return `${(kg / 1000).toFixed(1)}t`;
}

export function formatTonnes(t: number | null | undefined): string {
  if (t == null || isNaN(t)) return '—';
  if (t < 1) return `${(t * 1000).toFixed(0)} kg`;
  return `${t.toFixed(1)}t`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('fr-FR').format(n);
}

export function formatPercent(n: number | null | undefined, digits = 0): string {
  if (n == null || isNaN(n)) return '—';
  return `${n.toFixed(digits)}%`;
}

export function formatRelativeDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffH < 24) return `il y a ${diffH}h`;
  if (diffD < 7) return `il y a ${diffD}j`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}
