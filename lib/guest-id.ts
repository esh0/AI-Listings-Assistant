"use client";

const GUEST_ID_KEY = "marketplace_guest_id";

function generateUUID(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    // Fallback dla starszych przeglądarek (Android WebView, Safari < 15.4)
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Get or create a stable guest UUID for rate limiting.
 * Stored in localStorage. Not personal data (RODO-safe).
 */
export function getGuestId(): string {
    if (typeof window === "undefined") return "";

    let guestId = localStorage.getItem(GUEST_ID_KEY);
    if (!guestId) {
        guestId = `guest_${generateUUID()}`;
        localStorage.setItem(GUEST_ID_KEY, guestId);
    }
    return guestId;
}
