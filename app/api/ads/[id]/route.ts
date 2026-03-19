import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteAdImages } from "@/lib/image-upload";
import { logActivity, adDetail } from "@/lib/activity";
import { updateAdSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * GET /api/ads/[id] - Get single ad by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Parallelize auth and params resolution
        const [session, { id }] = await Promise.all([
            auth(),
            params
        ]);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const ad = await prisma.ad.findFirst({
            where: {
                id,
                userId: session.user.id, // Ensure user owns the ad
            },
        });

        if (!ad) {
            return NextResponse.json(
                { error: "Ad not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(ad);
    } catch (error) {
        console.error("GET /api/ads/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch ad" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/ads/[id] - Update ad
 * Body: { title?, description?, status?, soldPrice?, priceMin?, priceMax?, parameters? }
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Parallelize auth, params, and body parsing
        const [session, { id }, body] = await Promise.all([
            auth(),
            params,
            request.json()
        ]);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check ownership
        const existingAd = await prisma.ad.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingAd) {
            return NextResponse.json(
                { error: "Ad not found" },
                { status: 404 }
            );
        }

        // Validate request body
        const parsed = updateAdSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Nieprawidłowe dane", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const {
            title,
            description,
            status,
            soldPrice,
            priceMin,
            priceMax,
            parameters,
        } = parsed.data;

        // Prepare update data
        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (soldPrice !== undefined) updateData.soldPrice = soldPrice;
        if (priceMin !== undefined) updateData.priceMin = priceMin;
        if (priceMax !== undefined) updateData.priceMax = priceMax;
        if (parameters !== undefined) {
            updateData.parameters = JSON.parse(JSON.stringify(parameters));
        }

        const updatedAd = await prisma.ad.update({
            where: { id },
            data: updateData,
        });

        // Log status change activity (fire-and-forget)
        const STATUS_ACTIONS: Record<string, string> = {
            PUBLISHED: "AD_PUBLISHED",
            SOLD: "AD_SOLD",
            ARCHIVED: "AD_ARCHIVED",
        };
        if (body.status && STATUS_ACTIONS[body.status]) {
            logActivity(session.user.id, STATUS_ACTIONS[body.status], adDetail(updatedAd.title, updatedAd.platform)).catch(() => {});
        }

        return NextResponse.json(updatedAd);
    } catch (error) {
        console.error("PATCH /api/ads/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update ad" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/ads/[id] - Delete ad and its images
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Parallelize auth and params resolution
        const [session, { id }] = await Promise.all([
            auth(),
            params
        ]);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check ownership
        const existingAd = await prisma.ad.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingAd) {
            return NextResponse.json(
                { error: "Ad not found" },
                { status: 404 }
            );
        }

        // Delete images from Supabase Storage (background, don't block deletion)
        deleteAdImages(session.user.id, id).catch((error) => {
            console.error("Failed to delete images from storage:", error);
        });

        // Log activity before deletion (fire-and-forget)
        logActivity(session.user.id, "AD_DELETED", adDetail(existingAd.title, existingAd.platform)).catch(() => {});

        // Delete ad from database
        await prisma.ad.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/ads/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete ad" },
            { status: 500 }
        );
    }
}
