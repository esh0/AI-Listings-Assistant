import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { generateAdRequestSchema } from "@/lib/schemas";
import { generateAd } from "@/lib/openai";
import { auth } from "@/auth";
import { consumeCredit } from "@/lib/credits";
import { checkGuestLimit, consumeGuestCredit, hashIP, GUEST_MAX_IMAGES } from "@/lib/guest-tracking";

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

        const validatedData = validationResult.data;

        if (session?.user?.id) {
            // Authenticated user: consume credit
            try {
                await consumeCredit(session.user.id);
            } catch (error) {
                return NextResponse.json(
                    {
                        isValid: false,
                        error: error instanceof Error ? error.message : "Brak dostępnych kredytów.",
                    },
                    { status: 403 }
                );
            }
        } else {
            // Guest user: validate guestId and check limits
            const { guestId } = validatedData;

            if (!guestId) {
                return NextResponse.json(
                    { isValid: false, error: "Identyfikator gościa jest wymagany" },
                    { status: 400 }
                );
            }

            // Enforce guest image limit
            if (validatedData.images.length > GUEST_MAX_IMAGES) {
                return NextResponse.json(
                    {
                        isValid: false,
                        error: `Goście mogą przesłać maksymalnie ${GUEST_MAX_IMAGES} zdjęcie. Zarejestruj się, aby przesyłać więcej.`,
                    },
                    { status: 400 }
                );
            }

            // Get IP hash
            const headersList = await headers();
            const ip =
                headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                headersList.get("x-real-ip") ||
                "unknown";
            const ipHash = hashIP(ip);

            // Check guest limits
            const guestCheck = await checkGuestLimit(guestId, ipHash);
            if (!guestCheck.allowed) {
                return NextResponse.json(
                    { isValid: false, error: guestCheck.reason },
                    { status: 429 }
                );
            }

            // Generate ad
            const result = await generateAd(validatedData);

            // Consume guest credit after successful generation
            await consumeGuestCredit(guestId, ipHash);

            return NextResponse.json(result);
        }

        // Generate ad using OpenAI (authenticated path)
        const result = await generateAd(validatedData);

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
