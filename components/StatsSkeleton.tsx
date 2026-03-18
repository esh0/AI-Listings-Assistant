export function StatsSkeleton() {
    return (
        <div className="space-y-6" aria-busy="true" aria-label="Ładowanie statystyk">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-border bg-card p-3 sm:p-4 flex items-center gap-4"
                        aria-hidden="true"
                    >
                        <div className="w-8 h-8 rounded-lg animate-shimmer shrink-0" />
                        <div>
                            <div className="h-5 w-16 rounded animate-shimmer mb-1.5" />
                            <div className="h-3 w-24 rounded animate-shimmer" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-hidden="true">
                {/* Weekly Activity Skeleton */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                    <div className="h-4 w-48 rounded animate-shimmer mb-4" />
                    <div className="h-28 flex items-end gap-1.5">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t-sm animate-shimmer"
                                style={{ height: `${40 + i * 8}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-1.5 mt-1.5">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="flex-1 h-3 rounded animate-shimmer" />
                        ))}
                    </div>
                </div>

                {/* Platform Breakdown Skeleton */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                    <div className="h-4 w-40 rounded animate-shimmer mb-4" />
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="h-4 w-24 animate-shimmer rounded" />
                                <div className="h-2 w-full animate-shimmer rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
