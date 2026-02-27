import { z } from "zod";

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
export const generateAdRequestSchema = z.object({
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
    price: z.string(),
    delivery: z.string(),
    notes: z.string(),
    images: z
        .array(imageForRequestSchema)
        .min(1, "Przynajmniej jedno zdjęcie jest wymagane")
        .max(8, "Maksymalnie 8 zdjęć"),
});

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
    price: priceSuggestionSchema.optional(),
    images: z.array(imageAnalysisSchema).optional(),
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