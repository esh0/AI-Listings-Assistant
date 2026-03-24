# Tone Unlock for Starter Plan — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make advanced tones (enthusiastic, funny, technical, persuasive, concise) available to STARTER plan users — only FREE remains locked.

**Architecture:** Single guard condition change across 5 files. Rename `RESELER_TONES` → `ADVANCED_TONES` in `lib/types.ts` and update all import sites. Change lock condition from `userPlan !== "RESELER"` to `userPlan === "FREE"` in UI components. Change API gate from `plan !== "RESELER"` to `plan === "FREE"`. Update tooltip text and pricing copy.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS

---

### Task 1: Rename constant and update guard in `lib/types.ts` and API

**Files:**
- Modify: `lib/types.ts:23` — rename `RESELER_TONES` → `ADVANCED_TONES`
- Modify: `app/api/generate-ad/route.ts:9,65-72` — update import + gate condition + error message

**Context:** `lib/types.ts` exports `RESELER_TONES` which is imported in multiple files. `app/api/generate-ad/route.ts` line 9 imports it and line 65 uses it in a guard: `RESELER_TONES.includes(validatedData.tone) && plan !== "RESELER"`.

- [ ] **Step 1: Update `lib/types.ts`**

In `lib/types.ts` line 23, rename the export:
```typescript
// Before (line 23):
export const RESELER_TONES: ToneStyle[] = ["enthusiastic", "funny", "technical", "persuasive", "concise"];

// After:
export const ADVANCED_TONES: ToneStyle[] = ["enthusiastic", "funny", "technical", "persuasive", "concise"];
```

- [ ] **Step 2: Update `app/api/generate-ad/route.ts`**

Line 9: change import from `RESELER_TONES` to `ADVANCED_TONES`.
Lines 65-72: change guard condition and error message:
```typescript
// Before:
import { RESELER_TONES } from "@/lib/types";
// ...
if (RESELER_TONES.includes(validatedData.tone) && plan !== "RESELER") {
    return NextResponse.json(
        { isValid: false, error: "Ten styl komunikacji dostępny jest tylko w planie Reseler." },
        { status: 403 }
    );
}

// After:
import { ADVANCED_TONES } from "@/lib/types";
// ...
if (ADVANCED_TONES.includes(validatedData.tone) && plan === "FREE") {
    return NextResponse.json(
        { isValid: false, error: "Ten styl komunikacji dostępny jest w planach Starter i Reseler." },
        { status: 403 }
    );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd "/Users/I543168/AI Based Projects/Marketplace Assistant"
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors about `RESELER_TONES` (may show other pre-existing errors — that's OK).

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts app/api/generate-ad/route.ts
git commit -m "feat: rename RESELER_TONES→ADVANCED_TONES, update API gate to plan===FREE"
```

---

### Task 2: Update `components/ProductForm.tsx` lock condition and tooltip

**Files:**
- Modify: `components/ProductForm.tsx:4,20,159` — update import, lock condition, tooltip text

**Context:** `ProductForm.tsx` line 20 imports `RESELER_TONES`, line 158 starts the RESELER tones loop, line 159 checks `userPlan !== "RESELER"` as the lock condition, and line 179 shows tooltip text "Dostępne w planie Reseler".

- [ ] **Step 1: Update import**

Line 20: change `RESELER_TONES` → `ADVANCED_TONES`:
```typescript
// Before:
import {
    ...
    RESELER_TONES,
} from "@/lib/types";

// After:
import {
    ...
    ADVANCED_TONES,
} from "@/lib/types";
```

- [ ] **Step 2: Update loop and lock condition**

Find the section starting at line 158 (`{RESELER_TONES.map((tone) => {`). Change it:
```typescript
// Before:
{RESELER_TONES.map((tone) => {
    const isLocked = userPlan !== "RESELER";

// After:
{ADVANCED_TONES.map((tone) => {
    const isLocked = userPlan === "FREE";
```

- [ ] **Step 3: Update tooltip text**

