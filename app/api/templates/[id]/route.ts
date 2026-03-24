import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Platform, ToneStyle } from "@prisma/client";
import { CONDITION_MAP } from "@/lib/condition-map";
import { ToneStyleSchema } from "@/lib/schemas";

const updateTemplateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    platform: z.enum(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted", "ebay", "amazon", "etsy"]).optional(),
    tone: ToneStyleSchema.optional(),
    condition: z
        .enum([
            "nowy",
            "używany, jak nowy",
            "używany, w dobrym stanie",
            "używany, w przeciętnym stanie",
            "uszkodzony",
        ])
        .optional(),
    delivery: z.array(z.enum(["odbiór osobisty", "wysyłka"])).min(1).optional(),
    bodyTemplate: z.string().max(3000).optional(),
    priceType: z.enum(["ai_suggest", "user_provided", "free"]).optional(),
    notes: z.string().max(1000).optional(),
});

async function getTemplateOwned(id: string, userId: string) {
    return prisma.template.findFirst({ where: { id, userId } });
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }
    if (session.user.plan !== "RESELER") {
        return NextResponse.json(
            { error: "Funkcja dostępna tylko w planie Reseler" },
            { status: 403 }
        );
    }
    const template = await getTemplateOwned(id, session.user.id);
    if (!template) {
        return NextResponse.json({ error: "Nie znaleziono szablonu" }, { status: 404 });
    }
    return NextResponse.json(template);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }
    if (session.user.plan !== "RESELER") {
        return NextResponse.json(
            { error: "Funkcja dostępna tylko w planie Reseler" },
            { status: 403 }
        );
    }
    const template = await getTemplateOwned(id, session.user.id);
    if (!template) {
        return NextResponse.json({ error: "Nie znaleziono szablonu" }, { status: 404 });
    }
    const body = await request.json();
    const result = updateTemplateSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json(
            { error: result.error.errors.map((e) => e.message).join(", ") },
            { status: 400 }
        );
    }
    const { condition, platform, tone, ...rest } = result.data;
    try {
        const updated = await prisma.template.update({
            where: { id },
            data: {
                ...rest,
                ...(platform !== undefined ? { platform: platform as Platform } : {}),
                ...(tone !== undefined ? { tone: tone as ToneStyle } : {}),
                ...(condition !== undefined ? { condition: CONDITION_MAP[condition] } : {}),
            },
        });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json(
            { error: "Błąd podczas aktualizacji szablonu" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }
    if (session.user.plan !== "RESELER") {
        return NextResponse.json(
            { error: "Funkcja dostępna tylko w planie Reseler" },
            { status: 403 }
        );
    }
    const template = await getTemplateOwned(id, session.user.id);
    if (!template) {
        return NextResponse.json({ error: "Nie znaleziono szablonu" }, { status: 404 });
    }
    await prisma.template.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
}
