"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RotateCcw, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ProductForm, ProductParameters, NotesAndCTA } from "@/components/ProductForm";
import { SoftWallModal } from "@/components/SoftWallModal";
import { fileToBase64, getImageMimeType } from "@/lib/utils";
import type {
    UploadedImage,
    Platform,
    ProductCondition,
    DeliveryOption,
    GenerateAdResponse,
    ToneStyle,
    PriceType,
} from "@/lib/types";

// Dynamic imports
const FullscreenLoading = dynamic(() => import("@/components/FullscreenLoading").then(mod => ({ default: mod.FullscreenLoading })), {
    ssr: false,
});
const AdResult = dynamic(() => import("@/components/AdResult").then(mod => ({ default: mod.AdResult })), {
    ssr: false,
});

// Default values
const DEFAULT_PLATFORM: Platform = "olx";
const DEFAULT_CONDITION: ProductCondition = "używany, w dobrym stanie";
const DEFAULT_DELIVERY: DeliveryOption[] = ["odbiór osobisty", "wysyłka"];
const DEFAULT_TONE: ToneStyle = "friendly";
const DEFAULT_PRICE_TYPE: PriceType = "ai_suggest";

export function AdGeneratorForm() {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Form state
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [platform, setPlatform] = useState<Platform>(DEFAULT_PLATFORM);
    const [productName, setProductName] = useState("");
    const [condition, setCondition] = useState<ProductCondition>(DEFAULT_CONDITION);
    const [price, setPrice] = useState("");
    const [delivery, setDelivery] = useState<DeliveryOption[]>(DEFAULT_DELIVERY);
    const [notes, setNotes] = useState("");
    const [selectedTone, setSelectedTone] = useState<ToneStyle>(DEFAULT_TONE);
    const [priceType, setPriceType] = useState<PriceType>(DEFAULT_PRICE_TYPE);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateAdResponse | null>(null);
    const [isOffline, setIsOffline] = useState(false);
    const [showSoftWall, setShowSoftWall] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);

    const imagePreviewsList = useMemo(() => {
        return images.map((img) => img.preview);
    }, [images]);

    const canSubmit = useMemo(() =>
        images.length > 0 && delivery.length > 0,
        [images.length, delivery.length]
    );

    // Detect online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        setIsOffline(!navigator.onLine);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Show soft-wall for unauthenticated users
    useEffect(() => {
        if (result && !isLoading && status === "unauthenticated") {
            setTimeout(() => {
                setShowSoftWall(true);
            }, 1500);
        }
    }, [result, isLoading, status]);

    // Cleanup abort controller
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // If authenticated and result with adId, redirect to dashboard
    useEffect(() => {
        if (result && (result as any).adId && status === "authenticated") {
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000); // Show result for 2 seconds then redirect
        }
    }, [result, status, router]);

    const handleSubmit = useCallback(async () => {
        if (images.length === 0) {
            setError("Dodaj przynajmniej jedno zdjęcie produktu");
            return;
        }

        if (delivery.length === 0) {
            setError("Wybierz przynajmniej jedną opcję dostawy");
            return;
        }

        if (!navigator.onLine) {
            setError("Brak połączenia z internetem. Sprawdź swoje połączenie i spróbuj ponownie.");
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const imagesForRequest = await Promise.all(
                images.map(async (img) => ({
                    base64: await fileToBase64(img.file),
                    filename: img.filename,
                    mimeType: getImageMimeType(img.filename),
                }))
            );

            const response = await fetch("/api/generate-ad", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    platform,
                    productName,
                    condition,
                    priceType,
                    price: priceType === "user_provided" ? price : undefined,
                    delivery: delivery.join(", "),
                    notes,
                    images: imagesForRequest,
                    tone: selectedTone,
                    generateAllTones: false,
                }),
                signal: abortControllerRef.current.signal,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("Zbyt wiele próśb. Poczekaj chwilę i spróbuj ponownie.");
                } else if (response.status === 401 || response.status === 403) {
                    throw new Error("Brak autoryzacji. Sprawdź konfigurację API.");
                } else if (response.status >= 500) {
                    throw new Error("Błąd serwera. Spróbuj ponownie za chwilę.");
                }
                throw new Error(data.error || "Wystąpił błąd podczas generowania ogłoszenia");
            }

            setResult(data);
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
                return;
            }

            console.error("Error generating ad:", err);

            if (err instanceof TypeError && err.message === "Failed to fetch") {
                setError("Błąd połączenia. Sprawdź internet i spróbuj ponownie.");
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Wystąpił nieoczekiwany błąd"
                );
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [images, platform, productName, condition, price, delivery, notes, selectedTone, priceType]);

    const handleReset = useCallback(() => {
        images.forEach((img) => {
            if (img.preview) {
                URL.revokeObjectURL(img.preview);
            }
        });

        setImages([]);
        setPlatform(DEFAULT_PLATFORM);
        setProductName("");
        setCondition(DEFAULT_CONDITION);
        setPrice("");
        setDelivery(DEFAULT_DELIVERY);
        setNotes("");
        setSelectedTone(DEFAULT_TONE);
        setPriceType(DEFAULT_PRICE_TYPE);
        setResult(null);
        setError(null);
    }, [images]);

    const handleEdit = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    if (isLoading) {
        return (
            <FullscreenLoading
                isLoading={isLoading}
                imageCount={images.length}
                platform={platform}
            />
        );
    }

    return (
        <>
            {/* Offline Indicator */}
            {isOffline && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium" role="alert" aria-live="assertive">
                    Brak połączenia z internetem
                </div>
            )}

            {/* Form Section */}
            {!result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card 1: Photos */}
                    <CardWrapper title="Zdjęcia produktu" icon={Camera} className="min-h-[400px]">
                        <div className="space-y-2 mb-6">
                            <label htmlFor="productName" className="text-sm font-medium leading-none">
                                Nazwa produktu <span className="text-muted-foreground text-xs">(opcjonalne)</span>
                            </label>
                            <Input
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="np. iPhone 13 Pro, Krzesło IKEA…"
                                maxLength={200}
                                aria-describedby="productName-hint"
                            />
                            <p id="productName-hint" className="text-xs text-muted-foreground">
                                Jeśli nie podasz nazwy, AI rozpozna produkt ze zdjęcia
                            </p>
                        </div>

                        <UploadDropzone
                            images={images}
                            onImagesChange={setImages}
                        />
                    </CardWrapper>

                    {/* Card 2: Platform + Tone */}
                    <CardWrapper className="min-h-[400px]">
                        <ProductForm
                            platform={platform}
                            selectedTone={selectedTone}
                            onPlatformChange={setPlatform}
                            onToneChange={setSelectedTone}
                        />
                    </CardWrapper>

                    {/* Card 3: Parameters */}
                    <CardWrapper>
                        <ProductParameters
                            condition={condition}
                            price={price}
                            delivery={delivery}
                            priceType={priceType}
                            onConditionChange={setCondition}
                            onPriceChange={setPrice}
                            onDeliveryChange={setDelivery}
                            onPriceTypeChange={setPriceType}
                        />
                    </CardWrapper>

                    {/* Card 4: Notes + CTA */}
                    <CardWrapper>
                        <NotesAndCTA
                            notes={notes}
                            canSubmit={canSubmit}
                            isOffline={isOffline}
                            onNotesChange={setNotes}
                            onSubmit={handleSubmit}
                        />
                    </CardWrapper>
                </div>
            )}

            {/* Error Alert */}
            {error && !result && (
                <Alert variant="destructive" role="alert" aria-live="assertive" className="mb-6">
                    <div className="flex items-start justify-between w-full gap-4">
                        <AlertDescription className="flex-1">{error}</AlertDescription>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setError(null)}
                            className="shrink-0"
                            aria-label="Zamknij komunikat o błędzie"
                        >
                            Zamknij
                        </Button>
                    </div>
                </Alert>
            )}

            {/* Result Section */}
            {result && (
                <section aria-labelledby="result-heading" className="space-y-8 animate-fade-in">
                    <div className="flex items-start justify-between gap-4 pb-6 border-b">
                        <div>
                            <h2 id="result-heading" className="font-sans text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                                Twoje ogłoszenie
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Gotowe do skopiowania i wklejenia
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="lg"
                                onClick={handleReset}
                                aria-label="Zacznij od nowa"
                                className="bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-bold transition-colors shadow-lg hover:shadow-xl"
                            >
                                <RotateCcw className="h-5 w-5 mr-2" aria-hidden="true" />
                                Nowe ogłoszenie
                            </Button>
                        </div>
                    </div>

                    <AdResult
                        result={result}
                        imagePreviews={imagePreviewsList}
                        platform={platform}
                        productName={productName}
                        condition={condition}
                        priceType={priceType}
                        userPrice={price}
                        delivery={delivery.join(", ")}
                        selectedTone={selectedTone}
                        onEdit={handleEdit}
                    />
                </section>
            )}

            {/* Soft-wall modal for unauthenticated users */}
            {result && showSoftWall && status === "unauthenticated" && (
                <SoftWallModal
                    adData={{
                        title: result.title || "",
                        description: result.description || "",
                        priceMin: result.price?.min,
                        priceMax: result.price?.max,
                        priceReasoning: result.price?.reason,
                        images: (result.images || []).map((img) => ({
                            url: imagePreviewsList[result.images?.indexOf(img) || 0] || "",
                            quality: img.quality || "",
                            suggestions: img.suggestions || "",
                        })),
                        parameters: {
                            platform,
                            tone: selectedTone,
                            condition,
                            delivery,
                            productName,
                            notes,
                            priceType,
                            userPrice: price ? parseFloat(price) : undefined,
                        },
                    }}
                    isVisible={showSoftWall}
                    onClose={() => setShowSoftWall(false)}
                />
            )}
        </>
    );
}
