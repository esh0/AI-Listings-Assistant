# Custom Style as Template Extension — Design Spec

**Date:** 2026-03-24
**Status:** Approved

## Goal

Allow RESELER users to define custom AI tone instructions within a Template. When a template uses a custom style, the standard tone instructions in the AI prompt are replaced by the user's own instructions.

## Architecture

Add `customToneInstructions String?` to the `Template` Prisma model and add `custom` to the `ToneStyle` Prisma enum (requires `prisma db push`). When `tone === "custom"`, the field is required (validated in Zod). In the AI prompt, `buildSystemPrompt(tone)` is extended to `buildSystemPrompt(tone, customToneInstructions?)` — when tone is `"custom"`, it injects the custom instructions instead of calling `getToneInstructions()`, and also suppresses `TONE_VOCABULARY` (which describes fixed tones only). `generateAd()` passes `request.customToneInstructions` through to `buildSystemPrompt`. `"custom"` is not added to `RESELER_TONES` — it is a template-only concept rendered as a standalone option in `TemplateFormModal`.

## File Map

| Action | File | What changes |
|---|---|---|
| Modify | `prisma/schema.prisma` | Add `custom` to `ToneStyle` enum; add `customToneInstructions String?` to `Template` model |
| Modify | `lib/types.ts` | Add `"custom"` to `ToneStyle` TypeScript type; add to `TONE_STYLE_NAMES` (`"Własny styl"`) and `TONE_STYLE_DESCRIPTIONS` (`"Własne instrukcje stylu zdefiniowane w szablonie"`); add `customToneInstructions?: string` to `GenerateAdRequest` interface; `"custom"` is NOT added to `FREE_TONES` or `RESELER_TONES` |
| Modify | `lib/schemas.ts` | Add `"custom"` to `ToneStyleSchema` z.enum; add optional `customToneInstructions: z.string().max(500).optional()` to `generateAdRequestSchema`; add `.refine()` to `generateAdRequestSchema`: reject requests where `tone === "custom"` and `customToneInstructions` is absent/empty (400 response) — template schema refinements live in their respective route files (see below) |
| Modify | `components/TemplateFormModal.tsx` | Render "Własny styl" as a standalone option **after** the `[...FREE_TONES, ...RESELER_TONES]` loop (RESELER only, Crown for FREE/STARTER); when `tone === "custom"` is the initial value (editing existing template), the standalone option renders as visually selected; conditionally show textarea for custom instructions when `tone === "custom"`; include `customToneInstructions` in `handleSubmit` JSON body |
| Modify | `lib/openai.ts` | Change `buildSystemPrompt(tone: ToneStyle)` to `buildSystemPrompt(tone: ToneStyle, customToneInstructions?: string)`; when `tone === "custom"`: replace `getToneInstructions(tone)` with custom instructions section AND suppress `TONE_VOCABULARY`; add `"custom"` guard to `getToneInstructions` (return `""`) to prevent TypeScript masking a runtime `undefined`; update call site in `generateAd()` to pass `request.customToneInstructions` |
| Modify | `app/api/generate-ad/route.ts` | Add guard: `tone === "custom"` requires `plan === "RESELER"` (same pattern as RESELER_TONES check at line 65) — prevents FREE/STARTER users bypassing plan restrictions via direct API call with `tone: "custom"` |
| Modify | `app/api/templates/route.ts` | GET: add `customToneInstructions: true` to the `select` block; POST local `createTemplateSchema` (defined in this file): add `customToneInstructions: z.string().min(1).max(500).optional()` + `.refine()` requiring it to be non-empty when `tone === "custom"`; Prisma create: include `customToneInstructions`; guard: only RESELER can set `tone === "custom"` |
| Modify | `app/api/templates/[id]/route.ts` | PATCH local `updateTemplateSchema` (defined in this file): add `customToneInstructions: z.string().min(1).max(500).optional()` + `.superRefine()` requiring it to be non-empty when `tone` is present in the body AND equals `"custom"` (partial update safe); Prisma update: include `customToneInstructions`; when `tone` changes away from `"custom"`, explicitly set `customToneInstructions: null`; same RESELER guard |
| Modify | `components/ProductForm.tsx` | Add optional `customToneActive?: boolean` prop; when `true`, hide tone selector and render "Styl z szablonu: Własny" placeholder text (greyed out, non-interactive) in its place |
| Modify | `components/TemplatesList.tsx` | Add `customToneInstructions?: string` to local `Template` interface; `TONE_STYLE_NAMES["custom"]` = `"Własny styl"` is load-bearing for template card display |
| Modify | `components/AdGeneratorForm.tsx` | Add `selectedCustomToneInstructions` state variable (mirrors `selectedBodyTemplate`); in `handleTemplateSelect`, set `setSelectedCustomToneInstructions(tpl.customToneInstructions ?? null)` and `setSelectedCustomToneInstructions(null)` on clear; include `customToneInstructions: selectedCustomToneInstructions ?? undefined` in `handleSubmit` fetch body; pass `customToneActive={selectedTone === "custom"}` prop to `ProductForm` to hide tone selector when custom template is active; when `handleTemplateSelect("")` clears the template, reset `selectedTone` to `DEFAULT_TONE` (never stays as `"custom"`) |

