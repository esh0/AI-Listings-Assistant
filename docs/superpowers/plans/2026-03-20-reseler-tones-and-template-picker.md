# RESELER Tones & Template Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 RESELER-only tone styles (enthusiastic, funny, technical, persuasive, concise) with full AI support, and make the template picker always visible (locked for non-RESELER).

**Architecture:** Extend `ToneStyle` type + Prisma enum, add `FREE_TONES`/`RESELER_TONES` constants, update UI components to show locked RESELER tones with Crown icon + tooltip, add backend 403 gate, write AI prompt instructions and platform rules for all 5 new tones.

**Tech Stack:** Next.js 15 App Router, TypeScript, Prisma, Tailwind CSS, lucide-react (Crown icon), `lib/types.ts` as single source of truth for tone metadata.

**Spec:** `docs/superpowers/specs/2026-03-20-reseler-tones-and-template-picker-design.md`

---

## Task 1: Extend ToneStyle type and constants

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/schemas.ts`

- [ ] **Step 1: Update `ToneStyle` union type in `lib/types.ts`**

Replace the existing `ToneStyle` definition:

```typescript
// Before:
export type ToneStyle = "professional" | "friendly" | "casual";

// After:
export type ToneStyle =
    | "professional" | "friendly" | "casual"
    | "enthusiastic" | "funny" | "technical"
    | "persuasive" | "concise";
```

- [ ] **Step 2: Add `FREE_TONES` and `RESELER_TONES` constants after `ToneStyle`**

```typescript
export const FREE_TONES: ToneStyle[] = ["professional", "friendly", "casual"];
export const RESELER_TONES: ToneStyle[] = ["enthusiastic", "funny", "technical", "persuasive", "concise"];
```

- [ ] **Step 3: Extend `TONE_STYLE_NAMES` with 5 new entries**

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
};
```

- [ ] **Step 4: Extend `TONE_STYLE_DESCRIPTIONS` with 5 new entries**

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
};
```

- [ ] **Step 5: Extend `ToneStyleSchema` in `lib/schemas.ts`**

```typescript
// Before:
export const ToneStyleSchema = z.enum(["professional", "friendly", "casual"]);

// After:
export const ToneStyleSchema = z.enum([
    "professional", "friendly", "casual",
    "enthusiastic", "funny", "technical",
    "persuasive", "concise",
]);
```

- [ ] **Step 6: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: errors only from `ToneSelector.tsx` (will be deleted in Task 2) and `prisma/schema.prisma` enum not yet updated (will be done in Task 3). If other errors appear, fix them now.

- [ ] **Step 7: Commit**

```bash
git add lib/types.ts lib/schemas.ts
git commit -m "feat: extend ToneStyle with 5 RESELER-only tones and FREE_TONES/RESELER_TONES constants"
```

---

## Task 2: Delete dead code — ToneSelector.tsx

**Files:**
- Delete: `components/ToneSelector.tsx`

`ToneSelector.tsx` is imported nowhere and contains a `TONE_RECOMMENDATIONS` typed `as const` that only covers 3 tones — after Task 1 it will cause a TypeScript compile error.

- [ ] **Step 1: Verify ToneSelector.tsx is not imported anywhere**

```bash
grep -r "ToneSelector" "/Users/I543168/AI Based Projects/Marketplace Assistant/components" "/Users/I543168/AI Based Projects/Marketplace Assistant/app" 2>/dev/null | grep -v "ToneSelector.tsx"
```

Expected: no output. If any import is found, investigate before deleting.

- [ ] **Step 2: Delete the file**

```bash
rm "/Users/I543168/AI Based Projects/Marketplace Assistant/components/ToneSelector.tsx"
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete unused ToneSelector.tsx (dead code)"
```

---

## Task 3: Update Prisma schema and push to database

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add 5 values to `ToneStyle` enum in `prisma/schema.prisma`**

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
}
```

- [ ] **Step 2: Push schema to database**

Use the pooler URL for both variables (direct port 5432 is blocked on this network):

```bash
cd "/Users/I543168/AI Based Projects/Marketplace Assistant"
POOLER_URL=$(grep "DATABASE_URL" .env.local | head -1 | sed 's/DATABASE_URL="\(.*\)"/\1/')
DIRECT_URL="$POOLER_URL" DATABASE_URL="$POOLER_URL" npx prisma db push
```

Expected output: `🚀 Your database is now in sync with your Prisma schema.`

