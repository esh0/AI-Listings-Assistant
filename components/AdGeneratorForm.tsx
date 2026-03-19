"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RotateCcw, Check, ArrowLeft, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ProductForm, ProductParameters, NotesAndCTA } from "@/components/ProductForm";
import { SoftWallModal } from "@/components/SoftWallModal";
import { NoCreditsModal } from "@/components/NoCreditsModal";
import { fileToBase64, getImageMimeType } from "@/lib/utils";
import { getGuestId } from "@/lib/guest-id";
import { toast } from "sonner";
import type {
    UploadedImage,
    Platform,
    ProductCondition,
    DeliveryOption,
    GenerateAdResponse,
    ToneStyle,
    PriceType,
} from "@/lib/types";
import type { Template } from "@/components/TemplatesList";

// Dynamic imports
const FullscreenLoading = dynamic(() => import("@/components/FullscreenLoading").then(mod => ({ default: mod.FullscreenLoading })), {
    ssr: false,
});
const ListingContent = dynamic(() => import("@/components/listing/ListingContent").then(mod => ({ default: mod.ListingContent })), {
    ssr: false,
});
const ListingSidebar = dynamic(() => import("@/components/listing/ListingSidebar").then(mod => ({ default: mod.ListingSidebar })), {
    ssr: false,
});
const TemplateFormModal = dynamic(() => import("@/components/TemplateFormModal").then(mod => ({ default: mod.TemplateFormModal })), {
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

    // Template state
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [selectedBodyTemplate, setSelectedBodyTemplate] = useState<string>("");
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

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
    const [showNoCredits, setShowNoCredits] = useState(false);
    const [isEditingResult, setIsEditingResult] = useState(false);

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

    // Fetch templates for RESELER plan users
    useEffect(() => {
        if (status === "authenticated" && session?.user?.plan === "RESELER") {
            fetch("/api/templates")
                .then((res) => res.ok ? res.json() : [])
                .then((data: Template[]) => setTemplates(data))
                .catch(() => {});
        }
    }, [status, session?.user?.plan]);

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
            updateSession({});
        }
        if (!result) {
            hasRefreshedSession.current = false;
        }
    }, [result, isLoading, status, router, updateSession]);

    const handleTemplateSelect = useCallback((templateId: string) => {
        setSelectedTemplateId(templateId);
        if (!templateId) {
            setSelectedBodyTemplate("");
            return;
        }
        const tpl = templates.find((t) => t.id === templateId);
        if (!tpl) return;
        setPlatform(tpl.platform);
        setSelectedTone(tpl.tone);
        setDelivery(tpl.delivery);
        if (tpl.notes) setNotes(tpl.notes);
        setSelectedBodyTemplate(tpl.bodyTemplate ?? "");
    }, [templates]);

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
        setIsEditingResult(false);
        hasInitializedEdits.current = false;
        setSelectedTemplateId("");
        setSelectedBodyTemplate("");
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
            toast.error("Nie udało się zapisać ogłoszenia. Spróbuj ponownie.");
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
                    ...(selectedBodyTemplate && { bodyTemplate: selectedBodyTemplate }),
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
                    setShowNoCredits(true);
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
    }, [images, platform, productName, condition, price, delivery, notes, selectedTone, priceType, selectedBodyTemplate]);

    const handleRetry = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    const handleEdit = useCallback(() => {
        setResult(null);
        setError(null);
        setEditedTitle("");
        setEditedDescription("");
        setIsEditingResult(false);
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
                        <h1 className="text-xl sm:text-2xl font-bold">
                            Nowe ogłoszenie
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            Wgraj zdjęcia i wygeneruj profesjonalne ogłoszenie
                        </p>
                </div>
            )}

            {/* Form Section */}
            {!result && (
                <>
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
                        {status === "authenticated" && session?.user?.plan === "RESELER" && templates.length > 0 && (
                            <div className="space-y-2 mb-6">
                                <label htmlFor="template-select" className="text-sm font-medium leading-none">
                                    Szablon
                                </label>
                                <div className="flex items-center gap-2">
                                    <select
                                        id="template-select"
                                        value={selectedTemplateId}
                                        onChange={(e) => handleTemplateSelect(e.target.value)}
                                        className="h-10 flex-1 border border-input rounded-lg px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                    >
                                        <option value="">Brak (domyślny)</option>
                                        {templates.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                    {selectedTemplateId && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-10 w-10 p-0 shrink-0"
                                            onClick={() => setEditingTemplate(templates.find((t) => t.id === selectedTemplateId) ?? null)}
                                            aria-label="Edytuj szablon"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
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
                    <CardWrapper className="flex flex-col">
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
                </>
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
                <section aria-labelledby="result-heading" className="space-y-6 animate-fade-in">
                    {/* Top bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h2 id="result-heading" className="font-sans text-xl sm:text-2xl font-bold">
                                Twoje ogłoszenie
                            </h2>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {status === "authenticated"
                                    ? "Sprawdź treść i zapisz w swoim panelu"
                                    : "Gotowe do skopiowania i wklejenia"
                                }
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {result.isValid === false ? (
                                <>
                                    <Button size="sm" variant="outline" onClick={handleRetry}>
                                        <ArrowLeft className="h-4 w-4 mr-1" />
                                        Popraw
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={handleReset}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Nowe
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {status === "authenticated" && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setIsEditingResult((e) => !e)}
                                        >
                                            <Pencil className="h-4 w-4 mr-1" />
                                            {isEditingResult ? "Zakończ" : "Edytuj"}
                                        </Button>
                                    )}
                                    {status === "authenticated" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleSave}
                                            disabled={!canSave}
                                        >
                                            <Check className="h-4 w-4 mr-1" />
                                            {isSaving ? "Zapisywanie…" : "Zapisz"}
                                        </Button>
                                    )}
                                    {status === "authenticated" && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleSaveAndNew}
                                            disabled={!canSave}
                                        >
                                            <RotateCcw className="h-4 w-4 mr-1" />
                                            {isSaving ? "Zapisywanie…" : "Zapisz i nowe"}
                                        </Button>
                                    )}
                                    {status !== "authenticated" && (
                                        <Button size="sm" variant="ghost" onClick={handleReset}>
                                            <RotateCcw className="h-4 w-4 mr-1" />
                                            Nowe
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                        <ListingContent
                            id=""
                            platform={platform}
                            status="DRAFT"
                            createdAt={new Date()}
                            title={editedTitle}
                            description={editedDescription}
                            editing={isEditingResult}
                            firstImage={imagePreviewsList[0]}
                            onTitleChange={setEditedTitle}
                            onDescriptionChange={setEditedDescription}
                            isGuest={status !== "authenticated"}
                        />
                        <ListingSidebar
                            platform={platform}
                            status="DRAFT"
                            priceMin={result.price?.min ?? null}
                            priceMax={result.price?.max ?? null}
                            soldPrice={null}
                            createdAt={new Date()}
                            updatedAt={new Date()}
                            parameters={{
                                condition,
                                tone: selectedTone,
                                delivery,
                                productName,
                                notes,
                                priceType,
                                userPrice: price ? parseFloat(price) : undefined,
                            }}
                            images={(result.images ?? []).map((img, idx) => ({
                                url: imagePreviewsList[idx] ?? "",
                                quality: img.quality,
                                suggestions: img.suggestions,
                            }))}
                            isGuest={status !== "authenticated"}
                        />
                    </div>
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

            {/* No credits modal */}
            <NoCreditsModal
                isVisible={showNoCredits}
                onClose={() => setShowNoCredits(false)}
            />

            {/* Template edit modal */}
            {editingTemplate && (
                <TemplateFormModal
                    template={editingTemplate}
                    onClose={async (saved) => {
                        setEditingTemplate(null);
                        if (saved) {
                            const res = await fetch("/api/templates");
                            if (res.ok) {
                                const data: Template[] = await res.json();
                                setTemplates(data);
                                const updated = data.find((t) => t.id === editingTemplate.id);
                                if (updated) handleTemplateSelect(updated.id);
                            }
                        }
                    }}
                />
            )}
        </>
    );
}
