export default function ResultSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Provider Image Skeleton */}
        <div className="h-16 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700" />
        
        {/* Plan Details Skeleton */}
        <div className="flex-1">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
              </div>
            </div>
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>
                <div className="mb-1 h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
                <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons Skeleton */}
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:ml-4 sm:mt-0 sm:flex-col sm:items-end">
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-slate-700 sm:w-32" />
          <div className="flex gap-2">
            <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700" />
            <div className="h-8 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

