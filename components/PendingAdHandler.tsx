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
    const { data: session, update: updateSession } = useSession();
    const sessionRefreshed = useRef(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    // Refresh session after Stripe boost/subscription purchase.
    // Strategy: poll /api/user/credits until DB values differ from current session,
    // then call updateSession({}) to sync JWT. This handles variable webhook delays.
    useEffect(() => {
        if (sessionRefreshed.current) return;
        const boost = searchParams.get("boost");
        const upgrade = searchParams.get("upgrade");
        if (boost !== "success" && upgrade !== "success") return;

        sessionRefreshed.current = true;
        router.replace("/dashboard");

        console.log("[PendingAdHandler] Stripe redirect detected. Session at start:", {
            boostCredits: session?.user?.boostCredits,
            creditsAvailable: session?.user?.creditsAvailable,
            plan: session?.user?.plan,
            sessionStatus: session ? "loaded" : "null",
        });

        const prevBoost = session?.user?.boostCredits ?? 0;
        const prevCredits = session?.user?.creditsAvailable ?? 0;
        const prevPlan = session?.user?.plan ?? "FREE";

        let attempts = 0;
        const MAX_ATTEMPTS = 10; // 10 * 2s = 20s max wait

        const poll = async () => {
            attempts++;
            try {
                const res = await fetch("/api/user/credits");
                if (res.ok) {
                    const data = await res.json();
                    console.log(`[PendingAdHandler] Poll #${attempts} DB:`, data, "prev:", { prevBoost, prevCredits, prevPlan });
                    const changed =
                        data.boostCredits !== prevBoost ||
                        data.creditsAvailable !== prevCredits ||
                        data.plan !== prevPlan;

                    if (changed) {
                        console.log("[PendingAdHandler] DB changed, reloading page to sync session...");
                        window.location.href = "/dashboard";
                        return;
                    }
                }
            } catch (e) {
                console.error("[PendingAdHandler] Poll error:", e);
            }

            if (attempts < MAX_ATTEMPTS) {
                setTimeout(poll, 2000);
            } else {
                console.warn("[PendingAdHandler] Max attempts reached, giving up.");
            }
        };

        // First attempt after 1s (webhook usually arrives in 1-3s)
        setTimeout(poll, 1000);
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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

            await response.json();

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
