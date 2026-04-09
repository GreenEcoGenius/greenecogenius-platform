export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 ${className ?? ''}`}
    >
      <span className="text-[8px]">●</span> Demo
    </span>
  );
}
