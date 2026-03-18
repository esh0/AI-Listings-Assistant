export function StatsCardsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-busy="true" aria-label="Ładowanie statystyk">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3 sm:p-4 flex items-center gap-4" aria-hidden="true">
                    <div className="w-8 h-8 rounded-lg animate-shimmer shrink-0" />
                    <div>
                        <div className="h-5 w-16 rounded animate-shimmer mb-1.5" />
                        <div className="h-3 w-24 rounded animate-shimmer" />
                    </div>
                </div>
            ))}
        </div>
    );
}
