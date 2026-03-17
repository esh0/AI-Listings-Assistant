import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/StatsCards";
import { RecentAdsList } from "@/components/RecentAdsList";
import { PendingAdHandler } from "@/components/PendingAdHandler";
import Link from "next/link";
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
    const publishedAds = countByStatus["PUBLISHED"] ?? 0;
    const soldAds = countByStatus["SOLD"] ?? 0;
    const archivedAds = countByStatus["ARCHIVED"] ?? 0;

    const firstName = session.user.name?.split(" ")[0] || "User";

    return (
        <>
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Pending Ad Handler - saves ad from IndexedDB if exists */}
            <PendingAdHandler />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-14 lg:pl-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">
                        Witaj, {firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Oto podsumowanie Twoich ogłoszeń
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards
                stats={{
                    total: totalAds,
                    published: publishedAds,
                    sold: soldAds,
                    archived: archivedAds,
                }}
            />

            {/* Recent Ads */}
            <RecentAdsList ads={recentAds} />
        </div>

        {/* FAB */}
        <Link
            href="/dashboard/new"
            className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8 flex items-center gap-1.5 bg-gradient-primary text-primary-foreground font-semibold px-5 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity text-sm"
        >
            <Plus className="h-4 w-4" />
            Nowe ogłoszenie
        </Link>
        </>
    );
}
