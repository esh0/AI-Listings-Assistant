"use client";

import { AdCard } from "@/components/AdCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdStatus, Platform } from "@prisma/client";

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

export function RecentAdsList({ ads }: RecentAdsListProps) {
    const router = useRouter();

    const handleAdClick = (id: string) => {
        router.push(`/dashboard/ads/${id}`);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                    Ostatnie ogłoszenia
                </h2>
                {ads.length > 0 && (
                    <Link href="/dashboard/ads">
                        <Button variant="outline" size="sm">
                            Zobacz wszystkie
                        </Button>
                    </Link>
                )}
            </div>

            {ads.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <p className="text-muted-foreground mb-4">
                        Nie masz jeszcze żadnych ogłoszeń
                    </p>
                    <Link href="/dashboard/new">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Utwórz pierwsze ogłoszenie
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {ads.map((ad) => (
                        <AdCard
                            key={ad.id}
                            ad={ad}
                            onClick={handleAdClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
