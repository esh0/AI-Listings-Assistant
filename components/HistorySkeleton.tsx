export function HistorySkeleton() {
    return (
        <div className="relative" aria-busy="true" aria-label="Ładowanie historii">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
            <ol className="space-y-0">
                {Array.from({ length: 8 }).map((_, i) => (
                    <li key={i} className="relative pl-10 pb-6" aria-hidden="true">
                        <span className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full animate-shimmer" />
                        <div className="bg-card border border-border rounded-xl px-4 py-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                    <div className="w-4 h-4 rounded animate-shimmer shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="h-3.5 w-2/5 rounded animate-shimmer mb-1.5" />
                                        <div className="h-3 w-3/5 rounded animate-shimmer" />
                                    </div>
                                </div>
                                <div className="h-3 w-16 rounded animate-shimmer shrink-0" />
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
