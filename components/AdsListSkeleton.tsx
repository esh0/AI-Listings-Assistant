export function AdsListSkeleton() {
    return (
        <div className="space-y-2" aria-busy="true" aria-label="Ładowanie listy ogłoszeń">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 sm:p-5 flex items-center gap-4" aria-hidden="true">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md animate-shimmer shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="h-4 w-2/5 rounded animate-shimmer mb-1.5" />
                        <div className="flex gap-2">
                            <div className="h-3 w-16 rounded animate-shimmer" />
                            <div className="h-3 w-20 rounded animate-shimmer" />
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded animate-shimmer shrink-0" />
                </div>
            ))}
        </div>
    );
}
