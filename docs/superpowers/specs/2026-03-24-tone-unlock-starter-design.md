# Tone Unlock for Starter Plan — Design Spec

**Date:** 2026-03-24
**Status:** Approved

## Goal

Advanced tones (enthusiastic, funny, technical, persuasive, concise) are currently locked behind the RESELER plan. This change makes them available to STARTER as well. Only FREE users remain locked.

## Architecture

Single guard condition change: `userPlan !== "RESELER"` → `userPlan === "FREE"` in all lock checks. Rename `RESELER_TONES` to `ADVANCED_TONES` in `lib/types.ts` to reflect the new access policy. The API gate in `generate-ad/route.ts` must be updated in sync — otherwise STARTER users would be blocked server-side even after the UI unlocks.

## File Map

| Action | File | What changes |
|---|---|---|
| Modify | `lib/types.ts` | Rename `RESELER_TONES` → `ADVANCED_TONES`; update export |
| Modify | `components/ProductForm.tsx` | Lock condition: `userPlan !== "RESELER"` → `userPlan === "FREE"`; tooltip text: "Plan Reseler" → "Plan Starter lub Reseler" |
| Modify | `components/LandingForm.tsx` | Same lock condition change + tooltip text change (identical pattern at lines ~877–900) |
| Modify | `components/TemplateFormModal.tsx` | Rename import `RESELER_TONES` → `ADVANCED_TONES` only — no lock exists here (RESELER-only page) |
| Modify | `app/api/generate-ad/route.ts` | API gate: `RESELER_TONES.includes(tone) && plan !== "RESELER"` → `ADVANCED_TONES.includes(tone) && plan === "FREE"`; update error message to "Ten styl komunikacji dostępny jest w planach Starter i Reseler." |
| Modify | `app/pricing/page.tsx` | Starter feature: "Wszystkie style tonu"; FREE: "3 style tonu"; RESELER: "Wszystkie style tonu" |
| Modify | `app/dashboard/pricing/page.tsx` | Same pricing copy update |

## Behaviour

- FREE users: see advanced tones locked (Crown icon + tooltip "Plan Starter lub Reseler")
- STARTER users: all 8 tones unlocked, no Crown icons visible
- RESELER users: all 8 tones unlocked (no change)
- API gate updated — STARTER users can generate with advanced tones without 403 error

## Pricing Page Copy Changes

| Plan | Old | New |
|---|---|---|
| FREE | "3 style tonu" | "3 style tonu" (unchanged) |
| STARTER | "3 style tonu" | "Wszystkie style tonu" |
| RESELER | "3 style tonu" | "Wszystkie style tonu" |

## Out of Scope

- No database changes
- No legal/privacy policy changes
- Templates page is RESELER-only — no lock change needed there, only the import rename
