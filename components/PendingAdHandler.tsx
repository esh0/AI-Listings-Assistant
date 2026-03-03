"use client";

import { useEffect, useState } from "react";
import { getPendingAd, clearPendingAd } from "@/lib/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

// Helper to convert blob URL to base64
async function blobUrlToBase64(blobUrl: string): Promise<string> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function PendingAdHandler() {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        handlePendingAd();
    }, []);

    const handlePendingAd = async () => {
        try {
            const pendingAd = await getPendingAd();
            console.log("[PendingAdHandler] Pending ad from IndexedDB:", pendingAd);

            if (!pendingAd) {
                console.log("[PendingAdHandler] No pending ad found");
                return; // No pending ad
            }

            console.log("[PendingAdHandler] Converting blob URLs to base64...");

            // Convert blob URLs to base64
            const imagesWithBase64 = await Promise.all(
                pendingAd.images.map(async (img: any) => {
                    if (img.url.startsWith("blob:")) {
                        try {
                            const base64 = await blobUrlToBase64(img.url);
                            return { ...img, url: base64 };
                        } catch (error) {
                            console.error("[PendingAdHandler] Failed to convert blob:", error);
                            return img; // Keep original if conversion fails
                        }
                    }
                    return img;
                })
            );

            console.log("[PendingAdHandler] Saving pending ad to database...");

            // Save pending ad to database via API
            const response = await fetch("/api/ads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    platform: pendingAd.parameters.platform,
                    title: pendingAd.title,
                    description: pendingAd.description,
                    status: "DRAFT",
                    priceMin: pendingAd.priceMin,
                    priceMax: pendingAd.priceMax,
                    images: imagesWithBase64, // Now with base64 instead of blob URLs
                    parameters: pendingAd.parameters,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("[PendingAdHandler] API error:", response.status, error);
                throw new Error("Failed to save ad");
            }

            const savedAd = await response.json();
            console.log("[PendingAdHandler] Ad saved successfully:", savedAd);

            // Clear from IndexedDB after successful save
            await clearPendingAd();
            console.log("[PendingAdHandler] Cleared from IndexedDB");

            // Show success message
            setMessage("Ogłoszenie zostało zapisane w Twoim panelu!");

            // Hide message after 5 seconds
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        } catch (error) {
            console.error("[PendingAdHandler] Failed to handle pending ad:", error);
            // Silently fail - don't interrupt user experience
        }
    };

    if (!message) {
        return null;
    }

    return (
        <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
                {message}
            </AlertDescription>
        </Alert>
    );
}
