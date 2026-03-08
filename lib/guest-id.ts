"use client";

const GUEST_ID_KEY = "marketplace_guest_id";

/**
 * Get or create a stable guest UUID for rate limiting.
 * Stored in localStorage. Not personal data (RODO-safe).
 */
export function getGuestId(): string {
    if (typeof window === "undefined") return "";

    let guestId = localStorage.getItem(GUEST_ID_KEY);
    if (!guestId) {
        guestId = `guest_${crypto.randomUUID()}`;
        localStorage.setItem(GUEST_ID_KEY, guestId);
    }
    return guestId;
}
