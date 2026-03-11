import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdsList } from "@/components/AdsList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdsPage(props: { searchParams: SearchParams }) {
    // Parallelize auth and searchParams resolution
    const [session, searchParams] = await Promise.all([
        auth(),
        props.searchParams
    ]);

    if (!session?.user?.id) {
        redirect("/auth/signin?callbackUrl=/dashboard/ads");
    }

    // Get filters and sort from search params
    const statusFilter = searchParams.status as string | undefined;
    const platformFilter = searchParams.platform as string | undefined;
    const searchQuery = searchParams.search as string | undefined;
    const sortParam = (searchParams.sort as string) || "createdAt-desc";
    const page = parseInt((searchParams.page as string) || "1", 10);
    const pageSize = 20; // Ads per page

    // Build where clause
    const where: any = {
        userId: session.user.id,
    };

    if (statusFilter && statusFilter !== "all") {
        where.status = statusFilter.toUpperCase();
    }

    if (platformFilter && platformFilter !== "all") {
        where.platform = platformFilter;
    }

    if (searchQuery && searchQuery.trim()) {
        where.OR = [
            {
                title: {
                    contains: searchQuery.trim(),
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: searchQuery.trim(),
                    mode: "insensitive",
                },
            },
        ];
    }

    // Parse sort parameter (format: "field-direction")
    const [sortField, sortDirection] = sortParam.split("-") as [string, "asc" | "desc"];

    // Map sort fields to Prisma orderBy
    const orderBy: any = {};
    if (sortField === "title") {
        orderBy.title = sortDirection;
    } else if (sortField === "updatedAt") {
        orderBy.updatedAt = sortDirection;
    } else {
        // Default to createdAt
        orderBy.createdAt = sortDirection || "desc";
    }

    // 3 queries instead of 6 — reduces connection pool pressure
    const [ads, totalFilteredCount, statusCounts] = await Promise.all([
        prisma.ad.findMany({
            where,
            orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
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
    const draftCount = countByStatus["DRAFT"] ?? 0;
    const publishedCount = countByStatus["PUBLISHED"] ?? 0;
    const soldCount = countByStatus["SOLD"] ?? 0;

    const totalPages = Math.ceil(totalFilteredCount / pageSize);

    return (
        <>
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between pl-14 lg:pl-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                        Ogłoszenia
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Zarządzaj swoimi ogłoszeniami
                    </p>
                </div>
                <Link href="/dashboard/new" className="hidden lg:flex">
                    <Button className="bg-primary hover:bg-primary/90 text-base px-6 py-3 h-auto">
                        <Plus className="h-5 w-5 mr-2" />
                        Nowe ogłoszenie
                    </Button>
                </Link>
            </div>

            {/* Ads List with filters */}
            <AdsList
                ads={ads}
                counts={{
                    all: totalCount,
                    drafts: draftCount,
                    published: publishedCount,
                    sold: soldCount,
                }}
                currentFilter={statusFilter || "all"}
                currentPage={page}
                totalPages={totalPages}
                totalFilteredCount={totalFilteredCount}
            />
        </div>
        </>
    );
}
