// Platform types
export type Platform =
    | "olx"
    | "allegro_lokalnie"
    | "facebook_marketplace"
    | "vinted";

export type ProductCondition =
    | "nowy"
    | "używany, jak nowy"
    | "używany, w dobrym stanie"
    | "używany, w przeciętnym stanie"
    | "uszkodzony";

export type DeliveryOption = "odbiór osobisty" | "wysyłka";

export type ToneStyle =
    | "professional" | "friendly" | "casual"
    | "enthusiastic" | "funny" | "technical"
    | "persuasive" | "concise";

export const FREE_TONES: ToneStyle[] = ["professional", "friendly", "casual"];
export const ADVANCED_TONES: ToneStyle[] = ["enthusiastic", "funny", "technical", "persuasive", "concise"];

export type PriceType = "user_provided" | "ai_suggest" | "free";

export interface ToneVariant {
    tone: ToneStyle;
    title: string;
    description: string;
}

// Form data
export interface ProductFormData {
    platform: Platform;
    productName: string;
    condition: ProductCondition;
    price: string;
    delivery: DeliveryOption[];
    notes: string;
}

// Image data
export interface UploadedImage {
    file: File;
    preview: string;
    filename: string;
    base64?: string;
}

// Image for API request
export interface ImageForRequest {
    base64: string;
    filename: string;
    mimeType: string;
}

// API Request - now supports multiple images
export interface GenerateAdRequest {
    platform: Platform;
    productName: string;
    condition: ProductCondition;
    price?: string;
    priceType: PriceType;
    tone: ToneStyle;
    delivery: string;
    notes: string;
    images: ImageForRequest[];
    bodyTemplate?: string;
}

// API Response - Image analysis with preview for display
export interface ImageAnalysis {
    filename: string;
    quality?: string;
    suggestions?: string;
    isValid: boolean;
    reason?: string;
}

// Extended image analysis with preview for UI display
export interface ImageAnalysisWithPreview extends ImageAnalysis {
    preview?: string;
}

// API Response - Price suggestion
export interface PriceSuggestion {
    min: number;
    max: number;
    reason: string;
}

// API Response - Full response
export interface GenerateAdResponse {
    isValid: boolean;
    error?: string;
    title?: string;
    description?: string;
    toneVariants?: ToneVariant[];
    price?: PriceSuggestion | null;
    isFree?: boolean;
    confidence?: {
        productIdentification: "high" | "medium" | "low";
        specifications: "high" | "medium" | "low";
    };
    images?: ImageAnalysis[];
}

// Extended response with previews for UI
export interface GenerateAdResponseWithPreviews extends GenerateAdResponse {
    images?: ImageAnalysisWithPreview[];
}

// Platform display names
export const PLATFORM_NAMES: Record<Platform, string> = {
    olx: "OLX",
    allegro_lokalnie: "Allegro Lokalnie",
    facebook_marketplace: "FB Marketplace",
    vinted: "Vinted",
};

// Platform icon/color metadata — intentional hardcoded brand colors
export const PLATFORM_META: Record<Platform, { color: string; label: string }> = {
    olx: { color: "text-orange-500", label: "OLX" },
    allegro_lokalnie: { color: "text-green-600", label: "Allegro Lokalnie" },
    facebook_marketplace: { color: "text-blue-600", label: "FB Marketplace" },
    vinted: { color: "text-teal-600", label: "Vinted" },
};

// Condition display names
export const CONDITION_NAMES: Record<ProductCondition, string> = {
    nowy: "Nowy",
    "używany, jak nowy": "Używany, jak nowy",
    "używany, w dobrym stanie": "Używany, w dobrym stanie",
    "używany, w przeciętnym stanie": "Używany, w przeciętnym stanie",
    uszkodzony: "Uszkodzony",
};

// Delivery display names
export const DELIVERY_NAMES: Record<DeliveryOption, string> = {
    "odbiór osobisty": "Odbiór osobisty",
    wysyłka: "Wysyłka",
};

// Max images allowed
export const MAX_IMAGES = 8;

// Platform default tones
export const PLATFORM_DEFAULT_TONES: Record<Platform, ToneStyle> = {
    olx: "casual",
    allegro_lokalnie: "professional",
    facebook_marketplace: "friendly",
    vinted: "friendly",
};

// Tone style display names
export const TONE_STYLE_NAMES: Record<ToneStyle, string> = {
    professional: "Profesjonalny",
    friendly: "Przyjazny",
    casual: "Swobodny",
    enthusiastic: "Entuzjastyczny",
    funny: "Zabawny",
    technical: "Techniczny",
    persuasive: "Przekonujący",
    concise: "Zwięzły",
};

// Tone style descriptions
export const TONE_STYLE_DESCRIPTIONS: Record<ToneStyle, string> = {
    professional: "Formalny, rzeczowy styl idealny dla poważnych transakcji",
    friendly: "Ciepły i przystępny ton budujący zaufanie",
    casual: "Bezpośredni i luźny język jak w rozmowie",
    enthusiastic: "Energetyczny, pełen emocji styl przyciągający uwagę",
    funny: "Lekki humor i luźna atmosfera bez utraty wiarygodności",
    technical: "Precyzyjne dane i specyfikacje bez ozdobników",
    persuasive: "Argumenty korzyści i CTA skłaniające do zakupu",
    concise: "Minimum słów, maksimum treści — bullet points i krótkie zdania",
};