# Changelog

All notable changes to this project will be documented in this file.
Format: [Semantic Versioning](https://semver.org) — `[version] - YYYY-MM-DD`

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
