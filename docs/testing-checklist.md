# Testing Checklist - Marketplace Assistant

## Prerequisites
- [ ] `.env.local` configured with all required variables (OpenAI, Supabase, Google OAuth, Stripe)
- [ ] Database migrated: `npx prisma db push`
- [ ] Supabase storage bucket `marketplace-ads` created (authenticated uploads via RLS)
- [ ] Google OAuth credentials configured with correct redirect URIs
- [ ] Stripe keys configured (use test mode keys for development)

---

## 1. Authentication Flow

### Sign In
- [ ] Visit home page (not logged in) — shows guest form with hero
- [ ] Click "Zaloguj się" in header — redirects to Google OAuth
- [ ] Complete Google sign-in — redirects to `/dashboard`
- [ ] Check database — User record created with plan=FREE, creditsAvailable=5
- [ ] Sidebar shows name, email, avatar, plan badge "FREE"

### Sign Out
- [ ] Click "Wyloguj się" in sidebar — redirects to home page
- [ ] Try accessing `/dashboard` — redirects to sign in

### Protected Routes
- [ ] Access `/dashboard` without login — redirects to sign in
- [ ] Access `/dashboard/ads` without login — redirects to sign in
- [ ] Access `/dashboard/new` without login — redirects to sign in

---

## 2. Credits System

### FREE Plan (5 credits/month)
- [ ] New user starts with creditsAvailable=5
- [ ] Sidebar shows "5/5" credits
- [ ] Generate ad — succeeds, creditsAvailable=4, sidebar updates
- [ ] Generate 4 more ads — all succeed, creditsAvailable=0
- [ ] Try generating when credits=0 — button is disabled, CTA "Zmień plan lub dokup kredyty" shown
- [ ] Sidebar shows "0/5"

### Boost Credits
- [ ] Purchase boost pack via Stripe (test mode)
- [ ] Sidebar shows boost credits as "+ N" in primary color
- [ ] Generate ad with 0 subscription credits — uses boost credits
- [ ] Boost credits decrement correctly

### Credits Reset
- [ ] Sidebar shows "Odnowienie X dni" countdown
- [ ] After Stripe `invoice.paid` webhook — creditsAvailable resets to plan limit

### Plan Labels & Limits
| Plan | Credits/mo | Images |
|------|-----------|--------|
| FREE | 5 | 3 |
| STARTER | 30 | 5 |
| RESELER | 80 | 8 |

---

## 3. Guest (Unauthenticated) Flow

### Ad Generation
- [ ] Visit home page — sees compact hero + AdGeneratorForm (no header)
- [ ] Upload up to 3 images (guest limit)
- [ ] Try uploading 4th image — rejected by UploadDropzone
- [ ] Fill form and generate ad — result displays
- [ ] **1.5 seconds after generation** — SoftWallModal "save" mode appears

### Rate Limiting
- [ ] Generate 3 ads with same UUID (localStorage) — 3rd succeeds
- [ ] Try 4th generation — SoftWallModal "limit" mode shown immediately (orange, no continue button)
- [ ] Clear localStorage, same IP — IP limit allows up to 5/24h total

### Soft-Wall Save Flow
- [ ] Click "Zaloguj się i zapisz" in modal
- [ ] Check browser DevTools > Application > IndexedDB — `marketplace-assistant:pending-ad` key exists with ad data
- [ ] Complete Google sign-in — redirects to `/dashboard`
- [ ] `PendingAdHandler` runs on mount — POSTs to `/api/ads` with `fromSoftwall: true`
- [ ] Page reloads automatically after save
- [ ] Check database — Ad saved with DRAFT status
- [ ] Dashboard recent ads list shows the saved ad
- [ ] IndexedDB cleared

### Soft-Wall Credit Error
- [ ] If user has 0 credits when pending ad saves — error alert shown in dashboard
- [ ] Ad remains in IndexedDB (not cleared)

---

## 4. Ad Generation & Save Flow

### Generation
- [ ] Navigate to `/dashboard/new`
- [ ] Upload images (up to plan limit)
- [ ] Select platform — tone auto-selects to platform default
- [ ] Override tone manually — stays overridden
- [ ] Select condition, price type, delivery options
- [ ] Add optional product name and notes
- [ ] Click "Generuj ogłoszenie" — FullscreenLoading shows
- [ ] Generation completes — result section animates in
- [ ] Session refreshed (credits updated in sidebar) — happens once, guarded by ref

