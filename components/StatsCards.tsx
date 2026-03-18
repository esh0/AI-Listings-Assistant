"use client";

import { FileText, Eye, ShoppingCart, Ban } from "lucide-react";

interface StatsCardsProps {
    stats: {
        total: number;
        published: number;
        sold: number;
        archived: number;
    };
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            label: "Utworzone",
            value: stats.total,
            icon: FileText,
        },
        {
            label: "Opublikowane",
            value: stats.published,
            icon: Eye,
        },
        {
            label: "Sprzedane",
            value: stats.sold,
            icon: ShoppingCart,
        },
        {
            label: "Wycofane",
            value: stats.archived,
            icon: Ban,
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className="rounded-xl border border-border bg-card p-3 sm:p-4 flex items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xl font-bold leading-tight">{card.value}</p>
                            <p className="text-[11px] text-muted-foreground">{card.label}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
