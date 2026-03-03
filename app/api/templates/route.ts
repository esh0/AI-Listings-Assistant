import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Platform, ToneStyle, ProductCondition } from "@prisma/client";

export const runtime = "nodejs";

/**
 * GET /api/templates - List user's templates
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

        const templates = await prisma.template.findMany({
            where: { userId: session.user.id },
            orderBy: [
                { isDefault: "desc" }, // Default templates first
                { createdAt: "desc" },
            ],
        });

        return NextResponse.json({ templates });
    } catch (error) {
        console.error("GET /api/templates error:", error);
        return NextResponse.json(
            { error: "Failed to fetch templates" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/templates - Create new template
 * Body: { name, platform, tone, condition, delivery, isDefault? }
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
            name,
            platform,
            tone,
            condition,
            delivery,
            isDefault = false,
        } = body;

        // Basic validation
        if (!name || !platform || !tone || !condition || !delivery) {
            return NextResponse.json(
                { error: "Missing required fields: name, platform, tone, condition, delivery" },
                { status: 400 }
            );
        }

        // Validate enum values
        const validPlatforms: Platform[] = ["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"];
        const validTones: ToneStyle[] = ["professional", "friendly", "casual"];
        const validConditions: ProductCondition[] = [
            "nowy",
            "uzywany_jak_nowy",
            "uzywany_w_dobrym_stanie",
            "uzywany_w_przecietnym_stanie",
            "uszkodzony",
        ];

        if (!validPlatforms.includes(platform)) {
            return NextResponse.json(
                { error: "Invalid platform value" },
                { status: 400 }
            );
        }

        if (!validTones.includes(tone)) {
            return NextResponse.json(
                { error: "Invalid tone value" },
                { status: 400 }
            );
        }

        if (!validConditions.includes(condition)) {
            return NextResponse.json(
                { error: "Invalid condition value" },
                { status: 400 }
            );
        }

        // Check for duplicate name
        const existingTemplate = await prisma.template.findFirst({
            where: {
                userId: session.user.id,
                name,
            },
        });

        if (existingTemplate) {
            return NextResponse.json(
                { error: "Template with this name already exists" },
                { status: 400 }
            );
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.template.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true,
                },
                data: {
                    isDefault: false,
                },
            });
        }

        const template = await prisma.template.create({
            data: {
                userId: session.user.id,
                name,
                platform,
                tone,
                condition,
                delivery: JSON.parse(JSON.stringify(delivery)),
                isDefault,
            },
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error("POST /api/templates error:", error);
        return NextResponse.json(
            { error: "Failed to create template" },
            { status: 500 }
        );
    }
}
