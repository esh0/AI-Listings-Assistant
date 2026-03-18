export function RecentAdsListSkeleton() {
    return (
        <div>
            <div className="h-6 w-40 rounded animate-shimmer mb-3" aria-hidden="true" />
            <div className="space-y-2" aria-busy="true" aria-label="Ładowanie ogłoszeń">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-3 sm:p-4 flex items-center gap-3" aria-hidden="true">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg animate-shimmer shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="h-4 w-3/5 rounded animate-shimmer mb-2" />
                            <div className="h-3 w-2/5 rounded animate-shimmer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