### Result Actions
- [ ] **"Zapisz"** (green Check) — saves ad, redirects to `/dashboard/ads`
- [ ] **"Zapisz i stwórz następne"** (blue RotateCcw) — saves ad AND resets form in place (no redirect)
- [ ] "Zapisz i stwórz następne" is disabled when title or description is empty
- [ ] "Zapisz i stwórz następne" shows "Zapisywanie…" during save
- [ ] On generation error — "Popraw" (ArrowLeft, retry keeping form data) and "Nowe ogłoszenie" (Plus, full reset) appear

### Inline Editing
- [ ] Click Pencil icon on title — field becomes editable, auto-focused
- [ ] Icon changes to green Check; Copy button stays active
- [ ] Escape — exits edit mode
- [ ] Cmd/Ctrl+Enter — exits edit mode
- [ ] Empty title — red border + error, "Zapisz" disabled
- [ ] Character counter turns red at >90% of platform limit
- [ ] Platform limits enforced:
  - OLX: title 70, description 1500
  - Allegro Lokalnie: title 75, description 1500
  - FB Marketplace: title 60, description 1000
  - Vinted: title 100, description 750

---

## 5. Ad Management (`/dashboard/ads`)

### Filter Bar — Desktop (≥640px)
- [ ] Inline bar shows: Status dropdown, Platform dropdown, ad count, Sort dropdown
- [ ] "Zaznacz wszystkie" toggle below ad count (right-aligned)
- [ ] Dropdowns close on selection
- [ ] URL updates with filter params

### Filter Bar — Mobile (<640px)
- [ ] Shows "Sortuj i filtruj" button + ad count
- [ ] Active filter badge shows count of active filters
- [ ] Clicking button opens left-side drawer (slide-in animation, backdrop)
- [ ] Drawer has 3 sections: Status, Platform, Sorting
- [ ] Selecting option closes drawer
- [ ] FAB "Nowe ogłoszenie" hides behind open drawer

### Search
- [ ] Type in search box — results debounce 500ms, no submit needed
- [ ] Clears results when search cleared
- [ ] URL updates with `q=` param

### Sorting
- [ ] Sort by: Najnowsze, Najstarsze, Ostatnio zmienione, Tytuł A-Z, Tytuł Z-A
- [ ] URL updates with `sort=` and `order=` params

### Pagination
- [ ] 20 ads per page
- [ ] Shows page numbers with ellipsis for large ranges
- [ ] "Poprzednia" / "Następna" buttons
- [ ] Changing filters resets to page 1

### Bulk Selection
- [ ] Checkbox appears on each AdCard when `onToggleSelect` active
- [ ] Selecting card adds `ring-2 ring-primary` highlight
- [ ] "Zaznacz wszystkie" selects all visible ads
- [ ] Bulk actions bar appears: "Zaznaczono: N", CSV export button, deselect button
- [ ] CSV export with selected IDs → file downloads

---

## 6. Ad Card Actions

### Status-Based Buttons
- [ ] DRAFT → "Opublikuj" button (green CheckCircle) visible
- [ ] PUBLISHED → "Sprzedane" button (orange CircleDollarSign) visible
- [ ] SOLD → neither Opublikuj nor Sprzedane; Edit button hidden
- [ ] All states → View (Eye), Delete (Trash2) always visible

### Delete
- [ ] Click Trash2 — confirmation dialog appears
- [ ] Confirm — ad removed from list
- [ ] Check database — ad deleted
- [ ] Check Supabase Storage — associated images deleted from bucket

---

## 7. CSV Export

### Bulk Export (selected ads)
- [ ] Select ads in dashboard → click "Eksportuj CSV"
- [ ] GET `/api/ads/export?ids=id1,id2,...` — returns only those ads

### Filter Export
- [ ] GET `/api/ads/export?status=SOLD` — returns only SOLD ads
- [ ] GET `/api/ads/export?status=DRAFT` — returns only DRAFT ads

### CSV Format
- [ ] UTF-8 BOM present — Polish characters display correctly in Excel
- [ ] Columns: ID, Platforma, Tytuł, Opis, Status, Cena Min, Cena Max, Cena Sprzedaży, Stan, Ton, Dostawa, Data utworzenia, Data aktualizacji
- [ ] Fields with commas/quotes/newlines correctly escaped
- [ ] Filename: `ogloszenia-YYYY-MM-DD.csv`

---

## 8. Image Upload & Storage

### Upload Flow
- [ ] Drag-and-drop or click to select images
- [ ] Skeleton placeholders shown during compression
- [ ] Images resized to 800px width, 85% JPEG quality (sharp)
- [ ] Preview thumbnails shown after upload
- [ ] Removing image revokes object URL

### Supabase Storage
- [ ] After saving ad — images uploaded to `marketplace-ads` bucket
- [ ] Stored at path: `{userId}/{adId}/image-{n}.jpg`
- [ ] Ad record updated with Supabase public URLs (base64 discarded)

