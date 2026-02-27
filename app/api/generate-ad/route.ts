import { NextRequest, NextResponse } from "next/server";
import { generateAdRequestSchema } from "@/lib/schemas";
import { generateAd } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate request
        const validationResult = generateAdRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    isValid: false,
                    error: `Błąd walidacji: ${validationResult.error.errors
                        .map((e) => e.message)
                        .join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Check if API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                {
                    isValid: false,
                    error: "Brak skonfigurowanego klucza API OpenAI.",
                },
                { status: 500 }
            );
        }

        // Generate ad using OpenAI
        const result = await generateAd(validationResult.data);

        return NextResponse.json(result);
    } catch (error) {
        console.error("API error:", error);

        return NextResponse.json(
            {
                isValid: false,
                error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
            },
            { status: 500 }
        );
    }
}