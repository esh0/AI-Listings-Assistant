import { NextRequest, NextResponse } from "next/server";
import { generateAdRequestSchema } from "@/lib/schemas";
import { generateAd } from "@/lib/openai";
import { auth } from "@/auth";
import { consumeCredit } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { uploadImageFromBase64 } from "@/lib/image-upload";

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

        // If user is logged in, save ad to database with images uploaded to Supabase
        if (userId && result.isValid && result.title && result.description) {
            // Upload images to Supabase Storage
            const uploadedImages = await Promise.all(
                (result.images || []).map(async (img, index) => {
                    try {
                        // Convert to base64 data URL
                        const imageData = validationResult.data.images[index];
                        const base64Url = `data:${imageData.mimeType};base64,${imageData.base64}`;

                        // Upload with resize to 800px thumbnail
                        const supabaseUrl = await uploadImageFromBase64(base64Url, userId, 800);

                        return {
                            ...img,
                            url: supabaseUrl,
                        };
                    } catch (error) {
                        console.error(`[generate-ad] Failed to upload image ${index}:`, error);
                        // Keep original metadata without URL if upload fails
                        return img;
                    }
                })
            );

            const ad = await prisma.ad.create({
                data: {
                    userId,
                    platform: validationResult.data.platform,
                    title: result.title,
                    description: result.description,
                    status: "DRAFT",
                    priceMin: result.price?.min,
                    priceMax: result.price?.max,
                    images: JSON.parse(JSON.stringify(uploadedImages)),
                    parameters: {
                        condition: validationResult.data.condition,
                        tone: validationResult.data.tone,
                        delivery: validationResult.data.delivery.split(", "),
                        productName: validationResult.data.productName || "",
                        notes: validationResult.data.notes || "",
                        priceType: validationResult.data.priceType,
                        price: validationResult.data.price,
                    },
                },
            });

            // Add adId to response for frontend
            return NextResponse.json({ ...result, adId: ad.id });
        }

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