---

## 9. Stripe Payments

### Pricing Page
- [ ] Visit `/pricing` unauthenticated — all CTAs redirect to sign in
- [ ] Visit `/pricing` authenticated — "Obecny plan" badge on current tier
- [ ] Boost packs section visible only for authenticated users
- [ ] Clicking upgrade — redirects to Stripe Checkout (card + BLIK)

### Subscription Webhooks
- [ ] `checkout.session.completed` (subscription) — plan updated, `stripeSubscriptionId` set
- [ ] `invoice.paid` — credits reset to plan limit, `creditsResetAt` updated
- [ ] `customer.subscription.deleted` — plan downgraded to FREE, `stripeSubscriptionId` cleared

### Boost Webhook
- [ ] `checkout.session.completed` (payment) — `boostCredits` incremented by pack amount

### Customer Portal
- [ ] Paid users see "Zarządzaj subskrypcją" in sidebar
- [ ] Click → redirects to Stripe Customer Portal
- [ ] Can manage payment method, download invoices, cancel subscription

---

## 10. Dashboard Overview

### Stats Cards
- [ ] Shows 4 cards: Total, Wersje robocze, Opublikowane, Sprzedane
- [ ] Counts accurate after creating/changing ads
- [ ] Staggered entrance animation on load

### Recent Ads
- [ ] Shows last 5 ads (most recent first)
- [ ] Empty state shows "Nie masz jeszcze żadnych ogłoszeń" with CTA

### PendingAdHandler
- [ ] After soft-wall redirect + sign-in — pending ad auto-saved on dashboard mount
- [ ] Success: page reloads, ad appears in list
- [ ] Credit error (403): error alert shown for 8 seconds, IndexedDB not cleared

---

## 11. Sidebar

### Credits Display
- [ ] Shows `creditsAvailable/planLimit` (e.g., "4/5")
- [ ] Boost credits shown as `+ N` in primary color (only if > 0)
- [ ] Reset countdown: "Odnowienie X dni"
- [ ] "Zmień plan lub dokup kredyty" link → `/pricing`
- [ ] Paid plans: "Zarządzaj subskrypcją" button → Stripe Portal

### Navigation
- [ ] Pulpit → `/dashboard`
- [ ] Ogłoszenia → `/dashboard/ads`
- [ ] Szablony → `/dashboard/templates`
- [ ] Cennik → `/pricing`
- [ ] Active link highlighted

---

## 12. UI/UX

### Dark Mode
- [ ] Toggle theme — all components render correctly in both modes
- [ ] No hardcoded `dark:` classes needed (CSS variables handle it)

### Responsive Design
- [ ] Mobile (<640px): sidebar overlay, filter drawer, compact layout
- [ ] Tablet (640–1024px): 2-column stats
- [ ] Desktop (≥1024px): fixed sidebar, inline filter bar, 4-column stats

### Loading States
- [ ] Generation: FullscreenLoading with platform-specific messages
- [ ] Save: "Zapisywanie…" text + disabled buttons
- [ ] Image upload: skeleton placeholders

---

## 13. Security & Edge Cases

- [ ] `.env.local` not committed to git
- [ ] API routes return 401 for unauthenticated requests
- [ ] Ownership validation: User B cannot access/delete User A's ads (returns 404)
- [ ] Stripe webhook validates signature via `STRIPE_WEBHOOK_SECRET`
- [ ] Guest UUID spoofing doesn't bypass IP-based limit

---

## Expected Behaviors Summary

| Action | Expected Result |
|--------|----------------|
| Generate ad (guest, credits available) | Result shown + SoftWallModal "save" after 1.5s |
| Generate ad (guest, limit reached) | SoftWallModal "limit" mode shown immediately |
| Click "Zaloguj się i zapisz" in modal | Ad stored in IndexedDB, redirected to OAuth |
| Sign in with pending ad in IndexedDB | PendingAdHandler auto-saves ad on dashboard, page reloads |
| Generate ad (authenticated, credits available) | Result shown, credits decremented |
| Click "Zapisz" | Ad saved → redirect to /dashboard/ads |
| Click "Zapisz i stwórz następne" | Ad saved → form reset in place (no redirect) |
| Generate with 0 credits | Generate button disabled, "Zmień plan" CTA shown |
| Delete ad | Ad removed from DB + images deleted from Supabase Storage |
| Export selected ads CSV | Only selected IDs exported, UTF-8 BOM for Excel |
| Stripe invoice.paid webhook | Credits reset to plan limit |
| Stripe subscription.deleted webhook | Plan downgraded to FREE |
