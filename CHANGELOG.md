# Changelog

All notable changes to this project will be documented in this file.
Format: [Semantic Versioning](https://semver.org) — `[version] - YYYY-MM-DD`

## [1.3.1] - 2026-03-22

### Fixed
- Sign-in page: friendly error banner when user tries to sign in with a different provider than the one used at registration (OAuthAccountNotLinked)
- `sendEmail()` now throws on error so magic link delivery failures surface to the user instead of silently succeeding
- Sign-in page accessibility: email input aria-label, focus ring on reset button, aria-hidden on decorative icon, Polish Suspense fallback

---

## [1.3.0] - 2026-03-21

### Added
- Facebook OAuth login via NextAuth v5 FacebookProvider
- Email magic link login via NextAuth v5 ResendProvider — sends branded Polish-language email via existing Resend integration
- Sign-in page updated with Facebook button, email form, and confirmation state

---

## [1.2.1] - 2026-03-21

### Fixed
- Landing page: prevented horizontal scroll on mobile caused by oversized background blob element

---

## [1.2.0] - 2026-03-20

### Added
- Google Analytics 4 (G-NER153CSFW) — automatic page view tracking, scroll depth, outbound clicks

---

## [1.1.0] - 2026-03-20

### Added
- Email system: all outgoing emails now sent from `noreply@marketplace-ai.pl` with `Reply-To: kontakt@marketplace-ai.pl`
- Low-credits email trigger: one-time Polish-language email via Resend when subscription credits drop to exactly 1
- Dedup guard: atomic `updateMany WHERE lastLowCreditEmailAt IS NULL OR < 25 days` prevents double-sends
- `lastLowCreditEmailAt DateTime?` field on User model for email dedup tracking
- `sendLowCreditsEmail()` function with branded HTML template matching subscription confirmed style
- Welcome email on first sign-in (sent via `auth.ts` signIn callback, fires once within 60s of account creation)

### Changed
- Low-credits email redesigned to match subscription confirmed template (gradient header, summary box, footer with legal links)
- Privacy policy: added Resend to data processors table; updated email communications legal basis (art. 6 lit. b/f RODO)
- Terms of service §5: added explicit list of all transactional emails sent by the service
- Privacy policy §12 and terms §5: `privacy@marketplace-ai.pl` added as dedicated contact for RODO requests and notification opt-out

### Fixed
- Added `@react-email/render` peer dependency required by Resend SDK (fixes Vercel build warning)

### Technical
- `maybeNotifyLowCredits()` is fire-and-forget (`.catch(() => {})`) — does not affect generation latency
- `RESEND_NOREPLY_EMAIL` and `RESEND_CONTACT_EMAIL` env vars replace old `RESEND_FROM_EMAIL`

---

## [1.0.0] - 2026-03-20

First production release.

### Added
- AI-powered ad generation using GPT-4.1-mini with image analysis
- Support for 4 marketplace platforms: OLX, Allegro Lokalnie, Facebook Marketplace, Vinted
- 3 base tone styles (Professional, Friendly, Casual) with platform-specific defaults
- 5 RESELER-only advanced tones with locked UI for lower-tier users
- 3-tier credit system: FREE (5/mo), STARTER (30/mo), RESELER (80/mo)
- One-time boost credit packs (10/30/60 credits) via Stripe
- Google OAuth authentication via NextAuth v5 (JWT, 7-day sessions)
- Guest access with UUID + IP rate limiting (3 per UUID, 5 per IP/24h)
- SoftWall modal — save prompt for guests; hard limit mode after exhaustion
- Pending ad handler — auto-saves guest-generated ad after sign-in via IndexedDB
- Dashboard with ad management: CRUD, status transitions, bulk selection, CSV export
- Ad detail page with sticky mobile action bar and inline title/description editing
- Platform-specific character limits enforced during inline editing
- Activity history log for all ad lifecycle events
- Templates system (RESELER only) for reusable ad presets
- Statistics page with weekly bar chart and platform breakdown (server-streamed)
- Settings page with account info and subscription management via Stripe Portal
- Stripe subscriptions (STARTER, RESELER) with idempotent webhook processing
- Public and dashboard pricing pages with boost packs section
- Image upload with drag-and-drop, sharp compression (800px/85%), Supabase Storage
- Per-plan image limits (FREE: 3, STARTER: 5, RESELER: 8)
- Price modes: AI suggest, user-provided, or free listing
- Modular AI prompt with uncertainty language system and forbidden phrases list
- Dark/light mode via next-themes with CSS variable design tokens
- Fully responsive layout — mobile sidebar overlay, compact ad list, mobile action bars
- Cookie consent banner
- CSV export with formula-injection protection (`escapeCSV`)

### Technical
- Next.js 15 App Router + TypeScript 5.7
- Prisma ORM with PostgreSQL via Supabase (PgBouncer session pooling)
- Server Components + Suspense streaming for dashboard data pages
- Dynamic imports for heavy client components (FullscreenLoading, AdResult)
- Atomic credit consumption (updateMany WHERE gt:0) — TOCTOU-safe
- createPortal for dialogs to escape backdrop-filter stacking context
- Accessibility: aria-labels, focus-visible rings, role=menu/menuitem on dropdowns

---

## [2026-03-03] - Dashboard & Ad Management (pre-release)

### Added
- Google OAuth via NextAuth v5, user management with Prisma
- Dashboard overview with statistics and recent ads
- Fixed sidebar with navigation and credits display, responsive mobile menu
- Full CRUD for ads, filtering by status/platform, debounced search, pagination
- Sorting by creation date, update date, title
- Mark ads as published/sold/archived
- CSV export
- Supabase Storage integration with Sharp image resizing

### Changed
- Compact ad cards with optimized layout
- Credits model simplified from `creditsUsed` to `creditsAvailable`
