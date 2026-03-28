"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Camera,
    Package,
    Truck,
    DollarSign,
    RotateCcw,
    Check,
    ArrowLeft,
    Plus,
    X,
    ShoppingBag,
    Store,
    Facebook,
    Shirt,
    Pencil,
    Crown,
    ShoppingCart,
    Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { UploadDropzone } from "@/components/UploadDropzone";
import { SoftWallModal } from "@/components/SoftWallModal";
import { fileToBase64, getImageMimeType, cn } from "@/lib/utils";
import { getGuestId } from "@/lib/guest-id";
import { savePendingAd } from "@/lib/storage";
import { ListingContent } from "@/components/listing/ListingContent";
import { ListingSidebar } from "@/components/listing/ListingSidebar";
import type {
    UploadedImage,
    Platform,
    ProductCondition,
    DeliveryOption,
    GenerateAdResponse,
    ToneStyle,
    PriceType,
} from "@/lib/types";
import {
    PLATFORM_NAMES,
    PLATFORM_DEFAULT_TONES,
    DELIVERY_NAMES,
    TONE_STYLE_NAMES,
    FREE_TONES,
    ADVANCED_TONES,
} from "@/lib/types";

// Dynamic imports for conditionally rendered components
const FullscreenLoading = dynamic(
    () => import("@/components/FullscreenLoading").then((mod) => ({ default: mod.FullscreenLoading })),
    { ssr: false }
);
const AdResult = dynamic(
    () => import("@/components/AdResult").then((mod) => ({ default: mod.AdResult })),
    { ssr: false }
);

// Default values (hoisted outside component)
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

// Condition data
const CONDITIONS: ProductCondition[] = [
    "nowy",
    "używany, jak nowy",
    "używany, w dobrym stanie",
    "używany, w przeciętnym stanie",
    "uszkodzony",
];
const CONDITION_SHORT: Record<ProductCondition, string> = {
    nowy: "Nowy",
    "używany, jak nowy": "Jak nowy",
    "używany, w dobrym stanie": "Bardzo dobry",
    "używany, w przeciętnym stanie": "Dobry",
    uszkodzony: "Dostateczny",
};

// Platform icons with brand colors (intentional hardcoded per CLAUDE.md exceptions)
const PLATFORM_ICONS = {
    olx: { Icon: ShoppingBag, color: "text-orange-500" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600" },
    vinted: { Icon: Shirt, color: "text-teal-600" },
    ebay: { Icon: ShoppingCart, color: "text-yellow-500" },
    amazon: { Icon: Package, color: "text-yellow-600" },
    etsy: { Icon: Tag, color: "text-orange-400" },
} as const;

const LOCKED_PLATFORMS: Platform[] = ["ebay", "amazon", "etsy"];

// Step animation variants
const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
};

