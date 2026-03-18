import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StatsCardsServer } from "@/components/StatsCardsServer";
import { RecentAdsListServer } from "@/components/RecentAdsListServer";
import { StatsCardsSkeleton } from "@/components/StatsCardsSkeleton";
import { RecentAdsListSkeleton } from "@/components/RecentAdsListSkeleton";
import { PendingAdHandler } from "@/components/PendingAdHandler";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

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
            <Suspense fallback={<StatsCardsSkeleton />}>
                <StatsCardsServer />
            </Suspense>

            {/* Recent Ads */}
            <Suspense fallback={<RecentAdsListSkeleton />}>
                <RecentAdsListServer />
            </Suspense>
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
