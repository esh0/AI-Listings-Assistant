"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPendingAd, clearPendingAd } from "@/lib/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export function PendingAdHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { update: updateSession } = useSession();
    const sessionRefreshed = useRef(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    // Refresh session after Stripe boost/subscription purchase
    useEffect(() => {
        if (sessionRefreshed.current) return;
        const boost = searchParams.get("boost");
        const upgrade = searchParams.get("upgrade");
        if (boost === "success" || upgrade === "success") {
            sessionRefreshed.current = true;
            // Stripe webhook usually processes in 1-3 seconds.
            // Call updateSession at 1.5s, 3s, 6s to catch it regardless of timing.
            // Sidebar reads from useSession() and will auto-update on each refresh.
            // updateSession({}) sends POST (triggers jwt trigger:"update" → DB read)
            // updateSession() without args sends GET (reads JWT cookie only, no DB)
            [1500, 3000, 6000].forEach(delay => {
                setTimeout(() => updateSession({}), delay);
            });
            // Clean up URL after first attempt
            setTimeout(() => router.replace("/dashboard"), 1500);
        }
    }, [searchParams, updateSession, router]);

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
            ? "mb-6 bg-destructive/10 border-destructive/50"
            : "mb-6 bg-success/10 border-success/50"
        }>
            {isError ? (
                <XCircle className="h-4 w-4 text-destructive" />
            ) : (
                <CheckCircle className="h-4 w-4 text-success" />
            )}
            <AlertDescription className={isError
                ? "text-destructive"
                : "text-success"
            }>
                {message}
            </AlertDescription>
        </Alert>
    );
}
