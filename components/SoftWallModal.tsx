"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, LogIn, X } from "lucide-react";
import { savePendingAd, type PendingAd } from "@/lib/storage";
import { useRouter } from "next/navigation";

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

    const isLimitMode = mode === "limit";

    // Auto-hide if user is already logged in
    useEffect(() => {
        if (status === "authenticated") {
            onClose();
        }
    }, [status, onClose]);

    if (!isVisible || status === "authenticated") {
        return null;
    }

    const handleSignIn = async () => {
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
            alert("Nie udało się zapisać ogłoszenia. Spróbuj ponownie.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleContinue = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <Card className="relative max-w-lg w-full p-8">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-primary/10">
                        <Save className="h-8 w-8 text-primary" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-3">
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
                <div className="bg-muted rounded-lg p-4 mb-6">
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
                <p className="text-xs text-muted-foreground text-center mt-6">
                    Logowanie przez Google. Nie wysyłamy spamu i nie udostępniamy Twoich danych.
                </p>
            </Card>
        </div>
    );
}
