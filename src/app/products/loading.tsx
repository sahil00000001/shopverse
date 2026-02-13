import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border/50">
      {/* Image area */}
      <Skeleton className="aspect-square w-full rounded-none" />
      {/* Content area */}
      <div className="space-y-2.5 p-3.5 sm:p-4">
        {/* Category */}
        <Skeleton className="h-3 w-20" />
        {/* Name */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="size-3.5 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-3 w-8" />
        </div>
        {/* Price + button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="size-8 rounded-full sm:h-8 sm:w-16 sm:rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="mb-2 h-9 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex gap-8">
          {/* Sidebar skeleton - desktop only */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="space-y-6">
              <div>
                <Skeleton className="mb-2 h-4 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
              <Skeleton className="h-px w-full" />
              <div>
                <Skeleton className="mb-3 h-4 w-24" />
                <div className="space-y-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Skeleton className="size-4 rounded" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div>
                <Skeleton className="mb-3 h-4 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div>
                <Skeleton className="mb-3 h-4 w-16" />
                <div className="space-y-2.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Skeleton className="size-4 rounded" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Top bar skeleton */}
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-[180px]" />
                <Skeleton className="hidden h-9 w-[76px] sm:block" />
              </div>
            </div>

            {/* Grid of skeleton cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