export function LandingForm() {
    const router = useRouter();
    const { data: session, status, update: updateSession } = useSession();

    // Wizard step state
    const [currentStep, setCurrentStep] = useState(0);

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
    const [isFreeChecked, setIsFreeChecked] = useState(false);
    const [tooltipTone, setTooltipTone] = useState<ToneStyle | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [tooltipPlatform, setTooltipPlatform] = useState<Platform | null>(null);
    const platformTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const [isEditingResult, setIsEditingResult] = useState(false);

    // Store original base64 images for softwall to upload to Supabase
    const [base64Images, setBase64Images] = useState<Array<{ base64: string; filename: string; mimeType: string }>>([]);

    const abortControllerRef = useRef<AbortController | null>(null);
    const hasInitializedEdits = useRef(false);
    const resultSectionRef = useRef<HTMLElement>(null);

    const imagePreviewsList = useMemo(() => {
        return images.map((img) => img.preview);
    }, [images]);

    const canSubmit = useMemo(
        () => images.length > 0 && delivery.length > 0,
        [images.length, delivery.length]
    );

    const userPlan = status === "authenticated" ? (session?.user?.plan ?? "FREE") : "FREE";

    const handleLockedToneClick = useCallback((tone: ToneStyle) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setTooltipTone(tone);
        timerRef.current = setTimeout(() => setTooltipTone(null), 2000);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleLockedPlatformClick = useCallback((p: Platform) => {
        if (platformTimerRef.current) clearTimeout(platformTimerRef.current);
        setTooltipPlatform(p);
        platformTimerRef.current = setTimeout(() => setTooltipPlatform(null), 2000);
    }, []);

    useEffect(() => {
        return () => {
            if (platformTimerRef.current) clearTimeout(platformTimerRef.current);
        };
    }, []);

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

    // Show soft-wall for unauthenticated users (only on successful generation)
    useEffect(() => {
        if (result && result.isValid && !isLoading && status === "unauthenticated") {
            setTimeout(() => {
                setShowSoftWall(true);
            }, 1500);
        }
    }, [result, isLoading, status]);

    // Scroll to result section when result appears
    useEffect(() => {
        if (result) {
            setTimeout(() => {
                resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        }
    }, [result]);

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
    const canSave = useMemo(
        () => isTitleValid && isDescriptionValid && !isSaving && result?.isValid === true,
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

    // Handle platform change (auto-set tone)
    const handlePlatformChange = useCallback((newPlatform: Platform) => {
        setPlatform(newPlatform);
        setSelectedTone(PLATFORM_DEFAULT_TONES[newPlatform]);
    }, []);

    // Handle free checkbox
    const handleFreeCheckbox = useCallback((checked: boolean) => {
        setIsFreeChecked(checked);
        if (checked) {
            setPriceType("free");
            setPrice("");
        } else {
            setPriceType(price ? "user_provided" : "ai_suggest");
        }
    }, [price]);

    // Handle price input change
    const handlePriceChange = useCallback((val: string) => {
        const sanitized = val.replace(/[^0-9.]/g, "");
        setPrice(sanitized);
        if (!isFreeChecked) {
            setPriceType(sanitized ? "user_provided" : "ai_suggest");
        }
    }, [isFreeChecked]);

    // Delivery toggle with functional setState
    const handleDeliveryToggle = useCallback((option: DeliveryOption) => {
        setDelivery((prev) => {
            if (prev.includes(option)) {
                if (prev.length > 1) {
                    return prev.filter((d) => d !== option);
                }
                return prev;
            }
            return [...prev, option];
        });
    }, []);

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
        setIsFreeChecked(false);
        setResult(null);
        setError(null);
        setEditedTitle("");
        setEditedDescription("");
        setCurrentStep(0);
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
        } catch (err) {
            console.error("Failed to save ad:", err);
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

            // Store base64 images for saving later
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

            setResult(data);

            // Save to IndexedDB immediately for unauthenticated users
            // so the ad survives even if they close SoftWall and sign in via topbar
            if (status === "unauthenticated" && data.isValid) {
                await savePendingAd({
                    title: data.title || "",
                    description: data.description || "",
                    priceMin: data.price?.min,
                    priceMax: data.price?.max,
                    priceReasoning: data.price?.reason,
                    images: (data.images || []).map((img: { quality: string; suggestions: string }, index: number) => ({
                        url: `data:${imagesForRequest[index]?.mimeType || "image/jpeg"};base64,${imagesForRequest[index]?.base64 || ""}`,
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
                    timestamp: Date.now(),
                });
            }
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
    }, [images, platform, productName, condition, price, delivery, notes, selectedTone, priceType, session?.user?.id]);

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

    // Step navigation
    const handleNext = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, 2));
    }, []);

    const canGoNext = useMemo(() => {
        if (currentStep === 0) return images.length > 0;
        if (currentStep === 1) return true;
        return false;
    }, [currentStep, images.length]);

    // Summary data for step 3
    const summaryItems = useMemo(() => {
        const items: Array<{ icon: React.ReactNode; text: string }> = [];
        items.push({
            icon: <Camera className="h-3.5 w-3.5" aria-hidden="true" />,
            text: `${images.length} ${images.length === 1 ? "zdjęcie" : images.length < 5 ? "zdjęcia" : "zdjęć"}`,
        });
        items.push({
            icon: <Package className="h-3.5 w-3.5" aria-hidden="true" />,
            text: PLATFORM_NAMES[platform],
        });
        items.push({
            icon: <Truck className="h-3.5 w-3.5" aria-hidden="true" />,
            text: delivery.map((d) => DELIVERY_NAMES[d]).join(", "),
        });
        items.push({
            icon: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
            text: TONE_STYLE_NAMES[selectedTone],
        });
        items.push({
            icon: <Package className="h-3.5 w-3.5" aria-hidden="true" />,
            text: CONDITION_SHORT[condition],
        });
        if (priceType === "free") {
            items.push({
                icon: <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />,
                text: "Za darmo",
            });
        } else if (priceType === "user_provided" && price) {
            items.push({
                icon: <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />,
                text: `${price} PLN`,
            });
        } else {
            items.push({
                icon: <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />,
                text: "AI zasugeruje cenę",
            });
        }
        return items;
    }, [images.length, platform, delivery, priceType, price, selectedTone, condition]);

    const maxImages = status === "authenticated"
        ? (IMAGE_LIMITS[session?.user?.plan ?? "FREE"] ?? 3)
        : GUEST_MAX_IMAGES;

    // Loading state
    if (isLoading) {
        return (
            <FullscreenLoading
                isLoading={isLoading}
                imageCount={images.length}
                platform={platform}
            />
        );
    }

    // Result state — hide form and show result
    if (result) {
        return (
            <>
                {/* Offline Indicator */}
                {isOffline && (
                    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium" role="alert" aria-live="assertive">
                        Brak połączenia z internetem
                    </div>
                )}

                <section ref={resultSectionRef} aria-labelledby="result-heading" className="space-y-6 animate-fade-in">
                    {/* Top bar: back + actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h2 id="result-heading" className="font-sans text-2xl font-bold tracking-tight">
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
                                    <Button size="sm" variant="ghost" onClick={handleReset}>
                                        <RotateCcw className="h-4 w-4 mr-1" />
                                        Nowe
                                    </Button>
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
                            publishPrice={null}
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

                    {/* CTA for unauthenticated users — visible under the result without opening SoftWall */}
                    {status === "unauthenticated" && result?.isValid && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <div>
                                <p className="font-medium text-foreground">Podoba Ci się? Zapisz to ogłoszenie.</p>
                                <p className="text-sm text-muted-foreground">Darmowe konto — 5 ogłoszeń miesięcznie, bez karty.</p>
                            </div>
                            <Button
                                onClick={() => router.push("/auth/signin?callbackUrl=/dashboard")}
                                className="shrink-0"
                            >
                                Zarejestruj się i zapisz
                            </Button>
                        </div>
                    )}
                </section>

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

    // 3-step wizard form
    return (
        <>
            {/* Offline Indicator */}
            {isOffline && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium" role="alert" aria-live="assertive">
                    Brak połączenia z internetem
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
                    {/* Step Content */}
                    <div className="p-5 sm:p-6">
                        {/* Progress */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                {(["Zdjęcia", "Platforma", "Generuj"] as const).map((label, i) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => i < currentStep && setCurrentStep(i)}
                                        className={cn(
                                            "text-xs font-medium transition-colors",
                                            i <= currentStep ? "text-primary cursor-pointer" : "text-muted-foreground cursor-default"
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <Progress value={((currentStep + 1) / 3) * 100} className="h-1" />
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive" role="alert" aria-live="assertive" className="mb-5">
                                <div className="flex items-start justify-between w-full gap-4">
                                    <AlertDescription className="flex-1">{error}</AlertDescription>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setError(null)}
                                        className="shrink-0"
                                        aria-label="Zamknij komunikat o błędzie"
                                    >
                                        <X className="h-4 w-4" aria-hidden="true" />
                                    </Button>
                                </div>
                            </Alert>
                        )}

                        {/* Animated step content */}
                        <div className="min-h-[320px]">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Zdjęcia */}
                                {currentStep === 0 && (
                                    <motion.div
                                        key="step-0"
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label htmlFor="landing-productName" className="text-sm font-medium leading-none">
                                                Nazwa produktu <span className="text-muted-foreground text-xs">(opcjonalne)</span>
                                            </label>
                                            <Input
                                                id="landing-productName"
                                                name="productName"
                                                value={productName}
                                                onChange={(e) => setProductName(e.target.value)}
                                                placeholder="np. iPhone 13 Pro, Krzesło IKEA…"
                                                maxLength={200}
                                                autoComplete="off"
                                                aria-describedby="landing-productName-hint"
                                            />
                                            <p id="landing-productName-hint" className="text-xs text-muted-foreground">
                                                Jeśli nie podasz nazwy, AI rozpozna produkt ze zdjęcia
                                            </p>
                                        </div>

                                        <UploadDropzone
                                            images={images}
                                            onImagesChange={setImages}
                                            maxImages={maxImages}
                                        />
                                    </motion.div>
                                )}

                                {/* Step 2: Platforma */}
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step-1"
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {/* Platform tiles */}
                                        <fieldset className="space-y-3">
                                            <legend className="text-sm font-medium leading-none">
                                                Platforma sprzedażowa
                                            </legend>
                                            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Wybór platformy sprzedażowej">
                                                {/* Unlocked platforms */}
                                                {(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"] as Platform[]).map((p) => {
                                                    const { Icon, color } = PLATFORM_ICONS[p];
                                                    const isSelected = platform === p;
                                                    return (
                                                        <button
                                                            key={p}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={isSelected}
                                                            onClick={() => handlePlatformChange(p)}
                                                            className={cn(
                                                                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                                isSelected
                                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                                    : "border-border hover:border-primary/30"
                                                            )}
                                                        >
                                                            <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : color)} aria-hidden="true" />
                                                            <span className="font-medium text-sm">{PLATFORM_NAMES[p]}</span>
                                                        </button>
                                                    );
                                                })}
                                                {/* Locked platforms — eBay, Amazon, Etsy (RESELER only) */}
                                                {LOCKED_PLATFORMS.map((p) => {
                                                    const isLocked = userPlan !== "RESELER";
                                                    const { Icon, color } = PLATFORM_ICONS[p];
                                                    if (isLocked) {
                                                        return (
                                                            <div key={p} className="relative">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleLockedPlatformClick(p)}
                                                                    className={cn(
                                                                        "flex items-center gap-3 p-4 rounded-xl border-2 text-left w-full",
                                                                        "opacity-50 cursor-not-allowed",
                                                                        "border-violet-100 bg-violet-50"
                                                                    )}
                                                                    aria-disabled="true"
                                                                >
                                                                    <Crown className="h-4 w-4 text-violet-300 flex-shrink-0" aria-hidden="true" />
                                                                    <Icon className={cn("h-5 w-5", color)} aria-hidden="true" />
                                                                    <span className="font-medium text-sm text-violet-300">{PLATFORM_NAMES[p]}</span>
                                                                </button>
                                                                {tooltipPlatform === p && (
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs whitespace-nowrap z-10 pointer-events-none">
                                                                        Dostępne w planie Reseler
                                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    // RESELER: fully accessible
                                                    const isSelected = platform === p;
                                                    return (
                                                        <button
                                                            key={p}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={isSelected}
                                                            onClick={() => handlePlatformChange(p)}
                                                            className={cn(
                                                                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                                isSelected
                                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                                    : "border-border hover:border-primary/30"
                                                            )}
                                                        >
                                                            <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : color)} aria-hidden="true" />
                                                            <span className="font-medium text-sm">{PLATFORM_NAMES[p]}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>

                                        {/* Tone selector */}
                                        <fieldset className="space-y-3">
                                            <legend className="text-sm font-medium leading-none">
                                                Styl komunikacji
                                            </legend>
                                            <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Wybór stylu komunikacji">
                                                {FREE_TONES.map((tone) => {
                                                    const isSelected = selectedTone === tone;
                                                    return (
                                                        <button
                                                            key={tone}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={isSelected}
                                                            onClick={() => setSelectedTone(tone)}
                                                            className={cn(
                                                                "px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all duration-200",
                                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                                isSelected
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-border text-muted-foreground hover:border-primary/50"
                                                            )}
                                                        >
                                                            {TONE_STYLE_NAMES[tone]}
                                                        </button>
                                                    );
                                                })}
                                                {ADVANCED_TONES.map((tone) => {
                                                    const isLocked = userPlan === "FREE";
                                                    const isSelected = selectedTone === tone;
                                                    if (isLocked) {
                                                        return (
                                                            <div key={tone} className="relative">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleLockedToneClick(tone)}
                                                                    className={cn(
                                                                        "px-4 py-1.5 rounded-full border text-sm transition-all duration-200",
                                                                        "flex items-center gap-1.5 cursor-not-allowed",
                                                                        "border-violet-100 bg-violet-50 text-violet-300"
                                                                    )}
                                                                    aria-disabled="true"
                                                                >
                                                                    <Sparkles className="h-3 w-3" />
                                                                    {TONE_STYLE_NAMES[tone]}
                                                                </button>
                                                                {tooltipTone === tone && (
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs whitespace-nowrap z-10 pointer-events-none">
                                                                        Dostępne w planach Starter i Reseler
                                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    return (
                                                        <button
                                                            key={tone}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={isSelected}
                                                            onClick={() => setSelectedTone(tone)}
                                                            className={cn(
                                                                "px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all duration-200",
                                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                                isSelected
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-border text-muted-foreground hover:border-primary/50"
                                                            )}
                                                        >
                                                            {TONE_STYLE_NAMES[tone]}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>

                                        {/* Condition chips */}
                                        <fieldset className="space-y-3">
                                            <legend className="text-sm font-medium leading-none">
                                                Stan produktu
                                            </legend>
                                            <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Wybór stanu produktu">
                                                {CONDITIONS.map((conditionValue) => {
                                                    const isSelected = condition === conditionValue;
                                                    return (
                                                        <button
                                                            key={conditionValue}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={isSelected}
                                                            onClick={() => setCondition(conditionValue)}
                                                            className={cn(
                                                                "px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all duration-200",
                                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                                isSelected
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-border text-muted-foreground hover:border-primary/50"
                                                            )}
                                                        >
                                                            {CONDITION_SHORT[conditionValue]}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </fieldset>

                                        {/* Price field */}
                                        <div className="space-y-3">
                                            <label htmlFor="landing-price" className="text-sm font-medium leading-none block">
                                                Cena <span className="text-muted-foreground text-xs">(opcjonalne — AI zasugeruje cenę, jeśli nie podasz)</span>
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-1">
                                                    <Input
                                                        id="landing-price"
                                                        name="price"
                                                        type="text"
                                                        inputMode="decimal"
                                                        value={price}
                                                        onChange={(e) => handlePriceChange(e.target.value)}
                                                        placeholder="0"
                                                        disabled={isFreeChecked}
                                                        className="pr-12 h-10 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        aria-label="Cena produktu"
                                                        autoComplete="off"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" aria-label="Waluta">
                                                        PLN
                                                    </span>
                                                </div>
                                                <label className="flex items-center gap-2 cursor-pointer group shrink-0 ml-auto">
                                                    <input
                                                        type="checkbox"
                                                        checked={isFreeChecked}
                                                        onChange={(e) => handleFreeCheckbox(e.target.checked)}
                                                        className="h-4 w-4 rounded border-input accent-primary focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        aria-label="Za darmo"
                                                    />
                                                    <span className="text-sm text-muted-foreground group-hover:text-foreground">
                                                        Za darmo
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Generuj */}
                                {currentStep === 2 && (
                                    <motion.div
                                        key="step-2"
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {/* Delivery checkboxes */}
                                        <fieldset className="space-y-3">
                                            <legend className="text-sm font-medium leading-none">
                                                Sposób dostawy
                                            </legend>
                                            <div className="flex flex-wrap gap-4" role="group" aria-label="Wybór sposobu dostawy">
                                                {(Object.entries(DELIVERY_NAMES) as [DeliveryOption, string][]).map(([value, label]) => (
                                                    <label key={value} className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="checkbox"
                                                            checked={delivery.includes(value)}
                                                            onChange={() => handleDeliveryToggle(value)}
                                                            className="h-4 w-4 rounded border-input accent-primary focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                            aria-label={label}
                                                        />
                                                        <span className="text-sm group-hover:text-foreground">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {delivery.length === 0 && (
                                                <p className="text-xs text-destructive" role="alert" aria-live="polite">
                                                    Wybierz przynajmniej jedną opcję
                                                </p>
                                            )}
                                        </fieldset>

                                        {/* Notes textarea */}
                                        <div className="space-y-2">
                                            <label htmlFor="landing-notes" className="text-sm font-medium leading-none">
                                                Dodatkowe informacje <span className="text-muted-foreground text-xs">(opcjonalne)</span>
                                            </label>
                                            <Textarea
                                                id="landing-notes"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="np. uszkodzenia, braki, wymiary, historia produktu…"
                                                rows={4}
                                                maxLength={1000}
                                                aria-describedby="landing-notes-hint"
                                                className="min-h-[100px] resize-none"
                                            />
                                            <p id="landing-notes-hint" className="text-xs text-muted-foreground">
                                                {notes.length}/1000 znaków
                                            </p>
                                        </div>

                                        {/* Summary card */}
                                        <div className="border border-border rounded-lg bg-muted/50 p-4">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                                Podsumowanie
                                            </p>
                                            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                                {summaryItems.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 text-sm text-foreground">
                                                        <span className="text-muted-foreground">{item.icon}</span>
                                                        {item.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Generate button */}
                                        <Button
                                            type="button"
                                            variant="gradient"
                                            size="lg"
                                            className="w-full h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                                            onClick={handleSubmit}
                                            disabled={!canSubmit || isOffline || !hasUserCredits}
                                            aria-label="Generuj ogłoszenie sprzedażowe"
                                            title={isOffline ? "Brak połączenia z internetem" : !hasUserCredits ? "Brak kredytów" : undefined}
                                        >
                                            <Sparkles className="h-5 w-5 mr-2" aria-hidden="true" />
                                            {isOffline ? "Brak połączenia" : "Generuj ogłoszenie"}
                                        </Button>

                                        {!hasUserCredits && (
                                            <div className="text-center text-sm text-muted-foreground">
                                                <p className="mb-1">Wykorzystałeś wszystkie kredyty w tym miesiącu.</p>
                                                <a
                                                    href="/pricing"
                                                    className="text-primary font-medium hover:underline"
                                                >
                                                    Zmień plan lub dokup kredyty →
                                                </a>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex justify-between mt-6 pt-4 border-t border-border px-5 sm:px-6 pb-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentStep((s) => s - 1)}
                            disabled={currentStep === 0}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                            Wstecz
                        </Button>
                        {currentStep < 2 && (
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleNext}
                                disabled={!canGoNext}
                            >
                                Dalej
                                <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Soft-wall modal for rate-limited guests */}
            {showSoftWall && status === "unauthenticated" && !result && (
                <SoftWallModal
                    mode="limit"
                    isVisible={showSoftWall}
                    onClose={() => setShowSoftWall(false)}
                />
            )}
        </>
    );
}
