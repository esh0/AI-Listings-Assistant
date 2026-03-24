# New Platforms (eBay, Amazon, Etsy) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add eBay, Amazon, and Etsy as RESELER-only marketplace platforms with Polish-language listing generation.

**Architecture:** New enum values in Prisma `Platform` + TypeScript `Platform` type → new Zod enum entries in `lib/schemas.ts` and route files → new character limits in `AdResultMain.tsx` → new icons/colors in all component icon maps → new platform tiles in `ProductForm.tsx` with lock guard → new rules `.md` files already created → register rules in `lib/openai.ts`. The rules files (`lib/rules/ebay_rules.md`, `lib/rules/amazon_rules.md`, `lib/rules/etsy_rules.md`) are already committed.

**Tech Stack:** Next.js 15, TypeScript, Prisma, Tailwind CSS, lucide-react

---

### Task 1: Prisma schema + TypeScript types

**Files:**
- Modify: `prisma/schema.prisma:161-166` — add to `Platform` enum
- Modify: `lib/types.ts:2-6` — add to `Platform` union type, update all `Record<Platform, ...>` objects

**Context:** Prisma `Platform` enum is at `prisma/schema.prisma` lines 161-166. TypeScript `Platform` type is at `lib/types.ts` lines 2-6. Both must be updated. The `Record<Platform, ...>` constants (`PLATFORM_NAMES`, `PLATFORM_META`, `PLATFORM_DEFAULT_TONES`) will cause TypeScript compile errors until all 3 new entries are added.

- [ ] **Step 1: Update `prisma/schema.prisma`**

Find the `Platform` enum (lines 161-166):
```prisma
// Before:
enum Platform {
  olx
  allegro_lokalnie
  facebook_marketplace
  vinted
}

// After:
enum Platform {
  olx
  allegro_lokalnie
  facebook_marketplace
  vinted
  ebay
  amazon
  etsy
}
```

- [ ] **Step 2: Run Prisma migration**

```bash
cd "/Users/I543168/AI Based Projects/Marketplace Assistant"
DIRECT_URL=$(grep DIRECT_URL .env.local | cut -d= -f2-) DATABASE_URL=$(grep DIRECT_URL .env.local | cut -d= -f2-) npx prisma db push
```
Expected: `Your database is now in sync with your Prisma schema.`

If `.env.local` isn't readable that way, the implementer should manually set the env vars. The pooler URL must be used for both (per CLAUDE.md: port 5432 direct is blocked).

- [ ] **Step 3: Update `lib/types.ts` — Platform union type**

Lines 2-6, add 3 new values:
```typescript
export type Platform =
    | "olx"
    | "allegro_lokalnie"
    | "facebook_marketplace"
    | "vinted"
    | "ebay"
    | "amazon"
    | "etsy";
```

- [ ] **Step 4: Update `lib/types.ts` — PLATFORM_NAMES**

Lines 115-120:
```typescript
export const PLATFORM_NAMES: Record<Platform, string> = {
    olx: "OLX",
    allegro_lokalnie: "Allegro Lokalnie",
    facebook_marketplace: "FB Marketplace",
    vinted: "Vinted",
    ebay: "eBay",
    amazon: "Amazon",
    etsy: "Etsy",
};
```

- [ ] **Step 5: Update `lib/types.ts` — PLATFORM_META**

Lines 123-128:
```typescript
export const PLATFORM_META: Record<Platform, { color: string; label: string }> = {
    olx: { color: "text-orange-500", label: "OLX" },
    allegro_lokalnie: { color: "text-green-600", label: "Allegro Lokalnie" },
    facebook_marketplace: { color: "text-blue-600", label: "FB Marketplace" },
    vinted: { color: "text-teal-600", label: "Vinted" },
    ebay: { color: "text-yellow-500", label: "eBay" },
    amazon: { color: "text-yellow-600", label: "Amazon" },
    etsy: { color: "text-orange-400", label: "Etsy" },
};
```

- [ ] **Step 6: Update `lib/types.ts` — PLATFORM_DEFAULT_TONES**

Lines 149-154:
```typescript
export const PLATFORM_DEFAULT_TONES: Record<Platform, ToneStyle> = {
    olx: "casual",
    allegro_lokalnie: "professional",
    facebook_marketplace: "friendly",
    vinted: "friendly",
    ebay: "professional",
    amazon: "professional",
    etsy: "friendly",
};
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```
Expected: errors about missing platform entries in other files (AdCard, PlatformSelector, etc.) — these are expected and will be fixed in subsequent tasks. No errors in `lib/types.ts` itself.

