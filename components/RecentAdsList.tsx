"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Clock, ShoppingBag, Store, Facebook, Shirt } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdStatus, Platform } from "@prisma/client";

function timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
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

const PLATFORM_ICONS: Record<Platform, { Icon: React.ElementType; color: string; label: string }> = {
    olx: { Icon: ShoppingBag, color: "text-orange-500", label: "OLX" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600", label: "Allegro" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600", label: "Facebook" },
    vinted: { Icon: Shirt, color: "text-teal-600", label: "Vinted" },
};

export function RecentAdsList({ ads }: RecentAdsListProps) {
    const router = useRouter();

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
                    {ads.map((ad, i) => {
                        const platform = PLATFORM_ICONS[ad.platform];
                        const Icon = platform.Icon;
                        const time = timeAgo(ad.createdAt);

                        const images = Array.isArray(ad.images) ? ad.images : [];
                        const firstImage = images[0]?.url;

                        return (
                            <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.05 }}
                                onClick={() => router.push(`/dashboard/ads/${ad.id}`)}
                                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 hover:border-primary/30 transition-colors cursor-pointer group"
                            >
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                    {firstImage ? (
                                        <img
                                            src={firstImage}
                                            alt={ad.title}
                                            className="w-full h-full object-cover"
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <Icon className={`h-4 w-4 ${platform.color}`} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                        {ad.title}
                                    </p>
                                    <div className="mt-1">
                                        <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                                            {platform.label}
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                    <Clock className="h-3 w-3" />
                                    {time}
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
