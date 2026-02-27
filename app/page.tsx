"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Sparkles, ShoppingBag, Send, RotateCcw, Pencil, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ProductForm } from "@/components/ProductForm";
import { AdResult } from "@/components/AdResult";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { ThemeToggle } from "@/components/ThemeToggle";
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

// Default values for form reset
const DEFAULT_PLATFORM: Platform = "olx";
const DEFAULT_CONDITION: ProductCondition = "używany, w dobrym stanie";
const DEFAULT_DELIVERY: DeliveryOption[] = ["odbiór osobisty"];

export default function HomePage() {
    // Form state
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [platform, setPlatform] = useState<Platform>(DEFAULT_PLATFORM);
    const [productName, setProductName] = useState("");
    const [condition, setCondition] = useState<ProductCondition>(DEFAULT_CONDITION);
    const [price, setPrice] = useState("");
    const [delivery, setDelivery] = useState<DeliveryOption[]>(DEFAULT_DELIVERY);
    const [notes, setNotes] = useState("");
    const [selectedTone, setSelectedTone] = useState<ToneStyle>("friendly");
    const [generateAllTones, setGenerateAllTones] = useState(false);
    const [priceType, setPriceType] = useState<PriceType>("ai_suggest");

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
                    generateAllTones,
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
    }, [images, platform, productName, condition, price, delivery, notes, selectedTone, generateAllTones, priceType]);

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
                            <h1 id="page-title" className="font-serif text-4xl sm:text-5xl font-normal mb-4 leading-tight tracking-tight">
                                Sprzedaj szybciej <br className="hidden sm:inline" />
                                <span className="text-primary">z lepszym opisem</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                Wrzuć zdjęcia, AI stworzy profesjonalne ogłoszenie gotowe na OLX, Allegro, Facebook i Vinted.
                            </p>
                        </section>
                    )}

                    {/* Form Section */}
                    {!result && (
                        <form
                            className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            aria-label="Formularz generowania ogłoszenia"
                        >
                            {/* Image Upload - larger, left column */}
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
                                        <Camera className="h-5 w-5 text-primary" aria-hidden="true" />
                                        Zdjęcia
                                    </h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Do 8 zdjęć produktu
                                    </p>
                                </div>
                                <UploadDropzone
                                    images={images}
                                    onImagesChange={setImages}
                                />
                            </div>

                            {/* Product Form - compact, right column */}
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                                        Szczegóły
                                    </h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Dane opcjonalne
                                    </p>
                                </div>
                                <ProductForm
                                    platform={platform}
                                    productName={productName}
                                    condition={condition}
                                    price={price}
                                    delivery={delivery}
                                    notes={notes}
                                    selectedTone={selectedTone}
                                    generateAllTones={generateAllTones}
                                    priceType={priceType}
                                    onPlatformChange={setPlatform}
                                    onProductNameChange={setProductName}
                                    onConditionChange={setCondition}
                                    onPriceChange={setPrice}
                                    onDeliveryChange={setDelivery}
                                    onNotesChange={setNotes}
                                    onToneChange={setSelectedTone}
                                    onGenerateAllTonesChange={setGenerateAllTones}
                                    onPriceTypeChange={setPriceType}
                                />
                            </div>
                        </form>
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

                    {/* Submit Button - full width at bottom */}
                    {!result && (
                        <div className="mt-8">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full sm:w-auto sm:min-w-[300px] text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handleSubmit}
                                disabled={!canSubmit || isOffline}
                                aria-label="Generuj ogłoszenie sprzedażowe"
                                title={isOffline ? "Brak połączenia z internetem" : undefined}
                            >
                                <Send className="h-5 w-5 mr-2" aria-hidden="true" />
                                {isOffline ? "Brak połączenia" : "Generuj ogłoszenie"}
                            </Button>
                        </div>
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

                            <AdResult result={result} imagePreviews={imagePreviewsList} />
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