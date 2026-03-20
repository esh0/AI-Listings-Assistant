"use client";

import { useState, useEffect } from "react";
import { Star, Package, Truck, MessageSquare, FileText, Camera, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    PLATFORM_NAMES,
    CONDITION_NAMES,
    TONE_STYLE_NAMES,
    type Platform,
    type ProductCondition,
    type ToneStyle,
} from "@/lib/types";
import type { AdStatus } from "@prisma/client";

interface AdImage {
    url: string;
    quality?: string;
    suggestions?: string;
}

interface ListingSidebarProps {
    platform: Platform;
    status: AdStatus;
    priceMin: number | null;
    priceMax: number | null;
    soldPrice: number | null;
    publishPrice: number | null;
    createdAt: Date;
    updatedAt: Date;
    parameters: {
        condition?: string;
        tone?: string;
        delivery?: string[];
        productName?: string;
        notes?: string;
        priceType?: string;
        userPrice?: number;
    } | null;
    images: AdImage[];
    isGuest?: boolean;
}

function StarRating({ score }: { score: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={cn(
                        "h-3 w-3",
                        s <= score ? "fill-primary text-primary" : "text-muted"
                    )}
                />
            ))}
        </div>
    );
}

function qualityToScore(quality?: string): number {
    if (!quality) return 3;
    const q = quality.toLowerCase();
    if (q.includes("doskonał") || q.includes("świetna") || q.includes("excellent")) return 5;
    if (q.includes("bardzo dobr") || q.includes("bardzo dob")) return 4;
    if (q.includes("dobr") || q.includes("good")) return 3;
    if (q.includes("średni") || q.includes("słab") || q.includes("poor")) return 2;
    if (q.includes("zł") || q.includes("bad") || q.includes("bardzo słab")) return 1;
    return 3;
}

