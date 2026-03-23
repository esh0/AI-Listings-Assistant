# GDPR Cookie Consent & GA4 Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix GDPR/RODO violations — make GA4 consent-conditional, add a real Accept/Reject banner, and update the privacy policy to truthfully reflect all tracking.

**Architecture:** A `lib/analytics.ts` module exposes `trackEvent()` and consent helpers. `CookieBanner` is redesigned with Accept/Reject buttons; it calls `initGA4()` directly on accept and `initGA4()` again on page load when a previous session's consent is found. `app/layout.tsx` removes the unconditional GA4 `<script>` tags. The privacy policy page is updated in-place.

**Tech Stack:** Next.js 15 App Router, TypeScript, localStorage for consent persistence, `gtag` for GA4.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `lib/analytics.ts` | `trackEvent()` wrapper, `hasAnalyticsConsent()`, `hasConsentDecision()`, `setAnalyticsConsent()`, `initGA4()` |
| Modify | `components/CookieBanner.tsx` | Replace single "Rozumiem" with Accept / Reject binary choice; initialises GA4 on accept; re-inits on return visits |
| Modify | `app/layout.tsx` | Remove unconditional GA4 `<script>` tags |
| Modify | `app/polityka-prywatnosci/page.tsx` | Fix false statement, add GA4 disclosure, cookie table, `cookie_analytics_consent` localStorage key, processors table entry |

---

## Task 1: Create `lib/analytics.ts` — consent helpers and `trackEvent()`

**Files:**
- Create: `lib/analytics.ts`

This module is the single place all GA4 interactions go through. It guards every call behind a consent check so no event ever fires without the user's permission.

- [ ] **Step 1: Create `lib/analytics.ts`**

```typescript
// lib/analytics.ts
// Central GA4 analytics module — all tracking goes through here.
// Never call gtag() directly outside this file.

const GA_ID = "G-NER153CSFW";
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

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // Must use `arguments` (not rest params) so gtag receives the IArguments object
  // eslint-disable-next-line prefer-rest-params
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
}

/**
 * Send a custom event to GA4.
 * No-op if the user has not accepted analytics cookies.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}

// Extend Window to avoid TS errors
declare global {
  interface Window {
    dataLayer: IArguments[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: ((...args: any[]) => void) | undefined;
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
cd "/Users/I543168/AI Based Projects/Marketplace Assistant"
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `analytics.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/analytics.ts
git commit -m "feat: add analytics.ts — consent-gated GA4 trackEvent helper"
```

---

## Task 2: Redesign `CookieBanner` with Accept / Reject

**Files:**
- Modify: `components/CookieBanner.tsx`

The banner must offer a genuine binary choice. "Rozumiem" was a notice, not consent. The new banner shows two equally prominent buttons. The X icon is removed — users must make an explicit choice. On page load for returning users, `initGA4()` is called if they previously accepted.

- [ ] **Step 1: Rewrite `components/CookieBanner.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  hasConsentDecision,
  hasAnalyticsConsent,
  setAnalyticsConsent,
  initGA4,
} from "@/lib/analytics";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsentDecision()) {
      // First visit — show the banner
      setVisible(true);
    } else if (hasAnalyticsConsent()) {
      // Returning visitor who already accepted — re-initialise GA4
      initGA4();
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setVisible(false);
  };

  const handleReject = () => {
    setAnalyticsConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Informacja o plikach cookie"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-border bg-card shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-sm text-muted-foreground min-w-0">
          Używamy plików cookie do analizy ruchu (Google Analytics), aby lepiej rozumieć, jak korzystasz z Serwisu i ulepszać nasz produkt.{" "}
          <Link
            href="/polityka-prywatnosci"
            className="underline text-foreground hover:text-primary transition-colors"
          >
            Polityka prywatności
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Tylko niezbędne
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/CookieBanner.tsx
git commit -m "fix: redesign CookieBanner with Accept/Reject — valid GDPR consent"
```

---

## Task 3: Remove unconditional GA4 from `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

The two `<script>` tags in `<head>` fire GA4 on every page load before any consent. They must be removed entirely. GA4 is now initialised by `CookieBanner` — on first visit (user accepts) and on return visits (existing consent detected).

- [ ] **Step 1: Remove GA4 script tags from `app/layout.tsx`**

Remove this block (lines 78–85):

```tsx
            {/* Google Analytics 4 */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-NER153CSFW" />
            <script dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-NER153CSFW');
            `}} />
```

The `<head>` block should now contain only font preconnects and theme-color meta tags.

- [ ] **Step 2: Verify build passes**

```bash
npm run build 2>&1 | tail -15
```

Expected: clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "fix: remove unconditional GA4 script from layout — consent required before loading"
```