- [ ] **Step 3: Verify Prisma client regenerated**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero TypeScript errors (ToneSelector deleted, Prisma enum updated).

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add 5 new ToneStyle enum values to Prisma schema"
```

---

## Task 4: Backend — plan gate in generate-ad API

**Files:**
- Modify: `app/api/generate-ad/route.ts`

The 403 check must go after `validationResult.data` is parsed and after the image limit check for authenticated users, but before `consumeCredit`. The `RESELER_TONES` constant is imported from `lib/types.ts`.

- [ ] **Step 1: Add import for `RESELER_TONES` at the top of `app/api/generate-ad/route.ts`**

```typescript
import { RESELER_TONES } from "@/lib/types";
```

- [ ] **Step 2: Add plan gate after image limit check (around line 61), inside the `if (session?.user?.id)` block**

Insert after the image limit check and before `consumeCredit`:

```typescript
// Enforce RESELER-only tones
if (RESELER_TONES.includes(validatedData.tone) && (session.user.plan ?? "FREE") !== "RESELER") {
    return NextResponse.json(
        {
            isValid: false,
            error: "Ten styl komunikacji dostępny jest tylko w planie Reseler.",
        },
        { status: 403 }
    );
}
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add "app/api/generate-ad/route.ts"
git commit -m "feat: add backend 403 gate for RESELER-only tones in generate-ad"
```

---

## Task 5: Backend — extend tone enum in templates API

**Files:**
- Modify: `app/api/templates/route.ts`
- Modify: `app/api/templates/[id]/route.ts`

Both files have local Zod schemas with `z.enum(["professional", "friendly", "casual"])` for `tone`. Replace with the shared `ToneStyleSchema`.

- [ ] **Step 1: Update `app/api/templates/route.ts`**

Add import at top:
```typescript
import { ToneStyleSchema } from "@/lib/schemas";
```

In `createTemplateSchema`, replace:
```typescript
// Before:
tone: z.enum(["professional", "friendly", "casual"]),

// After:
tone: ToneStyleSchema,
```

Remove the unused `ToneStyle` import from `@prisma/client` if it's only used for the cast (check — it's also used in `tone: tone as ToneStyle` on line 76, so keep it).

- [ ] **Step 2: Update `app/api/templates/[id]/route.ts`**

Add import at top:
```typescript
import { ToneStyleSchema } from "@/lib/schemas";
```

In `updateTemplateSchema`, replace:
```typescript
// Before:
tone: z.enum(["professional", "friendly", "casual"]).optional(),

