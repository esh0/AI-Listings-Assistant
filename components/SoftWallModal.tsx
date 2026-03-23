"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, LogIn, X } from "lucide-react";
import { savePendingAd, type PendingAd } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

interface SoftWallModalProps {
    adData?: {
        title: string;
        description: string;
        priceMin?: number;
        priceMax?: number;
        priceReasoning?: string;
        images: Array<{
            url: string;
            quality: string;
            suggestions: string;
        }>;
        parameters: {
            platform: string;
            tone: string;
            condition: string;
            delivery: string[];
            productName?: string;
            notes?: string;
            priceType: string;
            userPrice?: number;
        };
    };
    mode?: "save" | "limit";
    isVisible: boolean;
    onClose: () => void;
}

export function SoftWallModal({ adData, mode = "save", isVisible, onClose }: SoftWallModalProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    const isLimitMode = mode === "limit";

    // Track softwall_shown event — fires once per open, resets on close
    const hasFiredShownRef = useRef(false);
    useEffect(() => {
        if (isVisible && !hasFiredShownRef.current) {
            hasFiredShownRef.current = true;
            trackEvent("softwall_shown", { mode });
        }
        if (!isVisible) {
            hasFiredShownRef.current = false;
        }
    }, [isVisible, mode]);

    // Auto-hide if user is already logged in
    useEffect(() => {
        if (status === "authenticated") {
            onClose();
        }
    }, [status, onClose]);

    // Focus trap + Escape key + body scroll lock
    useEffect(() => {
        if (!isVisible || status === "authenticated") return;

        // Store previously focused element for restoration
        previouslyFocusedRef.current = document.activeElement as HTMLElement;

        // Lock body scroll
        document.body.style.overflow = "hidden";

        // Focus the modal
        const timer = setTimeout(() => {
            modalRef.current?.focus();
        }, 0);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }

            // Focus trap
            if (e.key === "Tab" && modalRef.current) {
                const focusable = modalRef.current.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
            // Restore focus
            previouslyFocusedRef.current?.focus();
        };
    }, [isVisible, status, onClose]);

    if (!isVisible || status === "authenticated") {
        return null;
    }

    const handleSignIn = async () => {
        trackEvent("softwall_signin_clicked", { mode });
        setIsSaving(true);

        try {
            // Save ad to IndexedDB before redirecting (only in save mode with data)
            if (!isLimitMode && adData) {
                const pendingAd: PendingAd = {
                    ...adData,
                    timestamp: Date.now(),
                };
                await savePendingAd(pendingAd);
            }

            // Redirect to sign in with callback to dashboard
            router.push("/auth/signin?callbackUrl=/dashboard");
        } catch (error) {
            console.error("[SoftWallModal] Failed to save pending ad:", error);
            toast.error("Nie udało się zapisać ogłoszenia. Spróbuj ponownie.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleContinue = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" aria-hidden="true">
            <Card
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="softwall-title"
                tabIndex={-1}
                className="relative max-w-lg w-full p-5 sm:p-8 outline-none"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                    aria-label="Zamknij"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-4 rounded-full bg-primary/10">
                        <Save className="h-8 w-8 text-primary" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-5 sm:mb-8">
                    <h2 id="softwall-title" className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                        {isLimitMode
                            ? "Darmowy limit wyczerpany"
                            : "Zapisz swoje ogłoszenie"
                        }
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {isLimitMode
                            ? "Zarejestruj się za darmo i otrzymaj 5 generacji miesięcznie. To zajmie tylko chwilę!"
                            : "Zaloguj się, aby zapisać to ogłoszenie w swoim panelu. Będziesz mógł je edytować, śledzić status i zarządzać wszystkimi ogłoszeniami w jednym miejscu."
                        }
                    </p>
                </div>

                {/* Benefits */}
                <div className="bg-muted rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <ul className="space-y-2 text-sm text-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-success mt-0.5">✓</span>
                            <span>Zarządzaj wszystkimi ogłoszeniami w jednym miejscu</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-success mt-0.5">✓</span>
                            <span>Edytuj i aktualizuj ogłoszenia w dowolnym momencie</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-success mt-0.5">✓</span>
                            <span>Śledź status: wersje robocze, opublikowane, sprzedane</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleSignIn}
                        disabled={isSaving}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                        <LogIn className="h-5 w-5 mr-2" />
                        {isSaving
                            ? "Zapisywanie…"
                            : isLimitMode
                                ? "Zarejestruj się za darmo"
                                : "Zaloguj się i zapisz"
                        }
                    </Button>
                    {!isLimitMode && (
                    <Button
                        onClick={handleContinue}
                        variant="outline"
                        className="w-full h-12"
                    >
                        Kontynuuj bez zapisywania
                    </Button>
                    )}
                </div>

                {/* Privacy note */}
                <p className="text-xs text-muted-foreground text-center mt-4 sm:mt-6">
                    Logowanie przez Google. Nie wysyłamy spamu i nie udostępniamy Twoich danych.
                </p>
            </Card>
        </div>
    );
}