---

## Task 4: Update Privacy Policy

**Files:**
- Modify: `app/polityka-prywatnosci/page.tsx`

Four targeted changes:
1. Replace the false "Serwis nie korzysta z Google Analytics" statement in section 7.3 with a full GA4 disclosure
2. Add `cookie_analytics_consent` localStorage key to section 7.2
3. Add Google LLC (Google Analytics 4) to the processors table in section 4
4. Update the "Ostatnia aktualizacja" date

- [ ] **Step 1: Replace section 7.3 content**

Find and replace this entire block:

```tsx
            <h3>7.3. Cookies analityczne i marketingowe</h3>
            <p>Serwis korzysta z <strong>Vercel Web Analytics</strong> — narzędzia analitycznego, które:</p>
            <ul>
                <li>Nie używa plików cookie ani localStorage</li>
                <li>Nie gromadzi danych osobowych ani adresów IP</li>
                <li>Mierzy wyłącznie anonimowe metryki (liczba odwiedzin, strony, kraj — na poziomie zagregowanym)</li>
                <li>Nie wymaga zgody użytkownika (nie jest narzędziem śledzącym w rozumieniu dyrektywy ePrivacy)</li>
            </ul>
            <p>Serwis <strong>nie korzysta</strong> z Google Analytics, Facebook Pixel ani żadnych innych zewnętrznych narzędzi śledzących.</p>
```

Replace with:

```tsx
            <h3>7.3. Cookies analityczne (wymagają zgody)</h3>
            <p>Serwis korzysta z <strong>Google Analytics 4</strong> (GA4) — narzędzia analitycznego Google LLC. GA4 ustawia pliki cookie wyłącznie po wyrażeniu przez Użytkownika zgody na cookies analityczne w banerze cookie.</p>
            <table>
                <thead>
                    <tr>
                        <th>Cookie</th>
                        <th>Cel</th>
                        <th>Czas</th>
                        <th>Dostawca</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><code>_ga</code></td><td>Unikalny identyfikator przeglądarki (pseudonimowy)</td><td>2 lata</td><td>Google LLC</td></tr>
                    <tr><td><code>_gid</code></td><td>Identyfikator sesji</td><td>24 godziny</td><td>Google LLC</td></tr>
                    <tr><td><code>_ga_NER153CSFW</code></td><td>Stan sesji GA4 dla tej właściwości</td><td>2 lata</td><td>Google LLC</td></tr>
                </tbody>
            </table>
            <p>Dane zbierane przez GA4 obejmują: pseudonimowy identyfikator klienta, odwiedzone strony, interakcje z formularzem i ścieżkę rejestracji. Dane przekazywane są na serwery Google w USA na podstawie Standardowych Klauzul Umownych (SCCs). Podstawa prawna: <strong>art. 6 ust. 1 lit. a RODO — zgoda</strong>.</p>
            <p>Możesz wycofać zgodę w dowolnym momencie, usuwając klucz <code>cookie_analytics_consent</code> z localStorage przeglądarki (DevTools → Application → Local Storage) oraz cookies <code>_ga</code>, <code>_gid</code>, <code>_ga_NER153CSFW</code> (DevTools → Application → Cookies). Możesz też skontaktować się z nami pod adresem <a href="mailto:privacy@marketplace-ai.pl">privacy@marketplace-ai.pl</a>.</p>

            <h3>7.4. Anonimowe statystyki odwiedzin (bez zgody)</h3>
            <p>Serwis korzysta z <strong>Vercel Web Analytics</strong> — narzędzia analitycznego, które:</p>
            <ul>
                <li>Nie używa plików cookie ani localStorage</li>
                <li>Nie gromadzi danych osobowych ani adresów IP</li>
                <li>Mierzy wyłącznie anonimowe metryki (liczba odwiedzin, strony, kraj — na poziomie zagregowanym)</li>
                <li>Nie wymaga zgody użytkownika (nie jest narzędziem śledzącym w rozumieniu dyrektywy ePrivacy)</li>
            </ul>
```

- [ ] **Step 2: Add `cookie_analytics_consent` to section 7.2 Local Storage table**

Find the closing `</tbody>` of the section 7.2 table (after the `pending_ad` row):

```tsx
                    <tr><td><code>pending_ad</code></td><td>IndexedDB</td><td>Tymczasowe ogłoszenie (soft-wall)</td><td>Do zalogowania lub ręcznego usunięcia</td></tr>
                </tbody>
```

Insert a new row before `</tbody>`:

