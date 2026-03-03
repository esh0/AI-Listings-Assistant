import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/templates/[id] - Get single template by ID
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

        const template = await prisma.template.findFirst({
            where: {
                id,
                userId: session.user.id, // Ensure user owns the template
            },
        });

        if (!template) {
            return NextResponse.json(
                { error: "Template not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error("GET /api/templates/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch template" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/templates/[id] - Update template
 * Body: { name?, platform?, tone?, condition?, delivery?, isDefault? }
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
        const existingTemplate = await prisma.template.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { error: "Template not found" },
                { status: 404 }
            );
        }

        const {
            name,
            platform,
            tone,
            condition,
            delivery,
            isDefault,
        } = body;

        // Check for duplicate name (if changing name)
        if (name && name !== existingTemplate.name) {
            const duplicateTemplate = await prisma.template.findFirst({
                where: {
                    userId: session.user.id,
                    name,
                    id: { not: id }, // Exclude current template
                },
            });

            if (duplicateTemplate) {
                return NextResponse.json(
                    { error: "Template with this name already exists" },
                    { status: 400 }
                );
            }
        }

        // If setting as default, unset other defaults
        if (isDefault === true) {
            await prisma.template.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true,
                    id: { not: id },
                },
                data: {
                    isDefault: false,
                },
            });
        }

        // Prepare update data
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (platform !== undefined) updateData.platform = platform;
        if (tone !== undefined) updateData.tone = tone;
        if (condition !== undefined) updateData.condition = condition;
        if (delivery !== undefined) {
            updateData.delivery = JSON.parse(JSON.stringify(delivery));
        }
        if (isDefault !== undefined) updateData.isDefault = isDefault;

        const updatedTemplate = await prisma.template.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedTemplate);
    } catch (error) {
        console.error("PATCH /api/templates/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update template" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/templates/[id] - Delete template
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
        const existingTemplate = await prisma.template.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { error: "Template not found" },
                { status: 404 }
            );
        }

        // Delete template from database
        await prisma.template.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/templates/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete template" },
            { status: 500 }
        );
    }
}
