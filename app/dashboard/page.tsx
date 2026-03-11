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

    // 2 queries instead of 5 — reduces connection pool pressure
    const [statusCounts, recentAds] = await Promise.all([
        prisma.ad.groupBy({
            by: ["status"],
            where: { userId: session.user.id },
            _count: { status: true },
        }),
        prisma.ad.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),
    ]);

    const countByStatus = Object.fromEntries(
        statusCounts.map((s) => [s.status, s._count.status])
    );
    const totalAds = statusCounts.reduce((sum, s) => sum + s._count.status, 0);
    const draftAds = countByStatus["DRAFT"] ?? 0;
    const publishedAds = countByStatus["PUBLISHED"] ?? 0;
    const soldAds = countByStatus["SOLD"] ?? 0;

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
                        Witaj ponownie, <span className="font-semibold text-foreground">{session.user.name || "User"}</span>
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