- [ ] **Step 8: Commit**

```bash
git add prisma/schema.prisma lib/types.ts
git commit -m "feat: add ebay/amazon/etsy to Platform enum and lib/types.ts"
```

---

### Task 2: Update Zod schemas

**Files:**
- Modify: `lib/schemas.ts:14-18,49-53,159` — 3 hardcoded platform enums
- Modify: `app/api/templates/route.ts:11` — local createTemplateSchema platform enum

**Context:** `lib/schemas.ts` has 3 standalone platform Zod enums (NOT derived from `lib/types.ts`): `productFormSchema` line 14, `generateAdRequestSchema` line 49, and `platformEnum` line 159. `app/api/templates/route.ts` line 11 has its own inline enum. All 4 must be updated.

- [ ] **Step 1: Update `lib/schemas.ts` — productFormSchema**

Lines 14-18:
```typescript
platform: z.enum([
    "olx",
    "allegro_lokalnie",
    "facebook_marketplace",
    "vinted",
    "ebay",
    "amazon",
    "etsy",
]),
```

- [ ] **Step 2: Update `lib/schemas.ts` — generateAdRequestSchema**

Lines 49-53 (same pattern, same change):
```typescript
platform: z.enum([
    "olx",
    "allegro_lokalnie",
    "facebook_marketplace",
    "vinted",
    "ebay",
    "amazon",
    "etsy",
]),
```

- [ ] **Step 3: Update `lib/schemas.ts` — platformEnum**

Line 159:
```typescript
// Before:
const platformEnum = z.enum(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"]);

// After:
const platformEnum = z.enum(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted", "ebay", "amazon", "etsy"]);
```

- [ ] **Step 4: Update `app/api/templates/route.ts` — createTemplateSchema platform**

Line 11:
```typescript
// Before:
platform: z.enum(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"]),

// After:
platform: z.enum(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted", "ebay", "amazon", "etsy"]),
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 6: Commit**

```bash
git add lib/schemas.ts app/api/templates/route.ts
git commit -m "feat: add ebay/amazon/etsy to all Zod platform enums"
```

---

### Task 3: Register rules files in `lib/openai.ts`

**Files:**
- Modify: `lib/openai.ts` — add to `PLATFORM_RULES_FILES` map and update system prompt opening sentence

**Context:** `PLATFORM_RULES_FILES` is a `Map<string, string>` that maps platform names to rule file paths. It's loaded with `fs.readFileSync`. Rules files are already committed at `lib/rules/ebay_rules.md`, `lib/rules/amazon_rules.md`, `lib/rules/etsy_rules.md`. Find `PLATFORM_RULES_FILES` with grep to get exact line number.

- [ ] **Step 1: Find the map definition**

```bash
grep -n "PLATFORM_RULES_FILES\|olx_rules\|allegro" lib/openai.ts | head -10
```

- [ ] **Step 2: Add 3 new entries to `PLATFORM_RULES_FILES`**

After the last existing entry (e.g., `vinted`), add:
```typescript
PLATFORM_RULES_FILES.set("ebay", path.join(process.cwd(), "lib/rules/ebay_rules.md"));
PLATFORM_RULES_FILES.set("amazon", path.join(process.cwd(), "lib/rules/amazon_rules.md"));
PLATFORM_RULES_FILES.set("etsy", path.join(process.cwd(), "lib/rules/etsy_rules.md"));
```

- [ ] **Step 3: Update system prompt opening sentence**

Line 310 of `lib/openai.ts`:
```typescript
// Before:
"Jesteś ekspertem w tworzeniu ogłoszeń sprzedażowych na polskie platformy marketplace (OLX, Allegro Lokalnie, Facebook Marketplace, Vinted)."

