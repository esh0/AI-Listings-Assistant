"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RotateCcw, Camera, CheckCircle, Check, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ProductForm, ProductParameters, NotesAndCTA } from "@/components/ProductForm";
import { SoftWallModal } from "@/components/SoftWallModal";
import { fileToBase64, getImageMimeType } from "@/lib/utils";
import { getGuestId } from "@/lib/guest-id";
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
const GUEST_MAX_IMAGES = 3;
const IMAGE_LIMITS: Record<string, number> = {
    FREE: 3,
    STARTER: 5,
    RESELER: 8,
    BUSINESS: 12,
};

export function AdGeneratorForm({ onResultChange, showHeader = true }: { onResultChange?: (hasResult: boolean) => void; showHeader?: boolean }) {
    const router = useRouter();
    const { data: session, status, update: updateSession } = useSession();

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

    // Editable content state
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [editedDescription, setEditedDescription] = useState<string>("");

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateAdResponse | null>(null);
    const [isOffline, setIsOffline] = useState(false);
    const [showSoftWall, setShowSoftWall] = useState(false);

    // Store original base64 images for softwall to upload to Supabase
    const [base64Images, setBase64Images] = useState<Array<{ base64: string; filename: string; mimeType: string }>>([]);

    const abortControllerRef = useRef<AbortController | null>(null);
    const hasInitializedEdits = useRef(false);

    const imagePreviewsList = useMemo(() => {
        return images.map((img) => img.preview);
    }, [images]);

    const canSubmit = useMemo(() =>
        images.length > 0 && delivery.length > 0,
        [images.length, delivery.length]
    );

    // Check if authenticated user has credits
    const userCredits = useMemo(() => {
        if (status !== "authenticated") return null;
        const available = session?.user?.creditsAvailable ?? 0;
        const boost = session?.user?.boostCredits ?? 0;
        return { available, boost, total: available + boost };
    }, [status, session?.user?.creditsAvailable, session?.user?.boostCredits]);

    const hasUserCredits = userCredits === null || userCredits.total > 0;

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

    // Notify parent when result appears/disappears
    useEffect(() => {
        onResultChange?.(!!result);
    }, [result, onResultChange]);

    // Show soft-wall for unauthenticated users (only on successful generation)
    useEffect(() => {
        if (result && result.isValid && !isLoading && status === "unauthenticated") {
            setTimeout(() => {
                setShowSoftWall(true);
            }, 1500);
        }
    }, [result, isLoading, status]);

    // Initialize edited values from AI result (only once)
    useEffect(() => {
        if (result && !hasInitializedEdits.current) {
            if (result.title) setEditedTitle(result.title);
            if (result.description) setEditedDescription(result.description);
            hasInitializedEdits.current = true;
        }
        if (!result) {
            hasInitializedEdits.current = false;
        }
    }, [result]);

    // Validation for edited content
    const isTitleValid = useMemo(() => editedTitle.trim().length > 0, [editedTitle]);
    const isDescriptionValid = useMemo(() => editedDescription.trim().length > 0, [editedDescription]);
    const canSave = useMemo(() =>
        isTitleValid && isDescriptionValid && !isSaving && result?.isValid === true,
        [isTitleValid, isDescriptionValid, isSaving, result]
    );

    // Refresh session after successful ad generation for authenticated users (once)
    const hasRefreshedSession = useRef(false);
    useEffect(() => {
        if (result && result.isValid && !isLoading && status === "authenticated" && !hasRefreshedSession.current) {
            hasRefreshedSession.current = true;
            router.refresh();
            updateSession();
        }
        if (!result) {
            hasRefreshedSession.current = false;
        }
    }, [result, isLoading, status, router, updateSession]);

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
        setEditedTitle("");
        setEditedDescription("");
        hasInitializedEdits.current = false;
    }, [images]);

    const saveAd = useCallback(async (): Promise<boolean> => {
        if (!result || !result.isValid || !editedTitle || !editedDescription) {
            return false;
        }

        setIsSaving(true);

        try {
            const response = await fetch("/api/ads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    platform,
                    title: editedTitle,
                    description: editedDescription,
                    status: "DRAFT",
                    priceMin: result.price?.min,
                    priceMax: result.price?.max,
                    images: base64Images.map((img, index) => ({
                        url: `data:${img.mimeType};base64,${img.base64}`,
                        quality: result.images?.[index]?.quality || "",
                        suggestions: result.images?.[index]?.suggestions || "",
                    })),
                    parameters: {
                        platform,
                        tone: selectedTone,
                        condition,
                        delivery,
                        productName,
                        notes,
                        priceType,
                        userPrice: priceType === "user_provided" ? parseFloat(price) : undefined,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save ad");
            }

            return true;
        } catch (error) {
            console.error("Failed to save ad:", error);
            alert("Nie udało się zapisać ogłoszenia. Spróbuj ponownie.");
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [result, platform, selectedTone, condition, delivery, productName, notes, priceType, price, base64Images, editedTitle, editedDescription]);

    const handleSave = useCallback(async () => {
        const ok = await saveAd();
        if (ok) {
            router.push("/dashboard/ads");
        }
    }, [saveAd, router]);

    const handleSaveAndNew = useCallback(async () => {
        const ok = await saveAd();
        if (ok) {
            handleReset();
        }
    }, [saveAd, handleReset]);

    // Cleanup abort controller
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

            // Store base64 images for saving later (both authenticated and unauthenticated users)
            setBase64Images(imagesForRequest);

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
                    ...(!session?.user?.id && { guestId: getGuestId() }),
                }),
                signal: abortControllerRef.current.signal,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setShowSoftWall(true);
                    return;
                } else if (response.status === 403) {
                    setResult({ isValid: false, error: data.error || "Brak dostępnych kredytów. Zmień plan lub dokup kredyty." });
                    return;
                } else if (response.status === 401) {
                    throw new Error("Wymagane logowanie. Zaloguj się, aby kontynuować.");
                } else if (response.status >= 500) {
                    throw new Error("Błąd serwera. Spróbuj ponownie za chwilę.");
                }
                throw new Error(data.error || "Wystąpił błąd podczas generowania ogłoszenia");
            }

            // Show result for all users (authenticated and unauthenticated)
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

    const handleRetry = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    const handleEdit = useCallback(() => {
        setResult(null);
        setError(null);
        setEditedTitle("");
        setEditedDescription("");
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

            {/* Header - only show when not showing result */}
            {!result && showHeader && (
                <div className="space-y-4 sm:space-y-8 mb-4 sm:mb-8">
                    <div className="pl-14 lg:pl-0">
                        <h1 className="text-xl sm:text-2xl font-bold">
                            Nowe ogłoszenie
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            Wgraj zdjęcia i wygeneruj profesjonalne ogłoszenie
                        </p>
                    </div>
                </div>
            )}

            {/* Form Section */}
            {!result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card 1: Photos */}
                    <CardWrapper className="min-h-[400px]">
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
                            maxImages={status === "authenticated" ? (IMAGE_LIMITS[session?.user?.plan ?? "FREE"] ?? 3) : GUEST_MAX_IMAGES}
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
                            hasCredits={hasUserCredits}
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
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b">
                        <div>
                            <h2 id="result-heading" className="font-sans text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                                Twoje ogłoszenie
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {status === "authenticated"
                                    ? "Sprawdź treść i zapisz w swoim panelu"
                                    : "Gotowe do skopiowania i wklejenia"
                                }
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            {result.isValid === false ? (
                                <>
                                    <Button
                                        size="lg"
                                        onClick={handleRetry}
                                        aria-label="Popraw ogłoszenie"
                                        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground h-14 text-lg font-bold transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
                                        Popraw
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={handleReset}
                                        aria-label="Stwórz nowe ogłoszenie"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-bold transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                                        Nowe ogłoszenie
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {status === "authenticated" && (
                                        <Button
                                            size="lg"
                                            onClick={handleSave}
                                            disabled={!canSave}
                                            aria-label="Zapisz ogłoszenie"
                                            className="bg-success hover:bg-success/90 text-success-foreground h-14 text-lg font-bold transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Check className="h-5 w-5 mr-2" aria-hidden="true" />
                                            {isSaving ? "Zapisywanie…" : "Zapisz"}
                                        </Button>
                                    )}
                                    <Button
                                        size="lg"
                                        onClick={status === "authenticated" ? handleSaveAndNew : handleReset}
                                        disabled={status === "authenticated" ? !canSave : isSaving}
                                        aria-label={status === "authenticated" ? "Zapisz i stwórz następne ogłoszenie" : "Zacznij od nowa"}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-bold transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
                                    >
                                        <RotateCcw className="h-5 w-5 mr-2" aria-hidden="true" />
                                        {status === "authenticated" ? (isSaving ? "Zapisywanie…" : "Zapisz i stwórz następne") : "Nowe ogłoszenie"}
                                    </Button>
                                </>
                            )}
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
                        editedTitle={editedTitle}
                        editedDescription={editedDescription}
                        onTitleChange={setEditedTitle}
                        onDescriptionChange={setEditedDescription}
                    />
                </section>
            )}

            {/* Soft-wall modal for unauthenticated users */}
            {showSoftWall && status === "unauthenticated" && (
                <SoftWallModal
                    mode={result ? "save" : "limit"}
                    adData={result ? {
                        title: result.title || "",
                        description: result.description || "",
                        priceMin: result.price?.min,
                        priceMax: result.price?.max,
                        priceReasoning: result.price?.reason,
                        images: (result.images || []).map((img, index) => ({
                            url: `data:${base64Images[index]?.mimeType || "image/jpeg"};base64,${base64Images[index]?.base64 || ""}`,
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
                    } : undefined}
                    isVisible={showSoftWall}
                    onClose={() => setShowSoftWall(false)}
                />
            )}
        </>
    );
}
