"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, LogIn, X } from "lucide-react";
import { savePendingAd, type PendingAd } from "@/lib/storage";
import { useRouter } from "next/navigation";

interface SoftWallModalProps {
    adData: {
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
    isVisible: boolean;
    onClose: () => void;
}

export function SoftWallModal({ adData, isVisible, onClose }: SoftWallModalProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

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
            // Save ad to IndexedDB before redirecting to sign in
            const pendingAd: PendingAd = {
                ...adData,
                timestamp: Date.now(),
            };

            console.log("[SoftWallModal] Saving pending ad to IndexedDB:", pendingAd);
            await savePendingAd(pendingAd);
            console.log("[SoftWallModal] Successfully saved to IndexedDB");

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
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-full">
                        <Save className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                        Zapisz swoje ogłoszenie
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Zaloguj się, aby zapisać to ogłoszenie w swoim panelu. Będziesz mógł je
                        edytować, śledzić status i zarządzać wszystkimi ogłoszeniami w jednym
                        miejscu.
                    </p>
                </div>

                {/* Benefits */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Zarządzaj wszystkimi ogłoszeniami w jednym miejscu</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Edytuj i aktualizuj ogłoszenia w dowolnym momencie</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Śledź status: wersje robocze, opublikowane, sprzedane</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Zapisuj szablony dla często używanych ustawień</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleSignIn}
                        disabled={isSaving}
                        className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                    >
                        <LogIn className="h-5 w-5 mr-2" />
                        {isSaving ? "Zapisywanie…" : "Zaloguj się i zapisz"}
                    </Button>
                    <Button
                        onClick={handleContinue}
                        variant="outline"
                        className="w-full h-12"
                    >
                        Kontynuuj bez zapisywania
                    </Button>
                </div>

                {/* Privacy note */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
                    Logowanie przez Google. Nie wysyłamy spamu i nie udostępniamy Twoich danych.
                </p>
            </Card>
        </div>
    );
}