// After:
"Jesteś ekspertem w tworzeniu ogłoszeń sprzedażowych na polskie i międzynarodowe platformy marketplace (OLX, Allegro Lokalnie, Facebook Marketplace, Vinted, eBay, Amazon, Etsy). Wszystkie ogłoszenia generujesz w języku polskim."
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add lib/openai.ts
git commit -m "feat: register eBay/Amazon/Etsy rules in openai.ts, update system prompt"
```

---

### Task 4: Update component icon maps

**Files:**
- Modify: `components/AdCard.tsx:52-58` — add to PLATFORM_ICONS Record
- Modify: `components/PlatformSelector.tsx:13-25` — add to PLATFORM_ICONS and PLATFORM_COLORS
- Modify: `components/TemplateFormModal.tsx:21-26` — add to PLATFORM_ICONS

**Context:** Each component maintains its own local icon maps. `AdCard.tsx` has `Record<Platform, React.ElementType>` (TypeScript will fail without all entries). `PlatformSelector.tsx` uses `as const` (no TS error but runtime `undefined`). Icons to use: eBay → `ShoppingCart`, Amazon → `Package`, Etsy → `Tag` (all from lucide-react).

- [ ] **Step 1: Update `components/AdCard.tsx`**

First check what icons are already imported (line 1):
```bash
grep -n "^import\|lucide" components/AdCard.tsx | head -5
```

Add `ShoppingCart, Package, Tag` to the lucide-react import if not already present.

Then update `PLATFORM_ICONS` (lines 52-58):
```typescript
const PLATFORM_ICONS: Record<Platform, React.ElementType> = {
    olx: ShoppingBag,
    allegro_lokalnie: Store,
    facebook_marketplace: Facebook,
    vinted: Shirt,
    ebay: ShoppingCart,
    amazon: Package,
    etsy: Tag,
};
```

- [ ] **Step 2: Update `components/PlatformSelector.tsx`**

Check existing imports:
```bash
grep -n "^import\|lucide" components/PlatformSelector.tsx | head -5
```

Add `ShoppingCart, Package, Tag` to import.

Update `PLATFORM_ICONS` (lines 13-19):
```typescript
const PLATFORM_ICONS = {
    olx: ShoppingBag,
    allegro_lokalnie: Store,
    facebook_marketplace: Facebook,
    vinted: Shirt,
    ebay: ShoppingCart,
    amazon: Package,
    etsy: Tag,
} as const;
```

Update `PLATFORM_COLORS` (lines 20-26):
```typescript
const PLATFORM_COLORS = {
    olx: "text-orange-500",
    allegro_lokalnie: "text-green-600",
    facebook_marketplace: "text-blue-600",
    vinted: "text-teal-600",
    ebay: "text-yellow-500",
    amazon: "text-yellow-600",
    etsy: "text-orange-400",
} as const;
```

- [ ] **Step 3: Update `components/TemplateFormModal.tsx`**

Check existing imports:
```bash
grep -n "lucide\|ShoppingBag\|PLATFORM_ICONS" components/TemplateFormModal.tsx | head -5
```

Add `ShoppingCart, Package, Tag` to the lucide-react import (line 4).

Update `PLATFORM_ICONS` (lines 21-26):
```typescript
const PLATFORM_ICONS = {
    olx: { Icon: ShoppingBag, color: "text-orange-500" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600" },
    vinted: { Icon: Shirt, color: "text-teal-600" },
    ebay: { Icon: ShoppingCart, color: "text-yellow-500" },
    amazon: { Icon: Package, color: "text-yellow-600" },
    etsy: { Icon: Tag, color: "text-orange-400" },
} as const;
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors in these 3 files.

- [ ] **Step 5: Commit**

```bash
git add components/AdCard.tsx components/PlatformSelector.tsx components/TemplateFormModal.tsx
git commit -m "feat: add eBay/Amazon/Etsy icons to all component icon maps"
```

---

### Task 5: Platform tiles in `ProductForm.tsx` with lock guard

**Files:**
- Modify: `components/ProductForm.tsx:4,25-30,97-129` — add icons + locked platform tiles

**Context:** `ProductForm.tsx` currently renders platform tiles from `Object.entries(PLATFORM_NAMES)` in a 2×2 grid. After adding 3 new platforms, `PLATFORM_NAMES` will have 7 entries. The locked platforms (eBay/Amazon/Etsy for non-RESELER) must render differently — disabled with Crown icon + tooltip. They must NOT trigger `handlePlatformChange` (which would change platform and default tone). Follow the exact same lock pattern as the tone pills (lines 162-184): `opacity-50 cursor-not-allowed`, Crown icon, tooltip on click that auto-dismisses after 2 seconds using `tooltipTone`-style state.

- [ ] **Step 1: Add icon imports**

Line 4: add `ShoppingCart, Package, Tag` to lucide-react import:
```typescript
import { Sparkles, ShoppingBag, Store, Facebook, Shirt, Crown, ShoppingCart, Package, Tag } from "lucide-react";
```

- [ ] **Step 2: Update `PLATFORM_ICONS` in ProductForm**

Lines 25-30:
```typescript
const PLATFORM_ICONS = {
    olx: { Icon: ShoppingBag, color: "text-orange-500" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600" },
    vinted: { Icon: Shirt, color: "text-teal-600" },
    ebay: { Icon: ShoppingCart, color: "text-yellow-500" },
    amazon: { Icon: Package, color: "text-yellow-600" },
    etsy: { Icon: Tag, color: "text-orange-400" },
} as const;
```

- [ ] **Step 3: Add locked platform state**

In the `ProductForm` function body (after the existing `tooltipTone` state at line 82), add analogous state for locked platform tooltip:
```typescript
const [tooltipPlatform, setTooltipPlatform] = useState<Platform | null>(null);
const platformTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
    return () => {
        if (platformTimerRef.current) clearTimeout(platformTimerRef.current);
    };
}, []);

const handleLockedPlatformClick = (p: Platform) => {
    if (platformTimerRef.current) clearTimeout(platformTimerRef.current);
    setTooltipPlatform(p);
    platformTimerRef.current = setTimeout(() => setTooltipPlatform(null), 2000);
};
```

- [ ] **Step 4: Update platform tiles rendering**

The platforms grid (lines 104-128) currently renders all platforms the same way. Change it to split into unlocked and locked:

```typescript
const LOCKED_PLATFORMS: Platform[] = ["ebay", "amazon", "etsy"];

// Inside the fieldset, replace the single map with:
<div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Wybór platformy sprzedażowej">
    {/* Unlocked platforms — same as before */}
    {(["olx", "allegro_lokalnie", "facebook_marketplace", "vinted"] as Platform[]).map((p) => {
        const { Icon, color } = PLATFORM_ICONS[p];
        const isSelected = platform === p;
        return (
            <button
                key={p}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handlePlatformChange(p)}
                className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30"
                )}
            >
                <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : color)} aria-hidden="true" />
                <span className="font-medium text-sm">{PLATFORM_NAMES[p]}</span>
            </button>
        );
    })}
    {/* Locked platforms — eBay, Amazon, Etsy */}
    {LOCKED_PLATFORMS.map((p) => {
        const isLocked = userPlan !== "RESELER";
        const { Icon, color } = PLATFORM_ICONS[p];
        if (isLocked) {
            return (
                <div key={p} className="relative">
                    <button
                        type="button"
                        onClick={() => handleLockedPlatformClick(p)}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border-2 text-left w-full",
                            "opacity-50 cursor-not-allowed",
                            "border-violet-100 bg-violet-50"
                        )}
                        aria-disabled="true"
                    >
                        <Crown className="h-4 w-4 text-violet-300 flex-shrink-0" aria-hidden="true" />
                        <Icon className={cn("h-5 w-5", color)} aria-hidden="true" />
                        <span className="font-medium text-sm text-violet-300">{PLATFORM_NAMES[p]}</span>
                    </button>
                    {tooltipPlatform === p && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs whitespace-nowrap z-10 pointer-events-none">
                            Dostępne w planie Reseler
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                        </div>
                    )}
                </div>
            );
        }
        // RESELER: fully accessible
        const isSelected = platform === p;
        return (
            <button
                key={p}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handlePlatformChange(p)}
                className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30"
                )}
            >
                <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : color)} aria-hidden="true" />
                <span className="font-medium text-sm">{PLATFORM_NAMES[p]}</span>
            </button>
        );
    })}
</div>
```

Note: Remove the `LOCKED_PLATFORMS` constant definition from inside JSX — declare it outside the component at module level.

**Critical spec requirement:** Clicking a locked platform tile is a no-op for **both** `onPlatformChange` AND `onToneChange`. The locked `onClick` handler calls only `handleLockedPlatformClick(p)` — it does NOT call `handlePlatformChange(p)`, which would normally trigger `onToneChange` via the default tone lookup. Verify the locked handler path never routes through `handlePlatformChange`.

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Commit**

```bash
git add components/ProductForm.tsx
git commit -m "feat: add eBay/Amazon/Etsy platform tiles with RESELER lock guard in ProductForm"
```

---

### Task 6: Character limits in `AdResultMain.tsx` + filter in `AdsList.tsx`

**Files:**
- Modify: `components/AdResultMain.tsx:13-18` — add to PLATFORM_LIMITS
- Modify: `components/AdsList.tsx:60-66` — add to PLATFORM_FILTERS

**Context:** `AdResultMain.tsx` has `PLATFORM_LIMITS as const` at lines 13-18 — accessing `PLATFORM_LIMITS[platform]` without the new entries would throw at runtime. `AdsList.tsx` has `PLATFORM_FILTERS` array at lines 60-66 used for the filter dropdown.

Note: The spec's File Map states character limits must be added to `lib/types.ts`. These are display-layer limits used only in `AdResultMain.tsx`, so they are defined directly in `AdResultMain.tsx`. No exported constant is added to `lib/types.ts` as it would create a cross-layer dependency for UI-only data.

- [ ] **Step 1: Update `AdResultMain.tsx`**

Lines 13-18:
```typescript
const PLATFORM_LIMITS = {
  olx: { title: 70, description: 1500 },
  allegro_lokalnie: { title: 75, description: 1500 },
  facebook_marketplace: { title: 60, description: 1000 },
  vinted: { title: 100, description: 750 },
  ebay: { title: 80, description: 1000 },
  amazon: { title: 200, description: 2000 },
  etsy: { title: 140, description: 1000 },
} as const;
```

- [ ] **Step 2: Update `AdsList.tsx`**

First check current PLATFORM_FILTERS:
```bash
grep -n -A 8 "PLATFORM_FILTERS" components/AdsList.tsx | head -15
```

Add 3 new entries following the existing pattern (likely `{ value: "olx", label: "OLX" }` style):
```typescript
{ value: "ebay", label: "eBay" },
{ value: "amazon", label: "Amazon" },
{ value: "etsy", label: "Etsy" },
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add components/AdResultMain.tsx components/AdsList.tsx
git commit -m "feat: add eBay/Amazon/Etsy character limits and platform filters"
```

---

### Task 7: Pricing pages copy update

**Files:**
- Modify: `app/pricing/page.tsx:22,39,56` — platform feature text
- Modify: `app/dashboard/pricing/page.tsx` — same

**Context:** Current features array in `PLANS`: all 3 plans show `"Wszystkie platformy"`. Per the spec:
- RESELER → `"7 platform (OLX, Allegro, FB, Vinted + eBay, Amazon, Etsy)"`
- STARTER → `"4 platformy (OLX, Allegro, FB Marketplace, Vinted)"`
- FREE → `"4 platformy (OLX, Allegro, FB Marketplace, Vinted)"`

- [ ] **Step 1: Update `app/pricing/page.tsx`**

Find all `"Wszystkie platformy"` occurrences:
```bash
grep -n "platformy\|Wszystkie platformy" app/pricing/page.tsx
```

Replace per plan:
- FREE: `"Wszystkie platformy"` → `"4 platformy (OLX, Allegro, FB Marketplace, Vinted)"`
- STARTER: `"Wszystkie platformy"` → `"4 platformy (OLX, Allegro, FB Marketplace, Vinted)"`
- RESELER: `"Wszystkie platformy"` → `"7 platform (OLX, Allegro, FB, Vinted + eBay, Amazon, Etsy)"`

- [ ] **Step 2: Update `app/dashboard/pricing/page.tsx`**

```bash
grep -n "platformy\|Wszystkie platformy" app/dashboard/pricing/page.tsx
```

Apply same 3 changes.

- [ ] **Step 3: Verify TypeScript compiles and lint**

```bash
npx tsc --noEmit 2>&1 | head -20
npm run lint 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add "app/pricing/page.tsx" "app/dashboard/pricing/page.tsx"
git commit -m "feat: update pricing copy with 7-platform RESELER description"
```

---

### Task 8: Final verification and CHANGELOG

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
Expected: Build completes without errors.

- [ ] **Step 3: Check no broken platform references**

```bash
grep -r '"olx"\|"allegro_lokalnie"\|"facebook_marketplace"\|"vinted"' --include="*.ts" --include="*.tsx" . | grep -v "node_modules\|\.next\|schema.prisma\|prisma/migrations" | grep -v '"ebay"\|"amazon"\|"etsy"' | grep 'z\.enum\|Record<Platform'
```
Expected: no output (all platform Zod enums and Record<Platform> types should now include all 7 values).

- [ ] **Step 4: Add CHANGELOG entry**

In `CHANGELOG.md`, add after `## [1.3.7]` (tone-unlock entry):
```markdown
## [1.3.8] - 2026-03-24

### Added
- 3 new marketplace platforms for RESELER plan: eBay (80/1000 chars), Amazon (200/2000 chars), Etsy (140/1000 chars)
- Platform-specific AI generation rules for all 3 platforms (`lib/rules/ebay_rules.md`, `lib/rules/amazon_rules.md`, `lib/rules/etsy_rules.md`)
- Platform tiles with Crown lock (opacity-50, tooltip) for FREE and STARTER users
- New platform filters in ad management dashboard
- Pricing page updated: RESELER shows "7 platform", STARTER/FREE show "4 platformy"
```

- [ ] **Step 5: Commit**

```bash
git add CHANGELOG.md
git commit -m "chore: add CHANGELOG entry for v1.3.8 — eBay/Amazon/Etsy platforms"
```