// After:
tone: ToneStyleSchema.optional(),
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add "app/api/templates/route.ts" "app/api/templates/[id]/route.ts"
git commit -m "fix: extend tone enum to all 8 values in templates API routes"
```

---

## Task 6: UI — update ProductForm with locked RESELER tones

**Files:**
- Modify: `components/ProductForm.tsx`

The tone selector currently iterates `["professional", "friendly", "casual"]`. Replace with two groups: `FREE_TONES` (always active) and `RESELER_TONES` (locked for non-RESELER with Crown icon + tooltip).

- [ ] **Step 1: Add imports to `ProductForm.tsx`**

```typescript
import { Crown } from "lucide-react";
import { FREE_TONES, RESELER_TONES } from "@/lib/types";
```

- [ ] **Step 2: Add `userPlan` to `ProductFormProps` interface**

```typescript
interface ProductFormProps {
    // ... existing props ...
    userPlan: string;
}
```

- [ ] **Step 3: Add `userPlan` to function destructuring**

```typescript
export function ProductForm({
    // ... existing params ...
    userPlan,
}: ProductFormProps) {
```

- [ ] **Step 4: Add tooltip state and timer ref inside the component**

```typescript
const [tooltipTone, setTooltipTone] = useState<ToneStyle | null>(null);
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
}, []);
```

Make sure `useState`, `useRef`, `useEffect` are imported from `"react"`.

- [ ] **Step 5: Add tooltip handler function**

```typescript
const handleLockedToneClick = (tone: ToneStyle) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTooltipTone(tone);
    timerRef.current = setTimeout(() => setTooltipTone(null), 2000);
};
```

- [ ] **Step 6: Replace the tone selector JSX**

Replace the existing `{(["professional", "friendly", "casual"] as ToneStyle[]).map(...)}` block with:

```tsx
<div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Wybór stylu komunikacji">
    {FREE_TONES.map((tone) => {
        const isSelected = selectedTone === tone;
        return (
            <button
                key={tone}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onToneChange(tone)}
                className={cn(
                    "px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                )}
            >
                {TONE_STYLE_NAMES[tone]}
            </button>
        );
    })}
    {RESELER_TONES.map((tone) => {
        const isLocked = userPlan !== "RESELER";
        const isSelected = selectedTone === tone;
        if (isLocked) {
            return (
                <div key={tone} className="relative">
                    <button
                        type="button"
                        onClick={() => handleLockedToneClick(tone)}
                        className={cn(
                            "px-4 py-1.5 rounded-full border text-sm transition-all duration-200",
                            "flex items-center gap-1.5 cursor-not-allowed",
                            "border-violet-100 bg-violet-50 text-violet-300"
                        )}
                        aria-disabled="true"
                    >
                        <Crown className="h-3 w-3" />
                        {TONE_STYLE_NAMES[tone]}
                    </button>
                    {tooltipTone === tone && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs whitespace-nowrap z-10 pointer-events-none">
                            Dostępne w planie Reseler
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                        </div>
                    )}
                </div>
            );
        }
        return (
            <button
                key={tone}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onToneChange(tone)}
                className={cn(
                    "px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                )}
            >
                {TONE_STYLE_NAMES[tone]}
            </button>
        );
    })}
</div>
```

- [ ] **Step 7: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 8: Commit**

```bash
git add components/ProductForm.tsx
git commit -m "feat: add RESELER-only tone buttons with Crown icon and tooltip in ProductForm"
```

---

## Task 7: UI — pass userPlan to ProductForm from AdGeneratorForm + always-visible template picker

**Files:**
- Modify: `components/AdGeneratorForm.tsx`

Two changes in this file:
1. Pass `userPlan` to `<ProductForm>`
2. Always show template picker for authenticated users (3 states)

- [ ] **Step 1: Pass `userPlan` to `<ProductForm>`**

Find the `<ProductForm` JSX (around line 563) and add:
```tsx
userPlan={session?.user?.plan ?? "FREE"}
```

- [ ] **Step 2: Replace the template picker conditional**

Current code (around line 531):
```tsx
{status === "authenticated" && session?.user?.plan === "RESELER" && templates.length > 0 && (
    <div className="space-y-2 mb-6">
        ...
    </div>
)}
```

Replace with a 3-state conditional:

```tsx
{status === "authenticated" && (
    <div className="space-y-2 mb-6">
        <label className="text-sm font-medium leading-none">
            Szablon
        </label>
        {session?.user?.plan === "RESELER" ? (
            <div className="flex items-center gap-2">
                <select
                    id="template-select"
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className="h-10 flex-1 border border-input rounded-lg px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                >
                    <option value="">Brak (domyślny)</option>
                    {templates.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                {selectedTemplateId && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 shrink-0"
                        onClick={() => setEditingTemplate(templates.find((t) => t.id === selectedTemplateId) ?? null)}
                        aria-label="Edytuj szablon"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
                {templates.length === 0 && (
                    <a
                        href="/dashboard/templates"
                        className="text-xs text-primary hover:underline shrink-0"
                    >
                        Utwórz pierwszy szablon →
                    </a>
                )}
            </div>
        ) : (
            <div className="flex items-center justify-between h-10 px-3 border border-input rounded-lg bg-muted opacity-50 cursor-not-allowed">
                <span className="text-sm text-muted-foreground">Brak (domyślny)</span>
                <span className="flex items-center gap-1 text-xs text-violet-500 font-medium">
                    <Crown className="h-3.5 w-3.5" />
                    Plan Reseler
                </span>
            </div>
        )}
    </div>
)}
```

- [ ] **Step 3: Add `Crown` to lucide-react imports if not already present**

```typescript
import { ..., Crown } from "lucide-react";
```

- [ ] **Step 4: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add components/AdGeneratorForm.tsx
git commit -m "feat: always-visible template picker with RESELER lock, pass userPlan to ProductForm"
```

---

## Task 8: UI — update LandingForm inline tone selector

**Files:**
- Modify: `components/LandingForm.tsx`

`LandingForm` has its own inline tone selector at line 837. Update it with the same logic as `ProductForm` (Task 6). The plan determines userPlan internally: guests = `"FREE"`, authenticated = `session?.user?.plan ?? "FREE"`.

- [ ] **Step 1: Add imports to `LandingForm.tsx`**

```typescript
import { Crown } from "lucide-react";
import { FREE_TONES, RESELER_TONES } from "@/lib/types";
```

- [ ] **Step 2: Add tooltip state and timer ref inside the component (same pattern as ProductForm)**

```typescript
const [tooltipTone, setTooltipTone] = useState<ToneStyle | null>(null);
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
}, []);
```

- [ ] **Step 3: Add `handleLockedToneClick` inside the component**

```typescript
const handleLockedToneClick = (tone: ToneStyle) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTooltipTone(tone);
    timerRef.current = setTimeout(() => setTooltipTone(null), 2000);
};
```

- [ ] **Step 4: Compute `userPlan` locally inside the component**

```typescript
const userPlan = status === "authenticated" ? (session?.user?.plan ?? "FREE") : "FREE";
```

- [ ] **Step 5: Replace the inline tone selector at line 837**

Replace `{(["professional", "friendly", "casual"] as ToneStyle[]).map((tone) => { ... })}` with the same two-group JSX as in ProductForm (Task 6, Step 6) — use `setSelectedTone(tone)` instead of `onToneChange(tone)`, and reference the local `userPlan` and `handleLockedToneClick`.

- [ ] **Step 6: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 7: Commit**

```bash
git add components/LandingForm.tsx
git commit -m "feat: add RESELER-only tone buttons with lock UI in LandingForm"
```

---

## Task 9: UI — update TemplateFormModal tone selector

**Files:**
- Modify: `components/TemplateFormModal.tsx`

The tone pill selector at line 199 has `["professional", "friendly", "casual"]` hardcoded. Extend to all 8 tones. No locking needed — `TemplateFormModal` is only accessible to RESELER users.

- [ ] **Step 1: Add import for `FREE_TONES` and `RESELER_TONES`**

```typescript
import { FREE_TONES, RESELER_TONES, TONE_STYLE_NAMES } from "@/lib/types";
```

(TONE_STYLE_NAMES is already imported — just add the new constants)

- [ ] **Step 2: Replace the hardcoded array at line 199**

```tsx
// Before:
{(["professional", "friendly", "casual"] as ToneStyle[]).map((t) => (

// After:
{([...FREE_TONES, ...RESELER_TONES] as ToneStyle[]).map((t) => (
```

No other changes needed in this file — the button rendering and `setTone` logic work with any `ToneStyle`.

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add components/TemplateFormModal.tsx
git commit -m "feat: extend tone selector in TemplateFormModal to all 8 tones"
```

---

## Task 10: AI prompts — extend getToneInstructions in openai.ts

**Files:**
- Modify: `lib/openai.ts`

The `toneMap` object in `getToneInstructions` currently has 3 keys. Add 5 new cases. The function currently returns `toneMap[tone]` — TypeScript will require all `ToneStyle` values to have entries.

- [ ] **Step 1: Add 5 new entries to `toneMap` in `getToneInstructions`**

```typescript
enthusiastic: `## TON: ENTHUSIASTIC (Entuzjastyczny)
- Ton energetyczny, pełen entuzjazmu i emocji
- Wykrzyknienia dozwolone i pożądane (1-2 na akapit)
- Wyrażenia emocjonalne: "Niesamowita okazja!", "Musisz to zobaczyć!"
- Podkreśl wyjątkowość i wartość produktu
- Emoji mile widziane (2-3, dopasowane do kontekstu)
- Zaraźliwy entuzjazm — kupujący powinien poczuć ekscytację
- Przykłady fraz:
  * Wprowadzenie: "Niesamowita okazja — sprzedam [produkt]!", "To must-have!"
  * Stan: "W idealnym stanie — wygląda jak nowy!", "Absolutnie bez zarzutu!"
  * CTA: "Nie czekaj, to zniknie szybko!", "Pisz teraz, zanim ktoś inny skorzysta!"
  * Negocjacje: "Cena świetna, ale coś ugadamy!"
  * Za darmo: "Oddaję za darmo — prawdziwa gratka!"`,

funny: `## TON: FUNNY (Zabawny)
- Lekki humor i dowcip sytuacyjny nawiązujący do produktu
- Żarty nie mogą podważać wiarygodności ani stanu produktu
- Luźny, konwersacyjny styl z przymrużeniem oka
- Emoji dozwolone (2-3, kompatybilne z humorem)
- Kupujący powinien się uśmiechnąć lub roześmiać
- Unikaj żartów wymuszonych lub niezwiązanych z produktem
- Przykłady fraz:
  * Wprowadzenie: "Sprzedam [produkt], bo [zabawny powód]", "Mój [produkt] szuka nowego domu (obiecuję, że jest niegroźny)"
  * Stan: "Stan bardzo dobry — sam się zdziwiłem", "Używany, ale z klasą"
  * CTA: "Pisz śmiało, nie gryzę 😄", "Pytania? Odpowiem szybciej niż dostawa ekspresowa!"
  * Negocjacje: "Cena elastyczna jak moje podejście do poniedziałków"
  * Za darmo: "Za free — bo życie jest za krótkie na zbędne rzeczy w szafie"`,

technical: `## TON: TECHNICAL (Techniczny)
- Styl dokumentacyjny: precyzja, dane, specyfikacje
- Każde zdanie niesie konkretną informację — parametry, materiały, wymiary
- ZERO ozdobników, metafor, emocji
- Bullet points do opisu cech technicznych
- Terminologia branżowa dozwolona i pożądana
- Nie używaj przymiotników wartościujących bez podstaw ("super", "świetny") — tylko fakty
- Przykłady fraz:
  * Wprowadzenie: "Do sprzedaży: [produkt] — [model/parametr kluczowy]"
  * Stan: "Stan techniczny: dobry. Brak uszkodzeń mechanicznych. Śladowe zarysowania."
  * CTA: "Kontakt mailowy lub SMS. Możliwość oględzin."
  * Negocjacje: "Cena: [X] zł. Negocjacja możliwa przy odbiorze osobistym."
  * Za darmo: "Przekazanie bezpłatne. Odbiór własny."`,

persuasive: `## TON: PERSUASIVE (Przekonujący)
- Koncentracja na korzyściach kupującego, nie cechach produktu
- Argumenty: "dzięki temu zyskasz...", "oszczędzisz...", "będziesz mógł..."
- Social proof: "bardzo popularny model", "ceniony przez użytkowników"
- Poczucie pilności: "ostatnia sztuka", "okazja cenowa", "nie trafi się drugi raz"
- Wyraźne CTA zachęcające do działania teraz
- Balans między perswazją a wiarygodnością — nie przesadzaj
- Przykłady fraz:
  * Wprowadzenie: "Oto okazja, której szukałeś — [produkt] w świetnej cenie"
  * Stan: "Zadbany, gotowy do użytku od zaraz — żadnych ukrytych kosztów"
  * CTA: "Napisz teraz i umów odbiór jeszcze dziś!", "Zostało tylko [X] — nie zwlekaj!"
  * Negocjacje: "Cena już obniżona — ostatnie słowo"
  * Za darmo: "Zupełnie za darmo — oszczędzasz [X] zł w porównaniu do sklepu"`,

concise: `## TON: CONCISE (Zwięzły)
- Minimum słów, maksimum informacji
- Krótkie zdania lub bullet points zamiast akapitów
- Tytuł = najważniejsza cecha + stan
- Opis = tylko niezbędne fakty, zero lania wody
- Zero wypełniaczy: "warto", "polecam", "okazja", "zapraszam"
- Jedna myśl = jedno zdanie lub jeden bullet
- Przykłady fraz:
  * Wprowadzenie: "[Produkt]. [Stan]. [Cena]."
  * Stan: "Stan dobry.", "Bez uszkodzeń.", "Ślad użytkowania."
  * CTA: "Pisz.", "SMS."
  * Negocjacje: "Cena do rozmowy."
  * Za darmo: "Gratis. Odbiór osobisty."`,
```

- [ ] **Step 2: Also update `TONE_VOCABULARY` constant to include the new tones** (optional but helpful for AI consistency)

Add a note after the existing table:

```typescript
const TONE_VOCABULARY = `## SŁOWNICTWO WG TONU

| Kontekst | Professional | Friendly | Casual |
|----------|--------------|----------|--------|
| Wprowadzenie | "Oferuję do sprzedaży" | "Sprzedam" | "Mam do oddania" |
| Stan | "W doskonałym stanie" | "Bardzo dobry stan" | "Mega stan" |
| Kontakt | "Zapraszam do kontaktu" | "Pisz śmiało!" | "Gadaj!" |
| Pytania | "W razie pytań proszę o kontakt" | "Masz pytania? Napisz!" | "Pytania? Pisz!" |
| Negocjacje | "Cena do negocjacji" | "Cena do dogadania" | "Cena do gada" |
| Za darmo | "Bezpłatnie do odbioru" | "Oddam za darmo!" | "Za free" |

Dodatkowe tony RESELER:
- enthusiastic: wykrzyknienia, emocje, poczucie ekscytacji
- funny: lekki humor nawiązujący do produktu, emoji
- technical: tylko fakty i dane, zero ozdobników
- persuasive: korzyści kupującego, CTA, pilność
- concise: bullet points, krótkie zdania, zero wypełniaczy
`;
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add lib/openai.ts
git commit -m "feat: add AI tone instructions for 5 new RESELER tones in getToneInstructions"
```

---

## Task 11: AI rules — update platform rules files

**Files:**
- Modify: `lib/rules/olx_rules.md`
- Modify: `lib/rules/allegro_lokalnie_rules.md`
- Modify: `lib/rules/facebook_marketplace_rules.md`
- Modify: `lib/rules/vinted_rules.md`

Add a section for each of the 5 new tones to every platform rules file. Each section should have platform-specific phrasing examples.

- [ ] **Step 1: Add to `lib/rules/olx_rules.md`**

Append after the existing `## TON: CASUAL` section:

```markdown
## TON: ENTHUSIASTIC (Entuzjastyczny)
### Frazowanie
- Wprowadzenie: "Niesamowita okazja! Sprzedam [produkt]!"
- Stan: "Idealny stan — sami zobaczcie na zdjęciach!"
- CTA: "Nie czekajcie, to zniknie szybko! Piszcie!"
- Negocjacje: "Cena super, ale coś ugadamy!"
- Za darmo: "Oddaję za darmo — prawdziwa gratka, piszcie szybko!"

## TON: FUNNY (Zabawny)
### Frazowanie
- Wprowadzenie: "Sprzedam [produkt], bo [zabawny powód, np. 'żona kazała']"
- Stan: "Stan dobry — sam się zdziwiłem jak to u mnie przetrwało"
- CTA: "Pisz, nie gryzę 😄 (chyba że późno)"
- Negocjacje: "Cena elastyczna jak moje podejście do poniedziałków"
- Za darmo: "Za darmo, bo życie za krótkie na stare graty w garażu"

## TON: TECHNICAL (Techniczny)
### Frazowanie
- Wprowadzenie: "Do sprzedaży: [produkt] [model/parametry]"
- Stan: "Stan techniczny: [ocena]. [Ewentualne usterki lub ich brak]."
- CTA: "Kontakt SMS lub chat. Możliwe oględziny."
- Negocjacje: "Cena: [X] zł. Negocjacja przy odbiorze."
- Za darmo: "Przekazanie bezpłatne. Odbiór własny, [miasto]."

## TON: PERSUASIVE (Przekonujący)
### Frazowanie
- Wprowadzenie: "Szukasz [produktu] w dobrej cenie? Masz go!"
- Stan: "Zadbany, gotowy do użytku — żadnych niespodzianek"
- CTA: "Napisz teraz i umów odbiór jeszcze dziś!"
- Negocjacje: "Cena już obniżona — ostatnia szansa w tej kwocie"
- Za darmo: "Zupełnie za darmo — oszczędzasz realne pieniądze"

## TON: CONCISE (Zwięzły)
### Frazowanie
- Wprowadzenie: "[Produkt]. [Stan]. [Cena]."
- Stan: "Stan dobry." / "Bez usterek."
- CTA: "Pisz." / "SMS."
- Negocjacje: "Cena do rozmowy."
- Za darmo: "Gratis. Odbiór."
```

- [ ] **Step 2: Add to `lib/rules/allegro_lokalnie_rules.md`**

Read the file first to find the right insertion point, then append after the last existing tone section:

```markdown
## TON: ENTHUSIASTIC (Entuzjastyczny)
### Frazowanie
- Wprowadzenie: "Fantastyczna okazja! Oferuję [produkt] w świetnym stanie!"
- Stan: "Stan idealny — zachwyci każdego wymagającego kupującego!"
- CTA: "Nie przegap tej oferty! Zapraszam do kontaktu!"
- Negocjacje: "Cena już atrakcyjna, ale możemy porozmawiać!"
- Za darmo: "Niesamowita oferta — oddaję za darmo! Piszcie szybko!"

## TON: FUNNY (Zabawny)
### Frazowanie
- Wprowadzenie: "Sprzedam [produkt] — szuka nowego właściciela, który doceni jego charakter"
- Stan: "Stan bardzo dobry, jak na swoje lata całkiem dziarski"
- CTA: "Pytania? Chętnie odpiszę 😊 (i nie ugryzę)"
- Negocjacje: "Cena negocjowalna — bo optymizm popłaca"
- Za darmo: "Bezpłatnie, bo minimalizm to nowe bogactwo"

## TON: TECHNICAL (Techniczny)
### Frazowanie (Allegro — szczegółowe parametry, kompatybilność)
- Wprowadzenie: "[Produkt] [marka] [model]. Rok produkcji: [X]. Parametry: [lista]."
- Stan: "Stan: [ocena]. [Opis ewentualnych śladów]. Sprawny."
- Kompatybilność: "Kompatybilny z: [lista modeli/systemów]."
- CTA: "Kontakt przez wiadomości Allegro. Faktura możliwa."
- Za darmo: "Brak kosztów. Odbiór osobisty, [miasto]."

## TON: PERSUASIVE (Przekonujący)
### Frazowanie
- Wprowadzenie: "Profesjonalny [produkt] w cenie, której nie znajdziesz taniej w sklepie"
- Stan: "Używany, ale w pełni sprawny — oszczędzasz względem nowego"
- CTA: "Zamów teraz — wysyłka tego samego dnia!"
- Negocjacje: "Cena skalkulowana uczciwie — ostatnie słowo"
- Za darmo: "Bezpłatnie do odbioru — wartość katalogowa: [X] zł"

## TON: CONCISE (Zwięzły)
### Frazowanie
- Wprowadzenie: "[Produkt] [model]. [Stan]. [Cena] zł."
- Stan: "[Ocena stanu]. [Ewentualne uwagi]."
- CTA: "Kontakt: wiadomość."
- Negocjacje: "Negocjacja możliwa."
- Za darmo: "Bezpłatnie. Odbiór własny."
```

- [ ] **Step 3: Add to `lib/rules/facebook_marketplace_rules.md`**

```markdown
## TON: ENTHUSIASTIC (Entuzjastyczny)
### Frazowanie (FB — ciepły, społecznościowy entuzjazm)
- Wprowadzenie: "Hej! Mam dla Was coś niesamowitego — [produkt]! 🎉"
- Stan: "Wygląda jakby dopiero wyszedł ze sklepu — jestem zachwycony stanem!"
- CTA: "Piszcie w wiadomości, odpiszę od razu! Nie dajcie przepaść tej okazji!"
- Negocjacje: "Cena fair, ale dla miłej osoby zawsze coś się znajdzie 😊"
- Za darmo: "Oddaję za DARMO! Tak, dobrze czytacie! Piszcie szybko! 🙌"

## TON: FUNNY (Zabawny)
### Frazowanie (FB — luźny, sąsiedzki humor)
- Wprowadzenie: "Mój [produkt] szuka nowego domu 😄 Jest grzeczny, nie gryzie"
- Stan: "Stan bardzo dobry — przeżył ze mną wiele, ale nie widać po nim lat"
- CTA: "Napiszcie! Odpowiem szybciej niż sąsiad przy pizzy 🍕"
- Negocjacje: "Cena do dogadania — jestem człowiekiem, nie automatem"
- Za darmo: "Za free bo szafa płacze 😂 Kto pierwszy, ten lepszy!"

## TON: TECHNICAL (Techniczny)
### Frazowanie (FB — mniej formalny niż Allegro, ale z danymi)
- Wprowadzenie: "[Produkt] [model/parametry]. Stan: [ocena]."
- Dane: "Wymiary: [X]. Materiał: [Y]. Kolor: [Z]."
- CTA: "Pytania w wiadomości. Odbiór: [miasto/dzielnica]."
- Negocjacje: "Cena: [X] zł. Możliwa rozmowa przy odbiorze."
- Za darmo: "Bezpłatnie. Odbiór własny, okolice [dzielnica]."

## TON: PERSUASIVE (Przekonujący)
### Frazowanie (FB — nastawiony na relację i korzyść)
- Wprowadzenie: "Nie szukaj dalej — tu jest dokładnie to, czego potrzebujesz!"
- Stan: "W pełni sprawny, zadbany — możesz używać od razu, zero inwestycji"
- CTA: "Napisz teraz — umówimy się na odbiór kiedy Ci pasuje!"
- Negocjacje: "Podaję uczciwą cenę — nie kombinuję"
- Za darmo: "Kompletnie za darmo — oszczędzasz realne pieniądze, działaj!"

## TON: CONCISE (Zwięzły)
### Frazowanie
- Wprowadzenie: "[Produkt]. [Stan]."
- Dane: "[Najważniejszy parametr]. [Cena] zł."
- CTA: "Wiadomość."
- Za darmo: "Free. Odbiór osobisty."
```

- [ ] **Step 4: Add to `lib/rules/vinted_rules.md`**

```markdown
## TON: ENTHUSIASTIC (Entuzjastyczny)
### Frazowanie (Vinted — fashion-focused entuzjazm)
- Wprowadzenie: "Absolutnie kocham ten [produkt] ale czas na nowego właściciela! ✨"
- Stan: "Wygląda jak nowy! Dosłownie nie widać, że używany!"
- CTA: "Piszcie! Wysyłam szybko, pakuję starannie! 💌"
- Negocjacje: "Cena już niska, ale umówmy się 🙂"
- Za darmo: "Oddaję za darmo kochance dobrego stylu! 🎁"

## TON: FUNNY (Zabawny)
### Frazowanie (Vinted — lekki humor modowy)
- Wprowadzenie: "Ten [produkt] jest za dobry żeby leżeć w szafie. Szuka kogoś ambitniejszego 😄"
- Stan: "Stan super — nie miałam serca go znosić, teraz Twoja kolej"
- CTA: "Pytaj śmiało! Nie ugryzę, obiecuję 🐾"
- Negocjacje: "Cena negocjowalna dla osoby z dobrym gustem 😉"
- Za darmo: "Za darmo bo KonMari powiedziała żeby oddać 😂"

## TON: TECHNICAL (Techniczny)
### Frazowanie (Vinted — skład, rozmiarówka, stan tkaniny)
- Wprowadzenie: "[Marka] [typ produktu]. Rozmiar: [X]. Skład: [materiał]%."
- Stan tkaniny: "Stan: [ocena]. [Opis prań/pielęgnacji]. [Ewentualne defekty lub ich brak]."
- Wymiary: "Długość: [X] cm. Szerokość w ramionach: [X] cm. [Inne wymiary]."
- CTA: "Wysyłka: [metoda]. Pytania o pomiar — odpiszę."
- Za darmo: "Bezpłatnie. Wysyłka na koszt odbioru."

## TON: PERSUASIVE (Przekonujący)
### Frazowanie (Vinted — korzyści stylistyczne)
- Wprowadzenie: "Szukasz [produktu] który zrobi wrażenie? Właśnie go znalazłaś."
- Stan: "Zadbany, bez defektów — nosić od razu, bez prania i poprawek"
- CTA: "Kup teraz — inne osoby już pytają!"
- Negocjacje: "Cena uczciwa względem stanu — warto!"
- Za darmo: "Za darmo — wartość [X] zł, Twoja oszczędność realna"

## TON: CONCISE (Zwięzły)
### Frazowanie
- Wprowadzenie: "[Marka] [typ]. Rozmiar [X]. [Stan]."
- Dane: "Skład: [materiał]. [Ewentualny defekt]."
- Cena: "[X] zł. Wysyłka: [Y] zł."
- Za darmo: "Gratis + koszt wysyłki."
```

- [ ] **Step 5: Commit**

```bash
git add lib/rules/
git commit -m "feat: add RESELER tone sections to all 4 platform rules files"
```

---

## Task 12: Final verification

- [ ] **Step 1: Full TypeScript check**

```bash
cd "/Users/I543168/AI Based Projects/Marketplace Assistant"
npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 2: Check no "Do ustalenia" or hardcoded 3-tone arrays remain**

```bash
grep -rn "\"professional\", \"friendly\", \"casual\"" components/ app/ lib/ --include="*.ts" --include="*.tsx"
```

Expected: no output (all replaced with `FREE_TONES` / `RESELER_TONES` or `ToneStyleSchema`).

- [ ] **Step 3: Verify ToneSelector.tsx is gone**

```bash
ls components/ToneSelector.tsx 2>/dev/null && echo "EXISTS - DELETE IT" || echo "OK - deleted"
```

Expected: `OK - deleted`

- [ ] **Step 4: Push to remote**

```bash
git push
```
