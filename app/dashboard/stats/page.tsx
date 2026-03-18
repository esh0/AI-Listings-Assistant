"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const PLATFORM_ICONS: Record<string, { Icon: React.ElementType; color: string; label: string }> = {
    olx: { Icon: ShoppingBag, color: "text-orange-500", label: "OLX" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600", label: "Allegro Lokalnie" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600", label: "FB Marketplace" },
    vinted: { Icon: Shirt, color: "text-teal-600", label: "Vinted" },
};

interface StatsData {
    total: number;
    published: number;
    sold: number;
    archived: number;
    weeklyDays: { label: string; count: number }[];
    platformStats: { platform: string; created: number; published: number; sold: number }[];
}

export default function StatsPage() {
    const [data, setData] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch("/api/stats")
            .then((r) => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    const summaryCards = data
        ? [
              { label: "Utworzone", value: data.total, Icon: FileText },
              { label: "Opublikowane", value: data.published, Icon: Eye },
              { label: "Sprzedane", value: data.sold, Icon: ShoppingCart },
              { label: "Wycofane", value: data.archived, Icon: Ban },
          ]
        : [];

    const maxCount = data ? Math.max(...data.weeklyDays.map((d) => d.count), 1) : 1;
    const totalCreated = data
        ? data.platformStats.reduce((s, p) => s + p.created, 0) || 1
        : 1;

    if (error) {
        return (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-sm font-medium text-muted-foreground">Nie udało się załadować statystyk</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Sprawdź połączenie i odśwież stronę</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="pl-14 lg:pl-0 flex items-start gap-3">
                <BarChart3 className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Statystyki</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Twoja aktywność w liczbach
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-busy="true" aria-label="Ładowanie statystyk">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-border bg-muted p-3 sm:p-4 h-[68px] animate-pulse"
                            aria-hidden="true"
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {summaryCards.map((card, i) => {
                        const Icon = card.Icon;
                        return (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="rounded-xl border border-border bg-card p-3 sm:p-4 flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold leading-tight">{card.value}</p>
                                    <p className="text-[11px] text-muted-foreground">{card.label}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weekly Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="rounded-xl border border-border bg-card p-4 sm:p-5"
                >
                    <h2 className="text-sm font-semibold mb-4">Aktywność (ostatnie 7 dni)</h2>

                    {loading ? (
                        <div className="h-28 flex items-end gap-1.5" aria-hidden="true">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 rounded-t-sm bg-muted animate-pulse"
                                    style={{ height: `${40 + i * 8}%` }}
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="flex items-end gap-1.5 h-28 sm:h-32" role="img" aria-label="Wykres aktywności z ostatnich 7 dni">
                                {data?.weeklyDays.map((day, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-center justify-end gap-1"
                                        title={`${day.label}: ${day.count} ogłoszeń`}
                                    >
                                        <motion.div
                                            className="w-full rounded-t-sm overflow-hidden"
                                            style={{
                                                height: `${(day.count / maxCount) * 100}%`,
                                                minHeight: day.count > 0 ? "4px" : "0",
                                                transformOrigin: "bottom",
                                            }}
                                            initial={{ scaleY: 0 }}
                                            animate={{ scaleY: 1 }}
                                            transition={{ delay: 0.4 + i * 0.05 }}
                                        >
                                            <div
                                                className="w-full h-full"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
                                                    opacity: 0.75,
                                                }}
                                            />
                                        </motion.div>
                                    </div>
                                ))}
                            </div>
                            {/* Day labels */}
                            <div className="flex gap-1.5 mt-1.5" aria-hidden="true">
                                {data?.weeklyDays.map((day, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 text-center text-[10px] text-muted-foreground"
                                    >
                                        {day.label}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Platform Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="rounded-xl border border-border bg-card p-4 sm:p-5"
                >
                    <h2 className="text-sm font-semibold mb-4">Podział według platform</h2>

                    {loading ? (
                        <div className="space-y-4" aria-hidden="true">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                    <div className="h-2 w-full bg-muted animate-pulse rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : !data || data.platformStats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <BarChart3 className="h-10 w-10 text-muted-foreground/30 mb-3" aria-hidden="true" />
                            <p className="text-sm text-muted-foreground font-medium">Brak danych</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                Zacznij tworzyć ogłoszenia, aby zobaczyć podział
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.platformStats.map((p, i) => {
                                const plat = PLATFORM_ICONS[p.platform];
                                if (!plat) return null;
                                const Icon = plat.Icon;
                                const widthPct = (p.created / totalCreated) * 100;

                                return (
                                    <div key={p.platform}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <Icon className={`h-4 w-4 ${plat.color}`} aria-hidden="true" />
                                                <span className="text-sm font-medium">{plat.label}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {p.created} utw.
                                                {p.published > 0 && ` / ${p.published} pub.`}
                                                {p.sold > 0 && ` / ${p.sold} sprz.`}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(widthPct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${plat.label}: ${Math.round(widthPct)}%`}>
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
                                                    transformOrigin: "left",
                                                }}
                                                initial={{ scaleX: 0, width: `${widthPct}%` }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
