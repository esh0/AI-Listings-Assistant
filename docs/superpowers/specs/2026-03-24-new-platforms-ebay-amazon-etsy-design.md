# New Platforms (eBay, Amazon, Etsy) for Reseler — Design Spec

**Date:** 2026-03-24
**Status:** Approved

## Goal

Add 3 international marketplace platforms (eBay, Amazon, Etsy) available exclusively to RESELER plan users. Listings generated in Polish. FREE and STARTER users see the platforms locked (Crown icon + tooltip).

## Architecture

New entries in `Platform` type → new platform Zod enum values in `lib/schemas.ts` and route files → new rules `.md` files → new entries in `PLATFORM_RULES_FILES` → new platform tiles in `ProductForm.tsx` with lock guard → new character limits in `AdResultMain.tsx`. Platform icons and colors must be added to all components that maintain their own local icon maps (`AdCard.tsx`, `PlatformSelector.tsx`, `TemplateFormModal.tsx`). No new DB models, no API changes beyond type and schema updates.

## File Map

| Action | File | What changes |
|---|---|---|
| Modify | `lib/types.ts` | Add `"ebay" \| "amazon" \| "etsy"` to `Platform`; add to `PLATFORM_NAMES`, `PLATFORM_META`, `PLATFORM_DEFAULT_TONES`; add character limits |
| Modify | `lib/schemas.ts` | Update hardcoded platform enum in `productFormSchema` (line 14), `generateAdRequestSchema` (line 49), and `platformEnum` (line 159) to include `"ebay"`, `"amazon"`, `"etsy"` — these are standalone Zod literals, not derived from `lib/types.ts` |
| Modify | `app/api/templates/route.ts` | Update local `createTemplateSchema` inline platform enum (line 11) to include `"ebay"`, `"amazon"`, `"etsy"` |
| Create | `lib/rules/ebay_rules.md` | eBay listing rules for AI prompt |
| Create | `lib/rules/amazon_rules.md` | Amazon listing rules for AI prompt |
| Create | `lib/rules/etsy_rules.md` | Etsy listing rules for AI prompt |
| Modify | `lib/openai.ts` | Add 3 entries to `PLATFORM_RULES_FILES`; update system prompt opening sentence to include the 3 international platforms |
| Modify | `components/ProductForm.tsx` | 3 new platform tiles with lock guard for non-Reseler: clicking a locked tile is a no-op for both `onPlatformChange` and `onToneChange` (show tooltip only, do not change platform or default tone) |
| Modify | `components/AdResultMain.tsx` | Character limits for new platforms |
| Modify | `components/AdCard.tsx` | Add eBay/Amazon/Etsy entries to `PLATFORM_ICONS` (`Record<Platform, React.ElementType>`) — TypeScript build will fail without these |
| Modify | `components/AdsList.tsx` | Add eBay, Amazon, Etsy to `PLATFORM_FILTERS` array so RESELER users can filter ads by new platforms |
| Modify | `components/PlatformSelector.tsx` | Add eBay/Amazon/Etsy to local `PLATFORM_ICONS` and `PLATFORM_COLORS` maps (no lock guard needed here — this selector is used in contexts without plan gating) |
| Modify | `components/TemplateFormModal.tsx` | Add eBay/Amazon/Etsy to `PLATFORM_ICONS`; no lock guard needed here — the whole templates page is already RESELER-only |
| Modify | `app/pricing/page.tsx` | Update platform feature line per Pricing Copy Changes table |
| Modify | `app/dashboard/pricing/page.tsx` | Same pricing copy update |

## Platform Character Limits

| Platform | Title | Description |
|---|---|---|
| eBay | 80 chars | 1000 chars |
| Amazon | 200 chars | 2000 chars (bullet-point style) |
| Etsy | 140 chars | 1000 chars |

## Platform Defaults

| Platform | Default Tone | Color | Icon |
|---|---|---|---|
| eBay | professional | `text-yellow-500` | `ShoppingCart` (lucide) |
| Amazon | professional | `text-yellow-600` | `Package` (lucide) |
| Etsy | friendly | `text-orange-400` | `Tag` (lucide) |

Note: `Sparkles` (lucide) is avoided for Etsy because it is already used as the "Generuj" CTA button icon in `ProductForm.tsx`, creating visual ambiguity. Use `Tag` instead.

## Lock Behaviour

- FREE and STARTER: platform tiles shown but disabled — `opacity-50 cursor-not-allowed`, Crown icon + tooltip "Plan Reseler"
- Clicking a locked platform tile is a **no-op** for both `onPlatformChange` and `onToneChange` — only the tooltip shows
- RESELER: fully accessible
- Lock implemented in `ProductForm.tsx` — same pattern as advanced tones but on platform tiles

## Pricing Copy Changes

| Plan | Old | New |
|---|---|---|
| RESELER | "Wszystkie platformy" | "7 platform (OLX, Allegro, FB, Vinted + eBay, Amazon, Etsy)" |
| STARTER | "Wszystkie platformy" | "4 platformy (OLX, Allegro, FB Marketplace, Vinted)" |
| FREE | "Wszystkie platformy" | "4 platformy (OLX, Allegro, FB Marketplace, Vinted)" |

## Rules Files Content

Content for the 3 rules files follows the same structure as existing rules files:
- Default tone for platform
- Tone-specific phrasing sections (professional, friendly, casual + advanced tones)
- Platform-specific title/description rules
- What to avoid
- Free listing guidelines

All listings are generated in Polish regardless of platform origin.

## Out of Scope

- Multi-language generation (Polish only for now)
- Platform-specific pricing in non-PLN currencies
- Platform API integrations (listing is copy-paste by user)
- No new DB fields
- Lock guard inside `TemplateFormModal` — the whole templates page is already RESELER-only
