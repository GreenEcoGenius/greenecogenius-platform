/**
 * Deterministic slugifier shared between `EnviroDocsProse` (which injects the
 * `id` on each heading) and `EnviroDocsTOC` (which builds anchor links). Both
 * sides must compute identical IDs for in-page navigation to work.
 */
export function slugifyDocsHeading(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
