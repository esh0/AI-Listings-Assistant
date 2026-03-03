import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/StatsCards";
import { AdCard } from "@/components/AdCard";
import { PendingAdHandler } from "@/components/PendingAdHandler";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    // Parallelize all database queries (stats + recent ads)
    const [totalAds, draftAds, publishedAds, soldAds, recentAds] = await Promise.all([
        prisma.ad.count({
            where: { userId: session.user.id },
        }),
        prisma.ad.count({
            where: { userId: session.user.id, status: "DRAFT" },
        }),
        prisma.ad.count({
            where: { userId: session.user.id, status: "PUBLISHED" },
        }),
        prisma.ad.count({
            where: { userId: session.user.id, status: "SOLD" },
        }),
        prisma.ad.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),
    ]);

    return (
        <div className="space-y-8">
            {/* Pending Ad Handler - saves ad from IndexedDB if exists */}
            <PendingAdHandler />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Pulpit
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Witaj ponownie, {session.user.name || "User"}!
                    </p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Nowe ogłoszenie
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <StatsCards
                stats={{
                    total: totalAds,
                    drafts: draftAds,
                    published: publishedAds,
                    sold: soldAds,
                }}
            />

            {/* Recent Ads */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                        Ostatnie ogłoszenia
                    </h2>
                    {recentAds.length > 0 && (
                        <Link href="/dashboard/ads">
                            <Button variant="outline" size="sm">
                                Zobacz wszystkie
                            </Button>
                        </Link>
                    )}
                </div>

                {recentAds.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Nie masz jeszcze żadnych ogłoszeń
                        </p>
                        <Link href="/dashboard/new">
                            <Button className="bg-orange-500 hover:bg-orange-600">
                                <Plus className="h-4 w-4 mr-2" />
                                Utwórz pierwsze ogłoszenie
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentAds.map((ad) => (
                            <AdCard
                                key={ad.id}
                                ad={ad}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
