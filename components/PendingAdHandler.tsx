"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPendingAd, clearPendingAd } from "@/lib/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export function PendingAdHandler() {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        handlePendingAd();
    }, []);

    const handlePendingAd = async () => {
        try {
            const pendingAd = await getPendingAd();

            if (!pendingAd) {
                return; // No pending ad
            }

            // Save pending ad to database via API
            // Images are already base64 data URLs from AdGeneratorForm
            // fromSoftwall flag tells API to consume a credit (user bypassed initial credit check)
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
                    images: pendingAd.images, // Base64 data URLs, API will upload to Supabase
                    parameters: pendingAd.parameters,
                    fromSoftwall: true, // Flag to consume credit for existing users
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("[PendingAdHandler] API error:", response.status, error);

                // If credit error (403), show error to user and keep ad in IndexedDB
                if (response.status === 403) {
                    let errorMessage = "Brak dostępnych kredytów.";
                    try {
                        const errorJson = JSON.parse(error);
                        errorMessage = errorJson.error || errorMessage;
                    } catch {
                        // Use default message if JSON parse fails
                    }

                    setIsError(true);
                    setMessage(errorMessage);

                    // Hide message after 8 seconds (longer for error)
                    setTimeout(() => {
                        setMessage(null);
                        setIsError(false);
                    }, 8000);

                    return; // Don't clear IndexedDB, user can try again later
                }

                throw new Error("Failed to save ad");
            }

            const savedAd = await response.json();

            // Clear from IndexedDB after successful save
            await clearPendingAd();

            // Force full page reload to ensure credits are refreshed from server
            // router.refresh() only revalidates Server Components but keeps client state
            window.location.reload();

            // Note: Code below won't execute due to page reload, but kept for reference
            // Show success message
            setIsError(false);
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
        <Alert className={isError
            ? "mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
            : "mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
        }>
            {isError ? (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            ) : (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
            <AlertDescription className={isError
                ? "text-red-800 dark:text-red-200"
                : "text-green-800 dark:text-green-200"
            }>
                {message}
            </AlertDescription>
        </Alert>
    );
}
