import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/StatsCards";
import { RecentAdsList } from "@/components/RecentAdsList";
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
        <div className="space-y-10">
            {/* Pending Ad Handler - saves ad from IndexedDB if exists */}
            <PendingAdHandler />

            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">
                        Pulpit
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Witaj ponownie, <span className="font-serif italic text-foreground">{session.user.name || "User"}</span>
                    </p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="bg-primary hover:bg-primary/90 text-base px-6 py-3 h-auto">
                        <Plus className="h-5 w-5 mr-2" />
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
            <RecentAdsList ads={recentAds} />
        </div>
    );
}