## Data Model

```prisma
enum ToneStyle {
  professional
  friendly
  casual
  enthusiastic
  funny
  technical
  persuasive
  concise
  custom          // NEW — only valid within a Template
}

model Template {
  // ... existing fields ...
  customToneInstructions String?  // Only set when tone === "custom"
}
```

## UI Behaviour

### TemplateFormModal tone selector
- Existing tones rendered via `[...FREE_TONES, ...RESELER_TONES]` loop — no change to this loop
- "Własny styl" rendered as a standalone option **after** the loop (RESELER only, Crown for FREE/STARTER)
- When editing an existing template with `tone === "custom"`, the standalone option renders as visually selected on modal open
- When "Własny styl" selected: textarea appears below the tone selector
  - Label: "Instrukcje stylu dla AI"
  - Placeholder: "Opisz styl pisania: np. 'Pisz entuzjastycznie, zawsze podkreślaj szybką wysyłkę, używaj słowa okazja, krótkie zdania, dużo wykrzykników'"
  - Max 500 characters (counter shown)
  - Required — save button disabled if empty when tone === "custom"
- `handleSubmit` must include `customToneInstructions` in the JSON body (when null/undefined, send as `null`)

### AdGeneratorForm template selector
- When user selects a template with `tone === "custom"`, the tone buttons in ProductForm are irrelevant — the custom instructions override them
- `AdGeneratorForm` passes `customToneActive={selectedTone === "custom"}` to `ProductForm`; when `true`, `ProductForm` hides its tone selector and renders "Styl z szablonu: Własny" (greyed out, non-interactive) in its place — `ProductForm` needs a new optional `customToneActive?: boolean` prop for this
- When user clears template selection (`handleTemplateSelect("")`): `selectedTone` resets to `DEFAULT_TONE` (never stays as `"custom"`)

## AI Prompt Integration

`buildSystemPrompt()` in `lib/openai.ts` — updated signature and logic:

```typescript
function buildSystemPrompt(tone: ToneStyle, customToneInstructions?: string): string {
  const isCustom = tone === "custom" && !!customToneInstructions;
  return `...
${isCustom
  ? `## TON: WŁASNY (zdefiniowany przez użytkownika)\n${customToneInstructions}`
  : getToneInstructions(tone)
}

${isCustom ? "" : TONE_VOCABULARY}  // suppress when custom tone active
...`;
}
```

Call site in `generateAd()` (same file, line ~442):
```typescript
// Before:
content: `${buildSystemPrompt(systemTone)}\n\n${buildJsonSchema()}`

// After:
content: `${buildSystemPrompt(systemTone, request.customToneInstructions)}\n\n${buildJsonSchema()}`
```

`getToneInstructions()` guard:
```typescript
function getToneInstructions(tone: ToneStyle): string {
  if (tone === "custom") return "";  // Safety guard — prevents runtime undefined injection
  // ... existing toneMap lookup
}
```

## Validation Rules

- `tone === "custom"` requires `customToneInstructions` to be non-empty string (max 500 chars) — enforced via local Zod refinements in `app/api/templates/route.ts` (POST) and `app/api/templates/[id]/route.ts` (PATCH), and via `.refine()` in `generateAdRequestSchema` in `lib/schemas.ts`
- `tone !== "custom"` — `customToneInstructions` is ignored even if present
- Only RESELER users can save templates with `tone === "custom"` (API-level guard in both POST and PATCH)
- PATCH partial updates: Zod refinement for `customToneInstructions` only triggers when `tone` is explicitly included in the PATCH body
- PATCH when `tone` changes away from `"custom"`: API explicitly sets `customToneInstructions: null` in the Prisma update to clear stale data

## Out of Scope

- Custom styles as a standalone entity (not templates) — deferred
- Sharing custom styles between templates — deferred
- No new database tables — single field addition to Template model and one enum value
- `PLATFORM_DEFAULT_TONES` — no change needed; `"custom"` is not a valid platform default tone
