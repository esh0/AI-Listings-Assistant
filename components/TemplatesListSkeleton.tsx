export function TemplatesListSkeleton() {
    return (
        <div className="space-y-3" aria-busy="true" aria-label="Ładowanie szablonów">
            <div className="h-4 w-24 rounded animate-shimmer" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4" aria-hidden="true">
                    <div className="w-8 h-8 rounded animate-shimmer shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="h-4 w-2/5 rounded animate-shimmer mb-2" />
                        <div className="flex gap-2">
                            <div className="h-3 w-16 rounded animate-shimmer" />
                            <div className="h-3 w-20 rounded animate-shimmer" />
                            <div className="h-3 w-24 rounded animate-shimmer" />
                        </div>
                    </div>
                    <div className="hidden sm:block h-3 w-16 rounded animate-shimmer shrink-0" />
                    <div className="w-8 h-8 rounded animate-shimmer shrink-0" />
                </div>
            ))}
        </div>
    );
}
