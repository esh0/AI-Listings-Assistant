# Custom Style as Template Extension — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow RESELER users to define free-text custom tone instructions within a Template that replace the standard AI tone prompt.

**Architecture:** Add `custom` to Prisma `ToneStyle` enum (requires `prisma db push`) + `customToneInstructions String?` field to `Template` model. Add `"custom"` to `ToneStyleSchema` in `lib/schemas.ts`. Validate `customToneInstructions` required-when-`tone==="custom"` in local route schemas. Extend `buildSystemPrompt()` with optional `customToneInstructions` param. Wire through `generateAd()` → `AdGeneratorForm` → generate API request. Add UI in `TemplateFormModal` (textarea + locked option for non-RESELER). Add `customToneActive` prop to `ProductForm` to suppress tone selector when custom template active.

**Tech Stack:** Next.js 15, TypeScript, Prisma, Zod, Tailwind CSS

---

### Task 1: Prisma schema migration

**Files:**
- Modify: `prisma/schema.prisma:168-177,98-117` — add `custom` to ToneStyle enum, add field to Template

**Context:** `ToneStyle` enum is at lines 168-177 of `prisma/schema.prisma`. `Template` model is at lines 98-117. Both need updating. After running `prisma db push`, the Prisma Client is regenerated and TypeScript will pick up the new enum value.

- [ ] **Step 1: Update `prisma/schema.prisma`**

Add `custom` to `ToneStyle` enum (lines 168-177):
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
  custom
}
```

Add `customToneInstructions` to `Template` model (after `notes` line):
```prisma
model Template {
  id        String           @id @default(cuid())
  userId    String
  name      String
  platform  Platform
  tone      ToneStyle
  condition ProductCondition
  delivery     Json
  bodyTemplate String?
  priceType    String?
  notes        String?
  customToneInstructions String?  // Only set when tone === "custom"
  isDefault    Boolean          @default(false)
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, name])
  @@index([userId, isDefault])
  @@index([userId, createdAt(sort: Desc)])
}
```

- [ ] **Step 2: Run Prisma migration**

```bash
cd "/Users/I543168/AI Based Projects/Marketplace Assistant"
DIRECT_URL=$(grep DIRECT_URL .env.local | cut -d= -f2-) DATABASE_URL=$(grep DIRECT_URL .env.local | cut -d= -f2-) npx prisma db push
```
Expected: `Your database is now in sync with your Prisma schema.`

Use the pooler URL for both variables (port 5432 direct is blocked per CLAUDE.md).

- [ ] **Step 3: Verify Prisma Client regenerated**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: may show errors in other files (will be fixed) but NO errors about `ToneStyle` not having `custom`.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add custom to ToneStyle enum and customToneInstructions to Template model"
```

---

### Task 2: TypeScript types + Zod schema

**Files:**
- Modify: `lib/types.ts:17-20,157-177` — add `"custom"` to ToneStyle union, TONE_STYLE_NAMES, TONE_STYLE_DESCRIPTIONS, GenerateAdRequest
- Modify: `lib/schemas.ts:5-9` — add `"custom"` to ToneStyleSchema z.enum; add `customToneInstructions` + refine to generateAdRequestSchema

**Context:** `ToneStyle` TypeScript union is at lines 17-20 of `lib/types.ts`. `TONE_STYLE_NAMES` at lines 157-166, `TONE_STYLE_DESCRIPTIONS` at lines 169-178, `GenerateAdRequest` at lines 59-70. `ToneStyleSchema` in `lib/schemas.ts` at lines 5-9. `generateAdRequestSchema` at lines 47-86.

Note: `"custom"` is NOT added to `FREE_TONES` or `RESELER_TONES` arrays (lines 22-23) — it's template-only.

- [ ] **Step 1: Update `lib/types.ts` — ToneStyle union**

Lines 17-20:
```typescript
export type ToneStyle =
    | "professional" | "friendly" | "casual"
    | "enthusiastic" | "funny" | "technical"
    | "persuasive" | "concise" | "custom";
```

- [ ] **Step 2: Update `lib/types.ts` — TONE_STYLE_NAMES**

