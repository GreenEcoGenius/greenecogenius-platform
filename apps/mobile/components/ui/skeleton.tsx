'use client';

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton placeholder for loading states.
 * Uses a subtle shimmer animation for a native-like feel.
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#F5F5F0]/10 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Skeleton for a single stat card (2-column grid). */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] p-4">
      <Skeleton className="mb-3 h-5 w-5 rounded-full" />
      <Skeleton className="h-8 w-20" />
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

/** Skeleton for a list row (activity feed, marketplace, etc.). */
export function ListRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] px-4 py-3">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="ml-3 space-y-1 text-right">
        <Skeleton className="ml-auto h-3 w-16" />
        <Skeleton className="ml-auto h-2 w-10" />
      </div>
    </div>
  );
}

/** Skeleton for a marketplace listing card. */
export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03]">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for a certificate / traceability card. */
export function CertificateCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

/** Full-page skeleton for dashboard-like pages. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 px-4 py-2">
      <div>
        <Skeleton className="mb-3 h-3 w-20" />
        <div className="grid grid-cols-2 gap-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
      <div>
        <Skeleton className="mb-3 h-3 w-28" />
        <div className="space-y-2">
          <ListRowSkeleton />
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      </div>
    </div>
  );
}
