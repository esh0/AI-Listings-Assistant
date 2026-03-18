import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/StatsCards";

export async function StatsCardsServer() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const statusCounts = await prisma.ad.groupBy({
        by: ["status"],
        where: { userId: session.user.id },
        _count: { status: true },
    });

    const countByStatus = Object.fromEntries(
        statusCounts.map((s) => [s.status, s._count.status])
    );
    const totalAds = statusCounts.reduce((sum, s) => sum + s._count.status, 0);

    return (
        <StatsCards
            stats={{
                total: totalAds,
                published: countByStatus["PUBLISHED"] ?? 0,
                sold: countByStatus["SOLD"] ?? 0,
                archived: countByStatus["ARCHIVED"] ?? 0,
            }}
        />
    );
}