Add entry to the Record (lines 157-166):
```typescript
export const TONE_STYLE_NAMES: Record<ToneStyle, string> = {
    professional: "Profesjonalny",
    friendly: "Przyjazny",
    casual: "Swobodny",
    enthusiastic: "Entuzjastyczny",
    funny: "Zabawny",
    technical: "Techniczny",
    persuasive: "Przekonujący",
    concise: "Zwięzły",
    custom: "Własny styl",
};
```

- [ ] **Step 3: Update `lib/types.ts` — TONE_STYLE_DESCRIPTIONS**

Add entry (lines 169-178):
```typescript
export const TONE_STYLE_DESCRIPTIONS: Record<ToneStyle, string> = {
    professional: "Formalny, rzeczowy styl idealny dla poważnych transakcji",
    friendly: "Ciepły i przystępny ton budujący zaufanie",
    casual: "Bezpośredni i luźny język jak w rozmowie",
    enthusiastic: "Energetyczny, pełen emocji styl przyciągający uwagę",
    funny: "Lekki humor i luźna atmosfera bez utraty wiarygodności",
    technical: "Precyzyjne dane i specyfikacje bez ozdobników",
    persuasive: "Argumenty korzyści i CTA skłaniające do zakupu",
    concise: "Minimum słów, maksimum treści — bullet points i krótkie zdania",
    custom: "Własne instrukcje stylu zdefiniowane w szablonie",
};
```

- [ ] **Step 4: Update `lib/types.ts` — GenerateAdRequest**

Lines 59-70, add `customToneInstructions` field:
```typescript
export interface GenerateAdRequest {
    platform: Platform;
    productName: string;
    condition: ProductCondition;
    price?: string;
    priceType: PriceType;
    tone: ToneStyle;
    delivery: string;
    notes: string;
    images: ImageForRequest[];
    bodyTemplate?: string;
    customToneInstructions?: string;  // NEW
}
```

- [ ] **Step 5: Update `lib/schemas.ts` — ToneStyleSchema**

Lines 5-9:
```typescript
export const ToneStyleSchema = z.enum([
    "professional", "friendly", "casual",
    "enthusiastic", "funny", "technical",
    "persuasive", "concise", "custom",
]);
```

- [ ] **Step 6: Update `lib/schemas.ts` — generateAdRequestSchema**

