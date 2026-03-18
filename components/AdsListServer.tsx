import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdsList } from "@/components/AdsList";

interface AdsListServerProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function AdsListServer({ searchParams }: AdsListServerProps) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const statusFilter = searchParams.status as string | undefined;
    const platformFilter = searchParams.platform as string | undefined;
    const searchQuery = searchParams.search as string | undefined;
    const sortParam = (searchParams.sort as string) || "createdAt-desc";
    const page = parseInt((searchParams.page as string) || "1", 10);
    const pageSize = 20;

    const where: any = { userId: session.user.id };

    if (statusFilter && statusFilter !== "all") {
        where.status = statusFilter.toUpperCase();
    }
    if (platformFilter && platformFilter !== "all") {
        where.platform = platformFilter;
    }
    if (searchQuery && searchQuery.trim()) {
        where.OR = [
            { title: { contains: searchQuery.trim(), mode: "insensitive" } },
            { description: { contains: searchQuery.trim(), mode: "insensitive" } },
        ];
    }

    const [sortField, sortDirection] = sortParam.split("-") as [string, "asc" | "desc"];
    const orderBy: any = {};
    if (sortField === "title") {
        orderBy.title = sortDirection;
    } else if (sortField === "updatedAt") {
        orderBy.updatedAt = sortDirection;
    } else {
        orderBy.createdAt = sortDirection || "desc";
    }

    const [ads, totalFilteredCount, statusCounts] = await Promise.all([
        prisma.ad.findMany({
            where,
            orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                platform: true,
                title: true,
                description: true,
                status: true,
                priceMin: true,
                priceMax: true,
                soldPrice: true,
                images: true,
                createdAt: true,
                updatedAt: true,
            },
        }),
        prisma.ad.count({ where }),
        prisma.ad.groupBy({
            by: ["status"],
            where: { userId: session.user.id },
            _count: { status: true },
        }),
    ]);

    const countByStatus = Object.fromEntries(
        statusCounts.map((s) => [s.status, s._count.status])
    );
    const totalCount = statusCounts.reduce((sum, s) => sum + s._count.status, 0);

    return (
        <AdsList
            ads={ads}
            counts={{
                all: totalCount,
                drafts: countByStatus["DRAFT"] ?? 0,
                published: countByStatus["PUBLISHED"] ?? 0,
                sold: countByStatus["SOLD"] ?? 0,
                archived: countByStatus["ARCHIVED"] ?? 0,
            }}
            currentFilter={statusFilter || "all"}
            currentPage={page}
            totalPages={Math.ceil(totalFilteredCount / pageSize)}
            totalFilteredCount={totalFilteredCount}
        />
    );
}
