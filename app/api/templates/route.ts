import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Platform, ToneStyle } from "@prisma/client";
import { CONDITION_MAP } from "@/lib/condition-map";
import { ToneStyleSchema } from "@/lib/schemas";

const createTemplateSchema = z.object({
    name: z.string().min(1).max(100),
    platform: z.enum(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"]),
    tone: ToneStyleSchema,
    condition: z.enum([
        "nowy",
        "używany, jak nowy",
        "używany, w dobrym stanie",
        "używany, w przeciętnym stanie",
        "uszkodzony",
    ]),
    delivery: z.array(z.enum(["odbiór osobisty", "wysyłka"])).min(1),
    bodyTemplate: z.string().max(3000).optional(),
    priceType: z.enum(["ai_suggest", "user_provided", "free"]).optional(),
    notes: z.string().max(1000).optional(),
});

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }
    if (session.user.plan !== "RESELER") {
        return NextResponse.json({ error: "Funkcja dostępna tylko w planie Reseler" }, { status: 403 });
    }
    const templates = await prisma.template.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            platform: true,
            tone: true,
            condition: true,
            delivery: true,
            bodyTemplate: true,
            priceType: true,
            notes: true,
            isDefault: true,
            createdAt: true,
        },
    });
    return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }
    if (session.user.plan !== "RESELER") {
        return NextResponse.json({ error: "Funkcja dostępna tylko w planie Reseler" }, { status: 403 });
    }
    const body = await request.json();
    const result = createTemplateSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json(
            { error: result.error.errors.map((e) => e.message).join(", ") },
            { status: 400 }
        );
    }
    const { name, platform, tone, condition, delivery, bodyTemplate, priceType, notes } = result.data;
    try {
        const template = await prisma.template.create({
            data: {
                userId: session.user.id,
                name,
                platform: platform as Platform,
                tone: tone as ToneStyle,
                condition: CONDITION_MAP[condition],
                delivery,
                bodyTemplate,
                priceType,
                notes,
            },
        });
        return NextResponse.json(template, { status: 201 });
    } catch (error: unknown) {
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                { error: "Szablon o tej nazwie już istnieje" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Błąd podczas tworzenia szablonu" },
            { status: 500 }
        );
    }
}
