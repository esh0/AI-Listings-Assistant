import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdsList } from "@/components/AdsList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdsPage(props: { searchParams: SearchParams }) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin?callbackUrl=/dashboard/ads");
    }

    // Get filters and sort from search params
    const searchParams = await props.searchParams;
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

    // Fetch ads with filters, sorting, and pagination
    const [ads, totalFilteredCount] = await Promise.all([
        prisma.ad.findMany({
            where,
            orderBy,
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.ad.count({ where }),
    ]);

    const totalPages = Math.ceil(totalFilteredCount / pageSize);

    // Count by status
    const [totalCount, draftCount, publishedCount, soldCount] = await Promise.all([
        prisma.ad.count({ where: { userId: session.user.id } }),
        prisma.ad.count({ where: { userId: session.user.id, status: "DRAFT" } }),
        prisma.ad.count({ where: { userId: session.user.id, status: "PUBLISHED" } }),
        prisma.ad.count({ where: { userId: session.user.id, status: "SOLD" } }),
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Ogłoszenia
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Zarządzaj swoimi ogłoszeniami
                    </p>
                </div>
                <div className="flex gap-3">
                    {ads.length > 0 && (
                        <Link href="/api/ads/export">
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Eksportuj CSV
                            </Button>
                        </Link>
                    )}
                    <Link href="/dashboard/new">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Nowe ogłoszenie
                        </Button>
                    </Link>
                </div>
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
    );
}