After the existing `.refine(...)` block (which ends at line 86), chain another `.refine()`:
```typescript
export const generateAdRequestSchema = z
    .object({
        // ... existing fields unchanged ...
        bodyTemplate: z.string().max(3000).optional(),
        customToneInstructions: z.string().max(500).optional(),  // NEW field
    })
    .refine(
        // existing price refine — keep unchanged
        (data) => { ... },
        { ... }
    )
    .refine(
        // NEW: custom tone requires instructions
        (data) => {
            if (data.tone === "custom") {
                return !!data.customToneInstructions && data.customToneInstructions.trim().length > 0;
            }
            return true;
        },
        {
            message: "Własny styl wymaga podania instrukcji stylu",
            path: ["customToneInstructions"],
        }
    );
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 8: Commit**

```bash
git add lib/types.ts lib/schemas.ts
git commit -m "feat: add custom ToneStyle to types and schemas"
```

---

### Task 3: Update `lib/openai.ts` — buildSystemPrompt + getToneInstructions

**Files:**
- Modify: `lib/openai.ts:181,309,435-445` — guard in getToneInstructions, new buildSystemPrompt signature, updated generateAd call site

**Context:** `getToneInstructions` is at line 181 (function start). `buildSystemPrompt` is at line 309. `TONE_VOCABULARY` is a constant injected inside `buildSystemPrompt`. `generateAd` calls `buildSystemPrompt(systemTone)` at approximately line 442.

- [ ] **Step 1: Add guard to `getToneInstructions`**

At the start of the function body (line 182, before `const toneMap = {`):
```typescript
function getToneInstructions(tone: ToneStyle): string {
  if (tone === "custom") return "";  // Safety guard — custom tone uses customToneInstructions instead
  const toneMap = {
    // ... existing toneMap unchanged
  };
  return toneMap[tone];
}
```

- [ ] **Step 2: Update `buildSystemPrompt` signature and logic**

Line 309 — change the function signature and body:
```typescript
// Before:
function buildSystemPrompt(tone: ToneStyle): string {
  return `...
${getToneInstructions(tone)}

${TONE_VOCABULARY}
...`;
}

// After:
function buildSystemPrompt(tone: ToneStyle, customToneInstructions?: string): string {
  const isCustom = tone === "custom" && !!customToneInstructions;
  return `...
${isCustom
  ? `## TON: WŁASNY (zdefiniowany przez użytkownika)\n${customToneInstructions}`
  : getToneInstructions(tone)
}

${isCustom ? "" : TONE_VOCABULARY}
...`;
}
```

Note: the `...` represents the unchanged surrounding prompt text. Only modify the two insertion points above.

- [ ] **Step 3: Update `generateAd` call site**

Find `buildSystemPrompt(systemTone)` (approximately line 442) and update:
```typescript
// Before:
content: `${buildSystemPrompt(systemTone)}\n\n${buildJsonSchema()}`

// After:
content: `${buildSystemPrompt(systemTone, request.customToneInstructions)}\n\n${buildJsonSchema()}`
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add lib/openai.ts
git commit -m "feat: extend buildSystemPrompt with customToneInstructions support"
```

---

### Task 4: Update template API routes

**Files:**
- Modify: `app/api/templates/route.ts:9-24,37-50,63-95` — add field to createTemplateSchema, GET select, POST Prisma create
- Modify: `app/api/templates/[id]/route.ts:9-26,81-91` — add field to updateTemplateSchema, PATCH Prisma update

**Context:** `app/api/templates/route.ts` has local `createTemplateSchema` at lines 9-24 and GET `select` block at lines 37-50. `app/api/templates/[id]/route.ts` has `updateTemplateSchema` at lines 9-26 and Prisma update at lines 81-91. The `...rest` spread on line 81 of `[id]/route.ts` automatically includes `customToneInstructions` once it's validated — but `tone` nulling when changing away from `"custom"` requires explicit handling.

- [ ] **Step 1: Update `app/api/templates/route.ts` — createTemplateSchema**

After `notes: z.string().max(1000).optional(),` (line 23), add validation + refine:
```typescript
const createTemplateSchema = z.object({
    // ... existing fields unchanged ...
    notes: z.string().max(1000).optional(),
    customToneInstructions: z.string().min(1).max(500).optional(),  // NEW
}).refine(
    (data) => {
        if (data.tone === "custom") {
            return !!data.customToneInstructions && data.customToneInstructions.trim().length > 0;
        }
        return true;
    },
    {
        message: "Własny styl wymaga podania instrukcji stylu",
        path: ["customToneInstructions"],
    }
);
```

- [ ] **Step 2: Update `app/api/templates/route.ts` — GET select**

Lines 37-50, add `customToneInstructions: true`:
```typescript
select: {
    id: true,
    name: true,
    platform: true,
    tone: true,
    condition: true,
    delivery: true,
    bodyTemplate: true,
    priceType: true,
    notes: true,
    isDefault: true,
    createdAt: true,
    customToneInstructions: true,  // NEW
},
```

- [ ] **Step 3: Update `app/api/templates/route.ts` — POST Prisma create**

Find the `prisma.template.create` call (approximately lines 65-95). The `createTemplateSchema` validated data already contains `customToneInstructions`. The create must always set `customToneInstructions` conditionally to prevent persisting stale data when `tone !== "custom"`:

```typescript
// In the Prisma create data, add explicit conditional:
customToneInstructions: result.data.tone === "custom" ? (result.data.customToneInstructions ?? null) : null,
```

This ensures that if a caller sends `tone: "friendly"` with `customToneInstructions: "some text"`, the field is nulled out rather than persisted (spec rule: `tone !== "custom"` — `customToneInstructions` is ignored).

Also add RESELER guard for `tone === "custom"` directly before the Prisma create (after the existing plan check):
```typescript
if (result.data.tone === "custom" && session.user.plan !== "RESELER") {
    return NextResponse.json(
        { error: "Własny styl dostępny jest tylko w planie Reseler" },
        { status: 403 }
    );
}
```

- [ ] **Step 4: Update `app/api/templates/[id]/route.ts` — updateTemplateSchema**

After `notes: z.string().max(1000).optional(),` (line 25), add + superRefine:
```typescript
const updateTemplateSchema = z.object({
    // ... existing fields unchanged ...
    notes: z.string().max(1000).optional(),
    customToneInstructions: z.string().min(1).max(500).optional(),  // NEW
}).superRefine((data, ctx) => {
    // Only validate when tone is explicitly being set to "custom"
    if (data.tone === "custom" && (!data.customToneInstructions || data.customToneInstructions.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Własny styl wymaga podania instrukcji stylu",
            path: ["customToneInstructions"],
        });
    }
});
```

- [ ] **Step 5: Update `app/api/templates/[id]/route.ts` — PATCH Prisma update**

Lines 81-91: The `...rest` spread (line 86) will automatically include `customToneInstructions` from `result.data`. Add explicit null-clearing when tone changes away from `"custom"`:
```typescript
const { condition, platform, tone, customToneInstructions, ...rest } = result.data;
// ...
const updated = await prisma.template.update({
    where: { id },
    data: {
        ...rest,
        ...(platform !== undefined ? { platform: platform as Platform } : {}),
        ...(tone !== undefined ? { tone: tone as ToneStyle } : {}),
        ...(condition !== undefined ? { condition: CONDITION_MAP[condition] } : {}),
        // When tone changes away from "custom", clear stale instructions
        ...(tone !== undefined && tone !== "custom"
            ? { customToneInstructions: null }
            : customToneInstructions !== undefined
            ? { customToneInstructions }
            : {}),
    },
});
```

Also add RESELER guard for `tone === "custom"` (before Prisma call):
```typescript
if (result.data.tone === "custom" && session.user.plan !== "RESELER") {
    return NextResponse.json(
        { error: "Własny styl dostępny jest tylko w planie Reseler" },
        { status: 403 }
    );
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 7: Commit**

```bash
git add app/api/templates/route.ts app/api/templates/[id]/route.ts
git commit -m "feat: add customToneInstructions to template API routes with Zod validation"
```

---

### Task 5: Update `app/api/generate-ad/route.ts` — custom tone guard

**Files:**
- Modify: `app/api/generate-ad/route.ts:65-73` — add `"custom"` platform guard

**Context:** Lines 64-73 contain the RESELER_TONES gate. After the rename in tone-unlock plan, this check will use `ADVANCED_TONES`. A `custom` tone from a direct API call (bypassing template enforcement) must be blocked for non-RESELER users. This guard sits after the existing tones guard.

**Important:** This task depends on Task 1 of the tone-unlock plan (`RESELER_TONES` → `ADVANCED_TONES` rename). If implementing these plans in parallel, coordinate the rename first.

- [ ] **Step 1: Add custom tone guard**

After the ADVANCED_TONES check (lines 64-73), add:
```typescript
// Enforce RESELER-only custom tone (custom is template-only, not for direct API use by FREE/STARTER)
if (validatedData.tone === "custom" && plan !== "RESELER") {
    return NextResponse.json(
        {
            isValid: false,
            error: "Własny styl komunikacji dostępny jest tylko w planie Reseler.",
        },
        { status: 403 }
    );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add app/api/generate-ad/route.ts
git commit -m "feat: add RESELER-only guard for custom tone in generate-ad route"
```

---

### Task 6: Update `components/TemplatesList.tsx` — Template interface

**Files:**
- Modify: `components/TemplatesList.tsx:23-35` — add `customToneInstructions` to Template interface

**Context:** The `Template` interface at lines 23-35 is the shared type used by `TemplateFormModal` (imported) and `AdGeneratorForm` (imported via `Template` from TemplatesList). Note: `TemplatesList.tsx` also has its own `PLATFORM_ICONS` map at lines 14-19 — this will also need eBay/Amazon/Etsy entries if the new-platforms plan runs concurrently, but that's handled in that plan.

- [ ] **Step 1: Update Template interface**

Lines 23-35:
```typescript
export interface Template {
    id: string;
    name: string;
    platform: Platform;
    tone: ToneStyle;
    condition: ProductCondition;
    delivery: DeliveryOption[];
    bodyTemplate?: string | null;
    priceType?: PriceType | null;
    notes?: string | null;
    isDefault: boolean;
    createdAt: string;
    customToneInstructions?: string | null;  // NEW — nullable matches Prisma optional String?
}
```

Note: `string | null` (not just `string?`) because the Prisma field is `String?` which returns `string | null` from the API, not `undefined`. Using `string | null` avoids runtime mismatches from `JSON.stringify`.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/TemplatesList.tsx
git commit -m "feat: add customToneInstructions to Template interface"
```

---

### Task 7: Update `components/TemplateFormModal.tsx` — custom tone UI

**Files:**
- Modify: `components/TemplateFormModal.tsx:37,42-44,76,88-114,197-219` — add state, textarea, standalone option, submit body

**Context:** `TemplateFormModal` manages tone selection in the tone pills section (lines 197-219), which currently iterates `[...FREE_TONES, ...RESELER_TONES]`. We add a standalone "Własny styl" option AFTER this loop, visible only when `userPlan === "RESELER"`. When selected, a textarea appears.

The component receives `template` prop (for editing existing). When `template?.tone === "custom"`, the `tone` state initializes to `"custom"`, and the custom textarea initializes to `template?.customToneInstructions ?? ""`.

The `handleSubmit` function (lines 76-114) sends the JSON body — add `customToneInstructions`.

The component's `Props` interface doesn't include `userPlan` — it must be added.

- [ ] **Step 1: Add `userPlan` to Props interface**

Line 28:
```typescript
interface Props {
    template: Template | null;
    onClose: (saved: boolean) => void;
    userPlan: string;  // NEW
}
```

Update the function signature (line 33):
```typescript
export function TemplateFormModal({ template, onClose, userPlan }: Props) {
```

- [ ] **Step 2: Add customToneInstructions state**

After `const [notes, setNotes] = useState(...)` (line 43), add:
```typescript
const [customToneInstructions, setCustomToneInstructions] = useState(
    template?.customToneInstructions ?? ""
);
```

- [ ] **Step 3: Update handleSubmit to include customToneInstructions**

Lines 93-101, update the JSON body:
```typescript
body: JSON.stringify({
    name: name.trim(),
    platform,
    tone,
    condition,
    delivery,
    bodyTemplate: bodyTemplate || undefined,
    notes: notes || undefined,
    customToneInstructions: tone === "custom" ? customToneInstructions : null,  // NEW
}),
```

Also update the `handleSubmit` validation (after the delivery check at line 82):
```typescript
if (tone === "custom" && !customToneInstructions.trim()) {
    setError("Podaj instrukcje stylu dla AI");
    return;
}
```

**Additionally**, the save button must be `disabled` when `tone === "custom"` and instructions are empty (spec: "save button disabled if empty when tone === 'custom'"). Find the submit button in the modal footer and add the condition:
```typescript
disabled={isLoading || (tone === "custom" && !customToneInstructions.trim())}
```
This provides proactive UI disabling in addition to the reactive error guard above.

- [ ] **Step 4: Add "Własny styl" option AFTER the tone loop**

Find the tone pills section (lines 197-219). After the closing `</div>` of the existing loop, add:
```typescript
{/* Custom tone — RESELER only */}
{userPlan === "RESELER" ? (
    <button
        type="button"
        role="radio"
        aria-checked={tone === "custom"}
        onClick={() => setTone("custom")}
        className={cn(
            "px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            tone === "custom"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
        )}
    >
        Własny styl
    </button>
) : (
    <div className="relative">
        <button
            type="button"
            className={cn(
                "px-4 py-1.5 rounded-full border text-sm",
                "flex items-center gap-1.5 cursor-not-allowed",
                "border-border bg-muted text-muted-foreground opacity-50"
            )}
            aria-disabled="true"
            disabled
        >
            <Crown className="h-3 w-3" aria-hidden="true" />
            Własny styl
        </button>
    </div>
)}

{/* Custom tone textarea */}
{tone === "custom" && (
    <div className="w-full space-y-2">
        <label className="text-sm font-medium">
            Instrukcje stylu dla AI <span className="text-destructive">*</span>
        </label>
        <Textarea
            value={customToneInstructions}
            onChange={(e) => setCustomToneInstructions(e.target.value)}
            placeholder="Opisz styl pisania: np. 'Pisz entuzjastycznie, zawsze podkreślaj szybką wysyłkę, używaj słowa okazja, krótkie zdania, dużo wykrzykników'"
            maxLength={500}
            rows={4}
            className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">
            {customToneInstructions.length}/500
        </p>
    </div>
)}
```

Note: Import `Crown` if not already imported (check line 4).

- [ ] **Step 5: Update all callers of TemplateFormModal**

Find all usage of `<TemplateFormModal`:
```bash
grep -rn "TemplateFormModal" --include="*.tsx" .
```

The only caller is `components/TemplatesList.tsx`. Update `TemplatesList`'s props interface and function signature, then pass `userPlan` down:

In `TemplatesList.tsx` (line 37), update the props:
```typescript
export function TemplatesList({ initialTemplates, userPlan }: { initialTemplates: Template[]; userPlan: string }) {
```

Pass `userPlan` to `TemplateFormModal` in the JSX:
```typescript
{modalOpen && (
    <TemplateFormModal
        template={editingTemplate}
        onClose={handleModalClose}
        userPlan={userPlan}  // NEW
    />
)}
```

In `components/TemplatesListServer.tsx` (line 25), the server component already has `session` from `await auth()`. Update the render call:
```typescript
return <TemplatesList initialTemplates={mappedTemplates} userPlan={session.user.plan ?? "FREE"} />;
```

No changes needed to `app/dashboard/templates/page.tsx` — it renders `<TemplatesListServer />` with no props, and `TemplatesListServer` reads the session internally.

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 7: Commit**

```bash
git add components/TemplateFormModal.tsx components/TemplatesList.tsx
git commit -m "feat: add custom tone UI to TemplateFormModal with RESELER lock"
```

---

### Task 8: Update `components/ProductForm.tsx` — customToneActive prop

**Files:**
- Modify: `components/ProductForm.tsx:49-67,70-76,131-209` — add optional prop, conditional tone display

**Context:** `ProductFormProps` interface at lines 49-67. `ProductForm` component (Card 2: Platform + Tone) at lines 70-209. When `customToneActive` is `true`, the tone selector section should be replaced with a read-only indicator: "Styl z szablonu: Własny" (greyed out text).

- [ ] **Step 1: Add `customToneActive` to ProductFormProps**

Lines 49-67:
```typescript
interface ProductFormProps {
    platform: Platform;
    productName: string;
    condition: ProductCondition;
    price: string;
    delivery: DeliveryOption[];
    notes: string;
    selectedTone: ToneStyle;
    priceType: PriceType;
    onPlatformChange: (value: Platform) => void;
    onProductNameChange: (value: string) => void;
    onConditionChange: (value: ProductCondition) => void;
    onPriceChange: (value: string) => void;
    onDeliveryChange: (value: DeliveryOption[] | ((prev: DeliveryOption[]) => DeliveryOption[])) => void;
    onNotesChange: (value: string) => void;
    onToneChange: (value: ToneStyle) => void;
    onPriceTypeChange: (value: PriceType) => void;
    userPlan: string;
    customToneActive?: boolean;  // NEW
}
```

- [ ] **Step 2: Add prop to ProductForm Pick**

Lines 70-76:
```typescript
export function ProductForm({
    platform,
    selectedTone,
    onPlatformChange,
    onToneChange,
    userPlan,
    customToneActive,  // NEW
}: Pick<ProductFormProps, 'platform' | 'selectedTone' | 'onPlatformChange' | 'onToneChange' | 'userPlan' | 'customToneActive'>) {
```

- [ ] **Step 3: Add conditional rendering for tone section**

Find the tone `<fieldset>` (lines 131-206). Wrap the inner content:
```typescript
<fieldset className="space-y-3">
    <legend className="text-sm font-medium leading-none">
        Styl komunikacji
    </legend>
    {customToneActive ? (
        <p className="text-sm text-muted-foreground italic">
            Styl z szablonu: Własny
        </p>
    ) : (
        <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Wybór stylu komunikacji">
            {/* existing FREE_TONES and ADVANCED_TONES maps unchanged */}
        </div>
    )}
</fieldset>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add components/ProductForm.tsx
git commit -m "feat: add customToneActive prop to ProductForm — hides tone selector"
```

---

### Task 9: Update `components/AdGeneratorForm.tsx` — wire through customToneInstructions

**Files:**
- Modify: `components/AdGeneratorForm.tsx:73-77,188-202,218-228,358-377` — add state, handleTemplateSelect, handleReset, fetch body

**Context:** Current template state (lines 73-77): `selectedBodyTemplate`. `handleTemplateSelect` (lines 188-202): sets `selectedBodyTemplate` from `tpl.bodyTemplate`. `handleReset` (lines 204-228): resets all state. Generate fetch body (lines 363-376): includes `selectedBodyTemplate`. We mirror the `selectedBodyTemplate` pattern for `selectedCustomToneInstructions`.

- [ ] **Step 1: Add state variable**

After `selectedBodyTemplate` state (line 76), add:
```typescript
const [selectedCustomToneInstructions, setSelectedCustomToneInstructions] = useState<string | null>(null);
```

- [ ] **Step 2: Update `handleTemplateSelect`**

Lines 188-202:
```typescript
const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
        setSelectedBodyTemplate("");
        setSelectedCustomToneInstructions(null);  // NEW
        setSelectedTone(DEFAULT_TONE);  // NEW: reset from "custom" when template cleared
        return;
    }
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    setPlatform(tpl.platform);
    setSelectedTone(tpl.tone);
    setCondition(tpl.condition);
    setDelivery(tpl.delivery);
    if (tpl.notes) setNotes(tpl.notes);
    setSelectedBodyTemplate(tpl.bodyTemplate ?? "");
    setSelectedCustomToneInstructions(tpl.customToneInstructions ?? null);  // NEW
}, [templates]);
```

- [ ] **Step 3: Update `handleReset`**

Lines 218-228, add reset of new state (both `selectedCustomToneInstructions` AND `selectedTone` must be reset — spec requires tone never stays as `"custom"` without an active custom template):
```typescript
setSelectedCustomToneInstructions(null);  // NEW — add after setSelectedBodyTemplate("")
setSelectedTone(DEFAULT_TONE);  // NEW — prevent "custom" tone persisting after full reset
```

- [ ] **Step 4: Update generate fetch body**

Lines 363-376, add `customToneInstructions`:
```typescript
body: JSON.stringify({
    platform,
    productName,
    condition,
    priceType,
    price: priceType === "user_provided" ? price : undefined,
    delivery: delivery.join(", "),
    notes,
    images: imagesForRequest,
    tone: selectedTone,
    ...(selectedBodyTemplate && { bodyTemplate: selectedBodyTemplate }),
    ...(selectedCustomToneInstructions && { customToneInstructions: selectedCustomToneInstructions }),  // NEW
    ...(!session?.user?.id && { guestId: getGuestId() }),
}),
```

- [ ] **Step 5: Pass `customToneActive` to `ProductForm`**

Find where `<ProductForm` is rendered in `AdGeneratorForm`. Add the prop:
```typescript
<ProductForm
    platform={platform}
    selectedTone={selectedTone}
    onPlatformChange={setPlatform}
    onToneChange={setSelectedTone}
    userPlan={session?.user?.plan ?? "FREE"}
    customToneActive={selectedTone === "custom"}  // NEW
/>
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 7: Commit**

```bash
git add components/AdGeneratorForm.tsx
git commit -m "feat: wire customToneInstructions through AdGeneratorForm generate request"
```

---

### Task 10: Final verification and CHANGELOG

**Files:** `CHANGELOG.md`

- [ ] **Step 1: Full TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 2: Build**

```bash
npm run build 2>&1 | tail -20
```
Expected: Build completes.

- [ ] **Step 3: Verify no old pattern leaks**

```bash
grep -rn "RESELER.*tone\|tone.*RESELER" --include="*.ts" --include="*.tsx" . | grep -v "node_modules\|\.next\|docs"
```
Expected: only the route-level guards (which correctly check `plan !== "RESELER"` for the `"custom"` tone — that's intentional).

- [ ] **Step 4: Add CHANGELOG entry**

In `CHANGELOG.md`, add after the other new entries:
```markdown
## [1.3.9] - 2026-03-24

### Added
- Custom style for RESELER templates: define free-text AI tone instructions within a Template
- When a template uses custom style, the standard tone instructions are replaced by user-defined instructions
- `customToneInstructions` field added to Template model (Prisma migration applied)
- New textarea in TemplateFormModal (max 500 chars, RESELER only with Crown lock for others)
- "Styl z szablonu: Własny" indicator replaces tone selector in generator when custom template active
- API guard: custom tone blocked for FREE/STARTER users at generate-ad endpoint
```

- [ ] **Step 5: Commit**

```bash
git add CHANGELOG.md
git commit -m "chore: add CHANGELOG entry for v1.3.9 — custom style template"
```
