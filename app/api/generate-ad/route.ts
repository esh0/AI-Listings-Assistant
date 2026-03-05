import { NextRequest, NextResponse } from "next/server";
import { generateAdRequestSchema } from "@/lib/schemas";
import { generateAd } from "@/lib/openai";
import { auth } from "@/auth";
import { consumeCredit } from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
    try {
        // Parallelize body parsing and auth check (independent operations)
        const [body, session] = await Promise.all([
            request.json(),
            auth()
        ]);

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

        // Check authentication and credits (optional - soft-wall)
        let userId: string | null = null;

        if (session?.user?.id) {
            userId = session.user.id;

            // Consume credit if logged in
            try {
                await consumeCredit(userId);
            } catch (error) {
                return NextResponse.json(
                    {
                        isValid: false,
                        error: error instanceof Error ? error.message : "Brak dostępnych kredytów.",
                    },
                    { status: 403 }
                );
            }
        }

        // Generate ad using OpenAI
        const result = await generateAd(validationResult.data);

        // Return result without saving (user will save manually)
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