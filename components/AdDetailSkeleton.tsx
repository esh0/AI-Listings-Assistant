export function AdDetailSkeleton() {
    return (
        <div className="space-y-4" aria-busy="true" aria-label="Ładowanie ogłoszenia">
            {/* Top bar */}
            <div className="flex items-center justify-between" aria-hidden="true">
                <div className="h-8 w-36 rounded-lg animate-shimmer" />
                <div className="flex gap-2">
                    <div className="h-8 w-20 rounded-lg animate-shimmer" />
                    <div className="h-8 w-20 rounded-lg animate-shimmer" />
                </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6" aria-hidden="true">
                {/* Left: main content (3 cols) */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Image */}
                    <div className="w-full aspect-video rounded-xl animate-shimmer" />
                    {/* Title */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className="h-4 w-16 rounded animate-shimmer" />
                        <div className="h-6 w-3/4 rounded animate-shimmer" />
                    </div>
                    {/* Description */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                        <div className="h-4 w-24 rounded animate-shimmer mb-3" />
                        <div className="h-3 w-full rounded animate-shimmer" />
                        <div className="h-3 w-full rounded animate-shimmer" />
                        <div className="h-3 w-4/5 rounded animate-shimmer" />
                        <div className="h-3 w-full rounded animate-shimmer" />
                        <div className="h-3 w-2/3 rounded animate-shimmer" />
                    </div>
                </div>

                {/* Right: sidebar (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className="h-4 w-20 rounded animate-shimmer" />
                        <div className="h-3 w-full rounded animate-shimmer" />
                        <div className="h-3 w-3/4 rounded animate-shimmer" />
                        <div className="h-3 w-full rounded animate-shimmer" />
                        <div className="h-3 w-1/2 rounded animate-shimmer" />
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <div className="h-4 w-24 rounded animate-shimmer" />
                        <div className="h-3 w-full rounded animate-shimmer" />
                        <div className="h-3 w-2/3 rounded animate-shimmer" />
                    </div>
                </div>
            </div>
        </div>
    );
}
