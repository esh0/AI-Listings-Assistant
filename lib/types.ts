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
    price: string;
    delivery: string;
    notes: string;
    images: ImageForRequest[];
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
    price?: PriceSuggestion;
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
    facebook_marketplace: "Facebook Marketplace",
    vinted: "Vinted",
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