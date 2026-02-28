"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ShoppingBag, Send, RotateCcw, Pencil, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ProductForm, ProductParameters, NotesAndCTA } from "@/components/ProductForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fileToBase64, getImageMimeType } from "@/lib/utils";

// Dynamic imports for components loaded conditionally after user action
// Reduces initial bundle size and improves Time to Interactive (TTI)
const FullscreenLoading = dynamic(() => import("@/components/FullscreenLoading").then(mod => ({ default: mod.FullscreenLoading })), {
    ssr: false,
});
const AdResult = dynamic(() => import("@/components/AdResult").then(mod => ({ default: mod.AdResult })), {
    ssr: false,
});
import type {
    UploadedImage,
    Platform,
    ProductCondition,
    DeliveryOption,
    GenerateAdResponse,
    ToneStyle,
    PriceType,
} from "@/lib/types";

// Default values for form reset - hoisted outside component to avoid recreation
const DEFAULT_PLATFORM: Platform = "olx";
const DEFAULT_CONDITION: ProductCondition = "używany, w dobrym stanie";
const DEFAULT_DELIVERY: DeliveryOption[] = ["odbiór osobisty", "wysyłka"];
const DEFAULT_TONE: ToneStyle = "friendly";
const DEFAULT_PRICE_TYPE: PriceType = "ai_suggest";

export default function HomePage() {
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

    // Ref for scrolling and abort controller
    const topRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Create an array of preview URLs in order (by index)
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

    // Scroll to top when result is set
    useEffect(() => {
        if (result && !isLoading) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
        }
    }, [result, isLoading]);

    // Cleanup abort controller on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleSubmit = useCallback(async () => {
        if (images.length === 0) {
            setError("Dodaj przynajmniej jedno zdjęcie produktu");
            return;
        }

        if (delivery.length === 0) {
            setError("Wybierz przynajmniej jedną opcję dostawy");
            return;
        }

        // Check if offline
        if (!navigator.onLine) {
            setError("Brak połączenia z internetem. Sprawdź swoje połączenie i spróbuj ponownie.");
            return;
        }

        // Cancel any pending request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Convert all images to base64
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
                // Handle specific HTTP error codes
                if (response.status === 429) {
                    throw new Error("Zbyt wiele próśb. Poczekaj chwilę i spróbuj ponownie.");
                } else if (response.status === 401 || response.status === 403) {
                    throw new Error("Brak autoryzacji. Sprawdź konfigurację API.");
                } else if (response.status >= 500) {
                    throw new Error("Błąd serwera. Spróbuj ponownie za chwilę.");
                }

                throw new Error(
                    data.error || "Wystąpił błąd podczas generowania ogłoszenia"
                );
            }

            setResult(data);
        } catch (err) {
            // Don't show error if request was aborted
            if (err instanceof Error && err.name === "AbortError") {
                return;
            }

            console.error("Error generating ad:", err);

            // Handle network errors
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

    // Full reset - clears everything
    const handleReset = useCallback(() => {
        // Revoke all image URLs to prevent memory leaks
        images.forEach((img) => {
            if (img.preview) {
                URL.revokeObjectURL(img.preview);
            }
        });

        // Reset all state to defaults
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

    // Edit - go back to form without clearing data
    const handleEdit = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    // Show fullscreen loading during generation
    if (isLoading) {
        return <FullscreenLoading isLoading={isLoading} duration={15} />;
    }

    return (
        <div className="min-h-screen bg-background" ref={topRef}>
            {/* Offline Indicator */}
            {isOffline && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium" role="alert" aria-live="assertive">
                    Brak połączenia z internetem
                </div>
            )}

            {/* Header - simplified, no sticky */}
            {!result && (
                <header className="border-b bg-background" role="banner">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center transition-transform hover:scale-105">
                                <ShoppingBag className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">
                                Marketplace AI
                            </span>
                        </div>
                        <ThemeToggle />
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" role="main">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section - only show when not showing results */}
                    {!result && (
                        <section aria-labelledby="page-title" className="mb-12 sm:mb-16">
                            <h1 id="page-title" className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight">
                                Sprzedaj szybciej <br className="hidden sm:inline" />
                                <span className="text-primary">z lepszym opisem</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                Wrzuć zdjęcia, AI stworzy profesjonalne ogłoszenie gotowe na OLX, Allegro, Facebook i Vinted.
                            </p>
                        </section>
                    )}

                    {/* Form Section - 2x2 Grid */}
                    {!result && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Card 1: Photos */}
                            <CardWrapper title="Zdjęcia produktu" icon={Camera} className="min-h-[400px]">
                                {/* Product Name */}
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

                    {/* Result Section - Editorial Layout */}
                    {result && (
                        <section aria-labelledby="result-heading" className="space-y-8 animate-fade-in">
                            {/* Results Header */}
                            <div className="flex items-start justify-between gap-4 pb-6 border-b-2 border-foreground">
                                <div>
                                    <h2 id="result-heading" className="font-serif text-3xl sm:text-4xl font-normal mb-2 tracking-tight">
                                        Twoje ogłoszenie
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Gotowe do skopiowania i wklejenia
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={handleEdit} aria-label="Edytuj dane produktu" className="transition-all hover:scale-105 active:scale-95">
                                        <Pencil className="h-4 w-4 mr-1.5" aria-hidden="true" />
                                        Edytuj
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleReset} aria-label="Zacznij od nowa" className="transition-all hover:scale-105 active:scale-95">
                                        <RotateCcw className="h-4 w-4 mr-1.5" aria-hidden="true" />
                                        Nowe
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
                            />
                        </section>
                    )}

                    {/* Footer - simplified */}
                    {!result && (
                        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
                            <p>Obsługuje: OLX • Allegro Lokalnie • Facebook Marketplace • Vinted</p>
                        </footer>
                    )}
                </div>
            </main>
        </div>
    );
}