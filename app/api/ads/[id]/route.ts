import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteAdImages } from "@/lib/image-upload";

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

        const {
            title,
            description,
            status,
            soldPrice,
            priceMin,
            priceMax,
            parameters,
        } = body;

        // Validate status transitions
        if (status === "SOLD" && soldPrice === undefined) {
            return NextResponse.json(
                { error: "soldPrice is required when status is SOLD" },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData: any = {};
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