export function ListingSidebar({
    platform,
    status,
    priceMin,
    priceMax,
    soldPrice,
    publishPrice,
    createdAt,
    updatedAt,
    parameters,
    images,
    isGuest = false,
}: ListingSidebarProps) {
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!lightboxUrl) return;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxUrl(null); };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [lightboxUrl]);

    const condition = parameters?.condition;
    const tone = parameters?.tone;
    const delivery = parameters?.delivery;
    const notes = parameters?.notes;
    const userPrice = parameters?.userPrice;
    const priceType = parameters?.priceType;

    const hasShipping = Array.isArray(delivery) ? delivery.includes("wysyłka") : false;

    // "Proponowana" row — what was set at generation time
    const proposedLabel = priceType === "ai_suggest" ? "Proponowana (AI)" : "Proponowana";
    const proposedValue: string | null =
        priceType === "free"
            ? "Za darmo"
            : priceType === "user_provided" && userPrice
            ? `${userPrice} zł`
            : priceType === "ai_suggest" && (priceMin || priceMax)
            ? (priceMin && priceMax ? `${priceMin}–${priceMax} zł` : `${priceMin ?? priceMax} zł`)
            : null;

    // "Opublikowane za" row — from dedicated publishPrice field (null = Za darmo)
    const publishedValue: string =
        publishPrice != null ? `${publishPrice} zł` : "Za darmo";

    return (
        <div className="lg:col-span-2 space-y-4">
            {/* Prices */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                <h3 className="text-sm font-medium">Ceny</h3>
                <div className="space-y-2 text-sm">
                    {/* Proponowana — always show if we have a value */}
                    {proposedValue && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{proposedLabel}</span>
                            <span className="font-medium">{proposedValue}</span>
                        </div>
                    )}

                    {/* Twoja cena — guest with user_provided */}
                    {isGuest && priceType === "user_provided" && userPrice && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Twoja cena</span>
                            <span className="font-medium">{userPrice} zł</span>
                        </div>
                    )}

                    {/* Opublikowane za — show for PUBLISHED, SOLD, ARCHIVED */}
                    {!isGuest && (status === "PUBLISHED" || status === "SOLD" || status === "ARCHIVED") && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Opublikowane za</span>
                            <span className="font-medium">{publishedValue}</span>
                        </div>
                    )}

                    {/* Sprzedane za — show for SOLD */}
                    {!isGuest && status === "SOLD" && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Sprzedane za</span>
                            <span className="font-medium text-success">
                                {soldPrice != null ? `${soldPrice} zł` : "Za darmo"}
                            </span>
                        </div>
                    )}

                </div>
            </div>

            {/* Parameters */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                <h3 className="text-sm font-medium">Parametry</h3>
                <div className="space-y-2.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 shrink-0" />
                        <span>
                            Platforma:{" "}
                            <span className="text-foreground font-medium">{PLATFORM_NAMES[platform]}</span>
                        </span>
                    </div>

                    {condition && (
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 shrink-0" />
                            <span>
                                Stan:{" "}
                                <span className="text-foreground font-medium">
                                    {CONDITION_NAMES[condition as ProductCondition] ?? condition}
                                </span>
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 shrink-0" />
                        <span>
                            Wysyłka:{" "}
                            <span className="text-foreground font-medium">{hasShipping ? "Tak" : "Nie"}</span>
                        </span>
                    </div>

                    {tone && (
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 shrink-0" />
                            <span>
                                Ton:{" "}
                                <span className="text-foreground font-medium">
                                    {TONE_STYLE_NAMES[tone as ToneStyle] ?? tone}
                                </span>
                            </span>
                        </div>
                    )}

                    {notes && (
                        <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>
                                Dodatkowe:{" "}
                                <span className="text-foreground font-medium">{notes}</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Photo quality */}
            {images.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium">Jakość zdjęć</h3>
                    </div>
                    <div className="space-y-2.5">
                        {images.map((img, idx) => {
                            const score = qualityToScore(img.quality);
                            return (
                                <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <button
                                                type="button"
                                                onClick={() => setLightboxUrl(img.url)}
                                                className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0 relative group cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                aria-label={`Powiększ zdjęcie ${idx + 1}`}
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={`Zdjęcie ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                    width={48}
                                                    height={48}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Maximize2 className="h-3 w-3 text-white" />
                                                </div>
                                            </button>
                                            <span className="text-xs text-muted-foreground truncate">
                                                Zdjęcie {idx + 1}
                                            </span>
                                        </div>
                                        <StarRating score={score} />
                                    </div>
                                    {img.suggestions && (
                                        <p className="text-[11px] text-muted-foreground pl-14">{img.suggestions}</p>
                                    )}
                                    {!img.suggestions && img.quality && (
                                        <p className="text-[11px] text-muted-foreground pl-14">{img.quality}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Informacje — hidden for guests */}
            {!isGuest && (
                <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
                    <h3 className="text-sm font-medium">Informacje</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Utworzono</span>
                            <span className="font-medium">
                                {new Date(createdAt).toLocaleDateString("pl-PL")}
                            </span>
                        </div>
                        {(status === "PUBLISHED" || status === "SOLD" || status === "ARCHIVED") && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Opublikowano</span>
                                <span className="font-medium">
                                    {new Date(updatedAt).toLocaleDateString("pl-PL")}
                                </span>
                            </div>
                        )}
                        {status === "SOLD" && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Sprzedano</span>
                                <span className="font-medium">
                                    {new Date(updatedAt).toLocaleDateString("pl-PL")}
                                </span>
                            </div>
                        )}
                        {status === "ARCHIVED" && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Wycofano</span>
                                <span className="font-medium">
                                    {new Date(updatedAt).toLocaleDateString("pl-PL")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightboxUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxUrl(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Podgląd zdjęcia"
                >
                    <button
                        type="button"
                        onClick={() => setLightboxUrl(null)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Zamknij"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <img
                        src={lightboxUrl}
                        alt="Powiększone zdjęcie"
                        className="max-h-[90vh] max-w-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
