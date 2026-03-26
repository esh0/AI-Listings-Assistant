# Changelog

All notable changes to this project will be documented in this file.
Format: [Semantic Versioning](https://semver.org) — `[version] - YYYY-MM-DD`

## [1.4.1] - 2026-03-26

### Fixed
- SEO: `metadataBase` zmienione z `https://marketplace-ai.pl` na `https://www.marketplace-ai.pl` — naprawia problem duplikatu kanonicznego w Google Search Console
- SEO: dodano `alternates.canonical` na wszystkich stronach publicznych (`/`, `/pricing`, `/polityka-prywatnosci`, `/regulamin`, `/blog`, `/blog/[slug]`)
- SEO: `sitemap.ts` — wszystkie URL-e zaktualizowane do domeny z www
- SEO: Schema.org JSON-LD w `/blog/[slug]` — URL-e zaktualizowane do www

## [1.4.0] - 2026-03-25

### Added
- Blog SEO: 9 artykułów poradnikowych pod frazy związane ze sprzedażą online (`/blog`)
  - Jak napisać ogłoszenie na OLX — poradnik i przykłady
  - Opisy na Vinted — przykłady i szablony
  - Generator ogłoszeń AI — jak działa Marketplace AI
  - Jak sprzedawać na Allegro Lokalnie
  - Facebook Marketplace — jak pisać opisy
  - Jak sprzedawać na eBay z Polski
  - Jak tworzyć listingi na Amazon
  - Jak sprzedawać na Etsy
  - Jak pisać opisy produktów które sprzedają — 7 zasad (artykuł hub)
- Blog infrastructure: `lib/blog.ts` (rejestr metadanych), `BlogLayout`, `BlogCTA`, `BlogPostCard` komponenty
- Strona listingowa `/blog` z kartami artykułów
- Dynamiczny router `/blog/[slug]` ze statycznym generowaniem, metadanymi SEO per artykuł i Schema.org JSON-LD
- Link "Blog" w stopce nawigacji
- `.prose-blog` CSS utility dla typografii artykułów
- Sitemap zaktualizowana o `/blog` i 9 artykułów (priority 0.7)
- Robots.txt zaktualizowany o `/blog` i `/blog/*`

### Fixed
- CSP: dodano `https://va.vercel-scripts.com` do `script-src` — Vercel Analytics był blokowany w trybie debug

## [1.3.11] - 2026-03-25

### Fixed
- Security: guest users could generate listings for eBay, Amazon, Etsy (RESELER-only platforms) via direct API call — platform guard moved before auth/guest split so it applies universally

## [1.3.10] - 2026-03-24

### Fixed
- Template modal: save button disabled when name is empty (previously allowed saving with blank name)
- Template modal: tone and condition pills cannot be unchecked — selected option is now disabled to prevent deselection
- Template deselect now resets all form fields (platform, condition, delivery, notes, priceType) to defaults instead of leaving previous template values
- Template select now applies priceType from template
- Pricing: added "Szablony ogłoszeń z własnym formatem" and "Własny styl tonu" to RESELER feature list
- Locked advanced tones (FREE users) now show Sparkles icon instead of Crown — Crown reserved for RESELER-only features

## [1.3.9] - 2026-03-24

### Added
- Custom style for RESELER templates: define free-text AI tone instructions within a Template
- When a template uses custom style, the standard tone instructions are replaced by user-defined instructions
- `customToneInstructions` field added to Template model (Prisma migration applied)
- New textarea in TemplateFormModal (max 500 chars, RESELER only with Crown lock for others)
- "Styl z szablonu: Własny" indicator replaces tone selector in generator when custom template active
- API guard: custom tone blocked for FREE/STARTER users at generate-ad endpoint

---

## [1.3.8] - 2026-03-24

### Added
- 3 new marketplace platforms for RESELER plan: eBay (80/1000 chars), Amazon (200/2000 chars), Etsy (140/1000 chars)
- Platform-specific AI generation rules for all 3 platforms (`lib/rules/ebay_rules.md`, `lib/rules/amazon_rules.md`, `lib/rules/etsy_rules.md`)
- Platform tiles with Crown lock (opacity-50, tooltip) for FREE and STARTER users
- New platform filters in ad management dashboard
- Pricing page updated: RESELER shows "7 platform", STARTER/FREE show "4 platformy"

---

## [1.3.7] - 2026-03-24

### Changed
- Advanced tones (enthusiastic, funny, technical, persuasive, concise) now available to STARTER plan — previously RESELER-only
- FREE users see advanced tones locked with updated tooltip "Dostępne w planach Starter i Reseler"
- API gate updated: rejects advanced tones only for FREE plan (was: non-RESELER)
- Pricing page copy updated: STARTER and RESELER now show "Wszystkie style tonu"
- Internal: `RESELER_TONES` constant renamed to `ADVANCED_TONES` across all files

---

## [1.3.6] - 2026-03-23

### Fixed
- CSP: added `https://www.googletagmanager.com` to `script-src` — GA4 script was blocked by Content Security Policy
- CSP: added `https://*.google-analytics.com` (wildcard) to `connect-src` — covers `region1.google-analytics.com` and other GA4 regional endpoints
- CSP: removed invalid `https://o*.ingest.sentry.io` from `connect-src` (mid-hostname wildcards not supported by CSP spec) — `https://*.sentry.io` already covers Sentry ingestion

---

## [1.3.5] - 2026-03-23

### Added
- GA4 custom events for monetization funnel tracking (consent-gated via `trackEvent()`):
  - `guest_generation_requested` — guest clicks "Generuj ogłoszenie" (platform, tone, condition, price_type, num_images)
  - `guest_limit_exhausted` — guest hits 3-generation rate limit (triggers SoftWall)
  - `softwall_shown` — SoftWall modal becomes visible (mode: save|limit)
  - `softwall_signin_clicked` — user clicks sign-in inside SoftWall
  - `pricing_page_viewed` — public or dashboard pricing page loaded (page_context)
  - `plan_upgrade_initiated` — user clicks STARTER/RESELER checkout button (plan_selected, page_context)
  - `boost_pack_initiated` — user clicks boost pack checkout button (boost_pack, page_context)
  - `subscription_activated` — Stripe webhook: subscription checkout completed (server-side via Measurement Protocol)
  - `boost_purchase_completed` — Stripe webhook: boost payment completed (server-side)
  - `subscription_cancelled` — Stripe webhook: subscription deleted (server-side)
- `sendServerEvent()` added to `lib/analytics.ts` — GA4 Measurement Protocol helper for server-side event tracking

---

## [1.3.4] - 2026-03-23

### Fixed
- GDPR/RODO: GA4 was loading unconditionally before user consent — moved to consent-conditional initialisation via `lib/analytics.ts`
- GDPR/RODO: Cookie banner redesigned with "Akceptuję" / "Tylko niezbędne" binary choice — previous "Rozumiem" button was not valid RODO consent
- GDPR/RODO: Migrated consent storage from legacy `cookie_notice_accepted` key to `cookie_analytics_consent` — existing users shown banner again to give explicit consent
- Privacy policy: removed false statement "Serwis nie korzysta z Google Analytics" — replaced with full GA4 disclosure including cookie table, retention periods, and legal basis
- Privacy policy: added `cookie_analytics_consent` localStorage key to section 7.2
- Privacy policy: added Google LLC (Google Analytics 4) to processors table (section 4) and data transfers list (section 9)

---

## [1.3.3] - 2026-03-23

### Fixed
- SEO: strona główna nie była indeksowana przez Google — Googlebot wykrywał client-side `router.push("/dashboard")` jako przekierowanie i nie indeksował strony. Redirect przeniesiony do middleware (server-side) — zalogowani użytkownicy dostają 307 przed renderem, Googlebot (niezalogowany) widzi pełną stronę lądowania
- Usunięto `useSession` i `useRouter` z `app/page.tsx` — uproszczono komponent, który nie potrzebował już tych zależności

---

## [1.3.2] - 2026-03-22

### Fixed
- Removed emoji characters from all platform rules (OLX, Allegro Lokalnie, Facebook Marketplace, Vinted) — replaced with text emoticons (`:)` `:D` `;)`) or removed where decorative; prevents "invalid character" errors on platforms that block Unicode emoji
- Horizontal scroll on mobile: moved `overflow-x-hidden` from landing page only to `<body>` in root layout — now applies to all pages (dashboard, pricing, auth, legal)

---

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
