import { z } from "zod";
import type { ToneStyle, PriceType } from "@/lib/types";

// Enum schemas for tone and price types
export const ToneStyleSchema = z.enum(["professional", "friendly", "casual"]);
export const PriceTypeSchema = z.enum(["user_provided", "ai_suggest", "free"]);

// Form validation schema
export const productFormSchema = z.object({
    platform: z.enum([
        "olx",
        "allegro_lokalnie",
        "facebook_marketplace",
        "vinted",
    ]),
    productName: z.string().optional(),
    condition: z.enum([
        "nowy",
        "używany, jak nowy",
        "używany, w dobrym stanie",
        "używany, w przeciętnym stanie",
        "uszkodzony",
    ]),
    price: z.string().optional(),
    priceType: PriceTypeSchema,
    tone: ToneStyleSchema,
    delivery: z
        .array(z.enum(["odbiór osobisty", "wysyłka"]))
        .min(1, "Wybierz przynajmniej jedną opcję dostawy"),
    notes: z.string().optional(),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;

// Image schema for API request
export const imageForRequestSchema = z.object({
    base64: z.string().min(1, "Zdjęcie jest wymagane"),
    filename: z.string(),
    mimeType: z.string(),
});

// API request validation schema - now supports multiple images
export const generateAdRequestSchema = z
    .object({
        platform: z.enum([
            "olx",
            "allegro_lokalnie",
            "facebook_marketplace",
            "vinted",
        ]),
        productName: z.string(),
        condition: z.enum([
            "nowy",
            "używany, jak nowy",
            "używany, w dobrym stanie",
            "używany, w przeciętnym stanie",
            "uszkodzony",
        ]),
        price: z.string().optional(),
        priceType: PriceTypeSchema,
        tone: ToneStyleSchema,
        delivery: z.string(),
        notes: z.string(),
        images: z
            .array(imageForRequestSchema)
            .min(1, "Przynajmniej jedno zdjęcie jest wymagane")
            .max(8, "Maksymalnie 8 zdjęć"),
        guestId: z.string().min(1).max(100).optional(),
        bodyTemplate: z.string().max(3000).optional(),
    })
    .refine(
        (data) => {
            if (data.priceType === "user_provided") {
                return !!data.price && data.price.trim().length > 0;
            }
            return true;
        },
        {
            message: "Cena jest wymagana gdy wybrano 'Moja cena'",
            path: ["price"],
        }
    );

export type GenerateAdRequestSchema = z.infer<typeof generateAdRequestSchema>;

// API response validation schema
export const imageAnalysisSchema = z.object({
    filename: z.string(),
    quality: z.string().optional(),
    suggestions: z.string().optional(),
    isValid: z.boolean(),
    reason: z.string().optional(),
});

export const priceSuggestionSchema = z.object({
    min: z.number(),
    max: z.number(),
    reason: z.string(),
});

export const generateAdResponseSchema = z.object({
    isValid: z.boolean(),
    error: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    price: priceSuggestionSchema.nullable().optional(),
    isFree: z.boolean().optional(),
    images: z.array(imageAnalysisSchema).optional(),
    toneVariants: z.array(z.object({
        tone: ToneStyleSchema,
        title: z.string(),
        description: z.string(),
    })).optional(),
    confidence: z.object({
        productIdentification: z.enum(["high", "medium", "low"]),
        specifications: z.enum(["high", "medium", "low"]),
    }).optional(),
});

export type GenerateAdResponseSchema = z.infer<typeof generateAdResponseSchema>;

// File validation
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGES = 8;
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export function validateImageFile(file: File): {
    valid: boolean;
    error?: string;
} {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: "Dozwolone formaty: JPG, PNG, WEBP",
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: "Maksymalny rozmiar pliku to 10MB",
        };
    }

    return { valid: true };
}

// ===== API schemas for ad management =====

const platformEnum = z.enum(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"]);
const adStatusEnum = z.enum(["DRAFT", "PUBLISHED", "SOLD", "ARCHIVED"]);

// Schema for saving an ad (POST /api/ads)
export const createAdSchema = z.object({
    platform: platformEnum,
    title: z.string().min(1, "Tytuł jest wymagany").max(200, "Tytuł jest zbyt długi"),
    description: z.string().min(1, "Opis jest wymagany").max(5000, "Opis jest zbyt długi"),
    status: adStatusEnum.default("DRAFT"),
    priceMin: z.number().nonnegative("Cena minimalna nie może być ujemna").nullable().optional(),
    priceMax: z.number().nonnegative("Cena maksymalna nie może być ujemna").nullable().optional(),
    images: z.array(z.object({
        url: z.string(),
        quality: z.string().optional(),
        suggestions: z.string().optional(),
    })).default([]),
    parameters: z.record(z.unknown()).default({}),
    fromSoftwall: z.boolean().default(false),
});

export type CreateAdSchema = z.infer<typeof createAdSchema>;

// Schema for updating an ad (PATCH /api/ads/[id])
export const updateAdSchema = z.object({
    title: z.string().min(1, "Tytuł jest wymagany").max(200, "Tytuł jest zbyt długi").optional(),
    description: z.string().min(1, "Opis jest wymagany").max(5000, "Opis jest zbyt długi").optional(),
    status: adStatusEnum.optional(),
    soldPrice: z.number().nonnegative("Cena sprzedaży nie może być ujemna").nullable().optional(),
    publishPrice: z.number().nonnegative("Cena publikacji nie może być ujemna").nullable().optional(),
    priceMin: z.number().nonnegative("Cena minimalna nie może być ujemna").nullable().optional(),
    priceMax: z.number().nonnegative("Cena maksymalna nie może być ujemna").nullable().optional(),
    parameters: z.record(z.unknown()).optional(),
}).refine(
    (data) => !(data.status === "SOLD" && data.soldPrice === undefined),
    { message: "soldPrice is required when status is SOLD", path: ["soldPrice"] }
);

export type UpdateAdSchema = z.infer<typeof updateAdSchema>;