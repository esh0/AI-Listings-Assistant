"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Clock, ShoppingBag, Store, Facebook, Shirt } from "lucide-react";
import Link from "next/link";
import type { AdStatus, Platform } from "@prisma/client";
import { PLATFORM_META } from "@/lib/types";

function timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "przed chwilą";
    if (minutes < 60) return `${minutes} min temu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} godz. temu`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Wczoraj";
    if (days < 7) return `${days} dni temu`;
    return new Date(date).toLocaleDateString("pl-PL");
}

interface RecentAdsListProps {
    ads: Array<{
        id: string;
        platform: Platform;
        title: string;
        description: string;
        status: AdStatus;
        priceMin?: number | null;
        priceMax?: number | null;
        soldPrice?: number | null;
        images: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

const PLATFORM_ICONS: Record<Platform, React.ElementType> = {
    olx: ShoppingBag,
    allegro_lokalnie: Store,
    facebook_marketplace: Facebook,
    vinted: Shirt,
};

export function RecentAdsList({ ads }: RecentAdsListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-semibold">Ostatnie ogłoszenia</h2>
                {ads.length > 0 && (
                    <Link href="/dashboard/ads">
                        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
                            Wszystkie <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </Link>
                )}
            </div>

            {ads.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <p className="text-muted-foreground mb-4">
                        Nie masz jeszcze żadnych ogłoszeń
                    </p>
                    <Link href="/dashboard/new">
                        <Button variant="gradient">
                            <Plus className="h-4 w-4 mr-2" />
                            Utwórz pierwsze ogłoszenie
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {ads.map((ad) => {
                        const Icon = PLATFORM_ICONS[ad.platform];
                        const { color, label } = PLATFORM_META[ad.platform];
                        const time = timeAgo(ad.createdAt);

                        const images = Array.isArray(ad.images) ? ad.images : [];
                        const firstImage = images[0]?.url;

                        return (
                            <Link
                                key={ad.id}
                                href={`/dashboard/ads/${ad.id}`}
                                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 hover:border-primary/30 transition-colors group"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                    {firstImage ? (
                                        <img
                                            src={firstImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            width={64}
                                            height={64}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                        {ad.title}
                                    </p>
                                    <div className="mt-1">
                                        <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                                            {label}
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                    <Clock className="h-3 w-3" aria-hidden="true" />
                                    {time}
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" aria-hidden="true" />
                            </Link>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
