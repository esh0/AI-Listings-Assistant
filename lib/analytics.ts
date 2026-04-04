// lib/analytics.ts
// Central GA4 analytics module — all tracking goes through here.
// Never call gtag() directly outside this file.

const GA_ID = "G-NER153CSFW";
const AW_ID = "AW-18063893093"; // Google Ads conversion tracking
const CONSENT_KEY = "cookie_analytics_consent"; // "accepted" | "rejected"
const LEGACY_KEY = "cookie_notice_accepted"; // old banner key — cleaned up on first run

/** Returns true only if the user has explicitly accepted analytics cookies. */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}

/** Returns true if the user has made any choice (accept or reject). */
export function hasConsentDecision(): boolean {
  if (typeof window === "undefined") return false;
  const val = localStorage.getItem(CONSENT_KEY);
  return val === "accepted" || val === "rejected";
}

/**
 * Persist the user's choice, clean up the legacy key, and initialise GA4 if accepted.
 * Called by CookieBanner when the user clicks Accept or Reject.
 */
export function setAnalyticsConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "rejected");
  localStorage.removeItem(LEGACY_KEY); // clean up old banner key
  if (accepted) initGA4();
}

/**
 * Inject the GA4 script tag into <head> and initialise tracking.
 * Safe to call multiple times — skips if already initialised.
 */
export function initGA4(): void {
  if (typeof window === "undefined") return;
  if (document.getElementById("ga4-script")) return; // already loaded
  if (window.gtag) return; // already initialised

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // Must use `arguments` (not rest params) so gtag receives the IArguments object
  // eslint-disable-next-line prefer-rest-params
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag as unknown as typeof window.gtag;
  (gtag as any)("js", new Date());
  (gtag as any)("config", GA_ID);
  (gtag as any)("config", AW_ID);
}

/**
 * Send a custom event to GA4.
 * No-op if the user has not accepted analytics cookies.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}

/**
 * Send a GA4 event from server-side code (e.g. Stripe webhook handler).
 * Uses GA4 Measurement Protocol — requires GA4_API_SECRET env var.
 * No-op if the secret is not configured (safe for local dev).
 */
export async function sendServerEvent(
  clientId: string,
  eventName: string,
  params?: Record<string, unknown>
): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? GA_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  if (!apiSecret) return; // not configured — skip silently

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          events: [{ name: eventName, params: params ?? {} }],
        }),
      }
    );
  } catch {
    // Fire-and-forget — never let analytics errors bubble up to callers
  }
}

// Extend Window to avoid TS errors
declare global {
  interface Window {
    dataLayer: unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: ((...args: any[]) => void);
  }
}