Line 179 (inside the locked button, tooltip div):
```typescript
// Before:
Dostępne w planie Reseler

// After:
Dostępne w planach Starter i Reseler
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors related to this file.

- [ ] **Step 5: Commit**

```bash
git add components/ProductForm.tsx
git commit -m "feat: unlock advanced tones for STARTER in ProductForm"
```

---

### Task 3: Update `components/LandingForm.tsx` (identical pattern)

**Files:**
- Modify: `components/LandingForm.tsx` — same changes as ProductForm

**Context:** `LandingForm.tsx` is used on the public home page (`app/page.tsx`). It has the identical tone lock pattern as `ProductForm.tsx` — `RESELER_TONES` import, `userPlan !== "RESELER"` lock condition, and "Dostępne w planie Reseler" tooltip. Find the exact lines by searching for the pattern.

- [ ] **Step 1: Verify the pattern exists**

```bash
grep -n "RESELER_TONES\|userPlan !== .RESELER\|Dostępne w planie Reseler" components/LandingForm.tsx
```
Expected: shows line numbers for import, lock condition, and tooltip text.

- [ ] **Step 2: Apply identical changes**

- Change import: `RESELER_TONES` → `ADVANCED_TONES`
- Change loop: `{RESELER_TONES.map(` → `{ADVANCED_TONES.map(`
- Change lock: `userPlan !== "RESELER"` → `userPlan === "FREE"`
- Change tooltip: `"Dostępne w planie Reseler"` → `"Dostępne w planach Starter i Reseler"`

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add components/LandingForm.tsx
git commit -m "feat: unlock advanced tones for STARTER in LandingForm"
```

---

### Task 4: Update `components/TemplateFormModal.tsx` import rename

**Files:**
- Modify: `components/TemplateFormModal.tsx:15` — rename import only (no lock exists here)

**Context:** `TemplateFormModal.tsx` is on the RESELER-only templates page, so no lock guard is needed. Only the import name changes.

- [ ] **Step 1: Update import**

Line 15: change `RESELER_TONES` → `ADVANCED_TONES`.

- [ ] **Step 2: Update usage**

Find `RESELER_TONES` in the tone loop (line ~201): `[...FREE_TONES, ...RESELER_TONES]` → `[...FREE_TONES, ...ADVANCED_TONES]`

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add components/TemplateFormModal.tsx
git commit -m "chore: rename RESELER_TONES→ADVANCED_TONES import in TemplateFormModal"
```

---

### Task 5: Update pricing pages copy

**Files:**
- Modify: `app/pricing/page.tsx:37,57` — update STARTER and RESELER features arrays
- Modify: `app/dashboard/pricing/page.tsx` — same changes

**Context:** In `app/pricing/page.tsx`, the `PLANS` constant (line 13) has feature arrays. STARTER has `"3 style tonu"` (line 39), RESELER has `"3 style tonu"` (line 57). Both need to be updated. The dashboard pricing page at `app/dashboard/pricing/page.tsx` is an exact mirror — check its line numbers with grep first.

- [ ] **Step 1: Update `app/pricing/page.tsx`**

In the `PLANS` constant, find the STARTER entry and change its feature:
```typescript
// STARTER features — Before:
"3 style tonu",

// After:
"Wszystkie style tonu",
```

In the RESELER entry, same change:
```typescript
// RESELER features — Before:
"3 style tonu",

// After:
"Wszystkie style tonu",
```

FREE stays as `"3 style tonu"` — no change.

- [ ] **Step 2: Update `app/dashboard/pricing/page.tsx`**

```bash
grep -n "style tonu" "app/dashboard/pricing/page.tsx"
```
Apply the same two changes (STARTER and RESELER → "Wszystkie style tonu").

- [ ] **Step 3: Verify TypeScript compiles and lint passes**

```bash
npx tsc --noEmit 2>&1 | head -20
npm run lint 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add "app/pricing/page.tsx" "app/dashboard/pricing/page.tsx"
git commit -m "feat: update pricing copy — STARTER/RESELER get Wszystkie style tonu"
```

---

### Task 6: Verify no other `RESELER_TONES` references remain

**Files:** No changes — verification only

- [ ] **Step 1: Check for remaining RESELER_TONES usage**

```bash
grep -r "RESELER_TONES" --include="*.ts" --include="*.tsx" .
```
Expected: **no output** (all renamed to `ADVANCED_TONES`).

- [ ] **Step 2: Run build to confirm no TypeScript errors**

```bash
npm run build 2>&1 | tail -20
```
Expected: Build completes without errors.

- [ ] **Step 3: Add CHANGELOG entry**

In `CHANGELOG.md`, add a new entry at the top (after the existing `## [1.3.6]` entry):
```markdown
## [1.3.7] - 2026-03-24

### Changed
- Advanced tones (enthusiastic, funny, technical, persuasive, concise) now available to STARTER plan — previously RESELER-only
- FREE users see advanced tones locked with updated tooltip "Dostępne w planach Starter i Reseler"
- API gate updated: rejects advanced tones only for FREE plan (was: non-RESELER)
- Pricing page copy updated: STARTER and RESELER now show "Wszystkie style tonu"
- Internal: `RESELER_TONES` constant renamed to `ADVANCED_TONES` across all files
```

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md
git commit -m "chore: add CHANGELOG entry for v1.3.7 — tone unlock for Starter"
```
