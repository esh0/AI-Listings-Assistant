import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RecentAdsList } from "@/components/RecentAdsList";

export async function RecentAdsListServer() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const recentAds = await prisma.ad.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return <RecentAdsList ads={recentAds} />;
}
