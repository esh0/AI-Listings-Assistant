import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PLATFORM_NAMES, CONDITION_NAMES } from "@/lib/types";

export const runtime = "nodejs";

/**
 * GET /api/ads/export - Export user's ads as CSV
 * Query params: status (optional) - filter by status before export
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get("status");
        const idsParam = searchParams.get("ids");
        const ids = idsParam ? idsParam.split(",").filter(Boolean) : null;

        const where: any = {
            userId: session.user.id,
        };

        // Filter by specific IDs (from bulk selection) — takes precedence over status filter
        if (ids && ids.length > 0) {
            where.id = { in: ids };
        } else if (statusParam && ["DRAFT", "PUBLISHED", "SOLD", "ARCHIVED"].includes(statusParam)) {
            // Filter by status if provided (and no IDs filter)
            where.status = statusParam;
        }

        const ads = await prisma.ad.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                platform: true,
                title: true,
                description: true,
                status: true,
                priceMin: true,
                priceMax: true,
                soldPrice: true,
                parameters: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Generate CSV content
        const headers = [
            "ID",
            "Platforma",
            "Tytuł",
            "Opis",
            "Status",
            "Cena Min",
            "Cena Max",
            "Cena Sprzedaży",
            "Stan",
            "Ton",
            "Dostawa",
            "Data utworzenia",
            "Data aktualizacji",
        ];

        const rows = ads.map((ad) => {
            const parameters = ad.parameters as any;

            return [
                ad.id,
                PLATFORM_NAMES[ad.platform as keyof typeof PLATFORM_NAMES] || ad.platform,
                escapeCSV(ad.title),
                escapeCSV(ad.description),
                ad.status,
                ad.priceMin?.toString() || "",
                ad.priceMax?.toString() || "",
                ad.soldPrice?.toString() || "",
                parameters?.condition ? CONDITION_NAMES[parameters.condition as keyof typeof CONDITION_NAMES] || parameters.condition : "",
                parameters?.tone || "",
                Array.isArray(parameters?.delivery) ? parameters.delivery.join(", ") : "",
                ad.createdAt.toISOString(),
                ad.updatedAt.toISOString(),
            ];
        });

        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        // Add UTF-8 BOM for Excel compatibility
        const bom = "\uFEFF";
        const csvWithBom = bom + csvContent;

        // Return CSV file
        return new NextResponse(csvWithBom, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="ogloszenia-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error("GET /api/ads/export error:", error);
        return NextResponse.json(
            { error: "Failed to export ads" },
            { status: 500 }
        );
    }
}

/**
 * Escape CSV field - wrap in quotes if contains comma, quote, or newline
 */
function escapeCSV(value: string): string {
    if (!value) return "";

    // Check if escaping is needed
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        // Escape quotes by doubling them
        return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
}
