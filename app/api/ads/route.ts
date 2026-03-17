import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdStatus } from "@prisma/client";
import { uploadImageFromBase64 } from "@/lib/image-upload";
import { consumeCredit } from "@/lib/credits";
import { logActivity, adDetail } from "@/lib/activity";

export const runtime = "nodejs";

/**
 * GET /api/ads - List user's ads with optional filtering
 * Query params: status (optional), limit (default 50), offset (default 0)
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
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Validate status if provided
        let status: AdStatus | undefined;
        if (statusParam && ["DRAFT", "PUBLISHED", "SOLD", "ARCHIVED"].includes(statusParam)) {
            status = statusParam as AdStatus;
        }

        const where = {
            userId: session.user.id,
            ...(status && { status }),
        };

        const [ads, total] = await Promise.all([
            prisma.ad.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
            }),
            prisma.ad.count({ where }),
        ]);

        return NextResponse.json({
            ads,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        });
    } catch (error) {
        console.error("GET /api/ads error:", error);
        return NextResponse.json(
            { error: "Failed to fetch ads" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/ads - Create new ad manually (not from generator)
 * Body: { platform, title, description, status?, priceMin?, priceMax?, images, parameters, fromSoftwall? }
 * Images can be base64 data URLs - will be uploaded to Supabase Storage as thumbnails
 * fromSoftwall: If true, consume credit (prevents abuse by existing users logging out)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            platform,
            title,
            description,
            status = "DRAFT",
            priceMin,
            priceMax,
            images = [],
            parameters = {},
            fromSoftwall = false,
        } = body;

        // Basic validation
        if (!platform || !title || !description) {
            return NextResponse.json(
                { error: "Missing required fields: platform, title, description" },
                { status: 400 }
            );
        }

        // Consume credit if this ad comes from softwall (existing user logged in)
        // This prevents abuse: user logs out → generates ad → logs back in → bypasses credit check
        if (fromSoftwall) {
            try {
                await consumeCredit(session.user.id);
            } catch (error) {
                return NextResponse.json(
                    {
                        error: error instanceof Error ? error.message : "Brak dostępnych kredytów.",
                    },
                    { status: 403 }
                );
            }
        }

        // Upload images to Supabase Storage if they're base64
        const uploadedImages = await Promise.all(
            images.map(async (img: any) => {
                // If URL is base64 data URL, upload to Supabase
                if (img.url && img.url.startsWith("data:image/")) {
                    try {
                        const supabaseUrl = await uploadImageFromBase64(
                            img.url,
                            session.user.id!,
                            800 // Max width for thumbnails
                        );
                        return { ...img, url: supabaseUrl };
                    } catch (error) {
                        console.error("Failed to upload image:", error);
                        // Keep original if upload fails
                        return img;
                    }
                }
                // If already a Supabase URL or other URL, keep as is
                return img;
            })
        );

        const ad = await prisma.ad.create({
            data: {
                userId: session.user.id,
                platform,
                title,
                description,
                status,
                priceMin,
                priceMax,
                images: structuredClone(uploadedImages),
                parameters: structuredClone(parameters),
            },
        });

        // Log activity (fire-and-forget)
        logActivity(session.user.id, "AD_SAVED", adDetail(ad.title, ad.platform)).catch(() => {});

        return NextResponse.json(ad, { status: 201 });
    } catch (error) {
        console.error("POST /api/ads error:", error);
        return NextResponse.json(
            { error: "Failed to create ad" },
            { status: 500 }
        );
    }
}