```tsx
                    <tr><td><code>cookie_analytics_consent</code></td><td>Local Storage</td><td>Zapamiętanie wyboru plików cookie analitycznych (GA4)</td><td>Do ręcznego usunięcia</td></tr>
```

- [ ] **Step 3: Add Google Analytics row to processors table in section 4**

Find the Vercel Analytics row:

```tsx
                    <tr><td><strong>Vercel Analytics</strong></td><td>Anonimowe statystyki odwiedzin (brak danych osobowych)</td><td>EU/USA</td><td>Dane anonimowe, brak wymogu zgody</td></tr>
```

Insert a new row **before** it:

```tsx
                    <tr><td><strong>Google LLC</strong> (Google Analytics 4)</td><td>Analityka ruchu i zachowania użytkowników (za zgodą)</td><td>USA</td><td>Standardowe klauzule umowne (SCCs)</td></tr>
```

- [ ] **Step 4: Update section 9 — add Google Analytics to the transfers list**

Find:

```tsx
            <p>Niektórzy nasi dostawcy usług mają siedziby w USA (OpenAI, Google, Vercel).</p>
```

Replace with:

```tsx
            <p>Niektórzy nasi dostawcy usług mają siedziby w USA (OpenAI, Google OAuth, Google Analytics, Vercel, Resend, Sentry).</p>
```

- [ ] **Step 5: Update "Ostatnia aktualizacja" date**

Find:

```tsx
            <p><em>Ostatnia aktualizacja: 20 marca 2026 r.</em></p>
```

Replace with:

```tsx
            <p><em>Ostatnia aktualizacja: 23 marca 2026 r.</em></p>
```

- [ ] **Step 6: Verify build passes**

```bash
npm run build 2>&1 | tail -15
```

Expected: clean build.

- [ ] **Step 7: Commit**

```bash
git add app/polityka-prywatnosci/page.tsx
git commit -m "fix: update privacy policy — GA4 disclosure, processors table, localStorage key, remove false statement"
```

---

## Task 5: Final verification and merge

- [ ] **Step 1: Run full build**

```bash
npm run build 2>&1 | tail -20
```

Expected: clean build, `ƒ Middleware` line present, no TypeScript errors.

- [ ] **Step 2: Manual smoke-test checklist**

Start dev server (`npm run dev`) and verify:

1. Open `http://localhost:3000` in a fresh private/incognito window
2. Cookie banner appears with two buttons: "Tylko niezbędne" and "Akceptuję"
3. Open DevTools → Network. No `gtag` requests yet.
4. Click "Tylko niezbędne" → banner disappears. No GA4 script in Network tab.
5. Refresh page → banner does not reappear. Still no GA4 in Network.
6. Open new incognito window → click "Akceptuję" → `gtag/js?id=G-NER153CSFW` appears in Network tab.
7. Refresh → GA4 script loads again (persisted consent re-inits on mount).
8. Check DevTools → Application → Local Storage: `cookie_analytics_consent = "accepted"`. No `cookie_notice_accepted` key.
9. Visit `/polityka-prywatnosci`:
   - Section 7.3 says "Google Analytics 4" with cookie table
   - No "nie korzysta z Google Analytics" statement
   - Section 7.2 table includes `cookie_analytics_consent`
   - Section 4 processors table includes Google LLC (Google Analytics 4)

- [ ] **Step 3: Update CHANGELOG.md**

Add entry at top of file:

```markdown
## [1.3.4] - 2026-03-23

### Fixed
- GDPR/RODO: GA4 was loading unconditionally before user consent — moved to consent-conditional initialisation via `lib/analytics.ts`
- GDPR/RODO: Cookie banner redesigned with "Akceptuję" / "Tylko niezbędne" binary choice — previous "Rozumiem" button was not valid RODO consent
- GDPR/RODO: Migrated consent storage from legacy `cookie_notice_accepted` key to `cookie_analytics_consent` — existing users shown banner again to give explicit consent
- Privacy policy: removed false statement "Serwis nie korzysta z Google Analytics" — replaced with full GA4 disclosure including cookie table, retention periods, and legal basis
- Privacy policy: added `cookie_analytics_consent` localStorage key to section 7.2
- Privacy policy: added Google LLC (Google Analytics 4) to processors table (section 4) and data transfers list (section 9)

---
```

- [ ] **Step 4: Commit CHANGELOG**

```bash
git add CHANGELOG.md
git commit -m "chore: add CHANGELOG entry for v1.3.4 — GDPR cookie consent fix"
```

- [ ] **Step 5: Merge to master**

```bash
git checkout master
git merge develop --no-ff -m "chore: merge develop → master (v1.3.4) — GDPR consent fix"
git push origin master
git checkout develop
git push origin develop
```
