import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatsContent } from "@/components/StatsContent";

const PLATFORMS = ["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"] as const;

export async function StatsServer() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = session.user.id;

    const [statusCounts, platformCounts, recentAds] = await Promise.all([
        prisma.ad.groupBy({
            by: ["status"],
            where: { userId },
            _count: { status: true },
        }),
        prisma.ad.groupBy({
            by: ["platform", "status"],
            where: { userId },
            _count: { _all: true },
        }),
        prisma.ad.findMany({
            where: {
                userId,
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
            select: { createdAt: true },
        }),
    ]);

    const total = statusCounts.reduce((s, r) => s + r._count.status, 0);
    const published = statusCounts.find((r) => r.status === "PUBLISHED")?._count.status ?? 0;
    const sold = statusCounts.find((r) => r.status === "SOLD")?._count.status ?? 0;
    const archived = statusCounts.find((r) => r.status === "ARCHIVED")?._count.status ?? 0;

    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            date: d.toDateString(),
            label: d.toLocaleDateString("pl-PL", { weekday: "short" }),
            count: 0,
        };
    });

    for (const ad of recentAds) {
        const adDate = new Date(ad.createdAt).toDateString();
        const day = days.find((d) => d.date === adDate);
        if (day) day.count++;
    }

    const weeklyDays = days.map(({ label, count }) => ({ label, count }));

    const platformStats = PLATFORMS.map((platform) => {
        const rows = platformCounts.filter((r) => r.platform === platform);
        const created = rows.reduce((s, r) => s + r._count._all, 0);
        const pub = rows.find((r) => r.status === "PUBLISHED")?._count._all ?? 0;
        const sld = rows.find((r) => r.status === "SOLD")?._count._all ?? 0;
        return { platform, created, published: pub, sold: sld };
    }).filter((p) => p.created > 0);

    return <StatsContent stats={{ total, published, sold, archived, weeklyDays, platformStats }} />;
}
