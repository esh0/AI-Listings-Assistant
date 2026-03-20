"use client";

import {
    FileText,
    Eye,
    ShoppingCart,
    Ban,
    BarChart3,
    ShoppingBag,
    Store,
    Facebook,
    Shirt,
} from "lucide-react";
import { PLATFORM_META } from "@/lib/types";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
    olx: ShoppingBag,
    allegro_lokalnie: Store,
    facebook_marketplace: Facebook,
    vinted: Shirt,
};

export interface StatsData {
    total: number;
    published: number;
    sold: number;
    archived: number;
    weeklyDays: { label: string; count: number }[];
    platformStats: { platform: string; created: number; published: number; sold: number }[];
}

interface StatsContentProps {
    stats: StatsData;
}

export function StatsContent({ stats }: StatsContentProps) {
    const summaryCards = [
        { label: "Utworzone", value: stats.total, Icon: FileText },
        { label: "Opublikowane", value: stats.published, Icon: Eye },
        { label: "Sprzedane", value: stats.sold, Icon: ShoppingCart },
        { label: "Wycofane", value: stats.archived, Icon: Ban },
    ];

    const maxCount = Math.max(...stats.weeklyDays.map((d) => d.count), 1);
    const totalCreated = stats.platformStats.reduce((s, p) => s + p.created, 0) || 1;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {summaryCards.map((card) => {
                    const Icon = card.Icon;
                    return (
                        <div
                            key={card.label}
                            className="rounded-xl border border-border bg-card p-3 sm:p-4 flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-xl font-bold leading-tight">{card.value}</p>
                                <p className="text-[11px] text-muted-foreground">{card.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weekly Activity Chart */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                    <h2 className="text-sm font-semibold mb-4">Aktywność (ostatnie 7 dni)</h2>
                    <div className="flex items-end gap-1.5 h-28 sm:h-32" role="img" aria-label="Wykres aktywności z ostatnich 7 dni">
                        {stats.weeklyDays.map((day, i) => (
                            <div
                                key={i}
                                className="flex-1 flex flex-col justify-end h-full"
                                title={`${day.label}: ${day.count} ogłoszeń`}
                            >
                                <div
                                    className="w-full rounded-t-sm"
                                    style={{
                                        height: `${(day.count / maxCount) * 100}%`,
                                        minHeight: day.count > 0 ? "4px" : "0",
                                        background: day.count > 0
                                            ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))"
                                            : "transparent",
                                        opacity: 0.75,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-1.5 mt-1.5" aria-hidden="true">
                        {stats.weeklyDays.map((day, i) => (
                            <div
                                key={i}
                                className="flex-1 text-center text-[10px] text-muted-foreground"
                            >
                                {day.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Breakdown */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                    <h2 className="text-sm font-semibold mb-4">Podział według platform</h2>

                    {stats.platformStats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <BarChart3 className="h-10 w-10 text-muted-foreground/30 mb-3" aria-hidden="true" />
                            <p className="text-sm text-muted-foreground font-medium">Brak danych</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                Zacznij tworzyć ogłoszenia, aby zobaczyć podział
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.platformStats.map((p) => {
                                const Icon = PLATFORM_ICONS[p.platform];
                                const meta = PLATFORM_META[p.platform as keyof typeof PLATFORM_META];
                                if (!Icon || !meta) return null;
                                const widthPct = (p.created / totalCreated) * 100;

                                return (
                                    <div key={p.platform}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <Icon className={`h-4 w-4 ${meta.color}`} aria-hidden="true" />
                                                <span className="text-sm font-medium">{meta.label}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {p.created} utw.
                                                {p.published > 0 && ` / ${p.published} pub.`}
                                                {p.sold > 0 && ` / ${p.sold} sprz.`}
                                            </span>
                                        </div>
                                        <div
                                            className="h-2 w-full bg-muted rounded-full overflow-hidden"
                                            role="progressbar"
                                            aria-valuenow={Math.round(widthPct)}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`${meta.label}: ${Math.round(widthPct)}%`}
                                        >
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${widthPct}%`,
                                                    background:
                                                        "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
