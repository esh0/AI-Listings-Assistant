# Loading and Results Screens Redesign

**Date:** 2026-02-28
**Status:** Approved
**Approach:** Medium Refactorization (Balanced)

---

## Problem Statement

The loading and results screens have visual inconsistency with the newly redesigned form:

1. **Typography mismatch:** Loading screen uses `font-serif`, results use mixed fonts
2. **Layout mismatch:** Results use vertical stacking instead of modern card grid layout
3. **Information hierarchy:** "Parametry generowania" occupy prime position instead of actual results (title, description)
4. **Static loading:** Loading screen has static message, doesn't reflect actual AI progress
5. **Aggressive styling:** Price card has overwhelming orange background
6. **Button visibility:** "Edytuj" and "Nowe" buttons are small ghost buttons, hard to notice

---

## Solution Overview

### Goal
Unify typography and layout between form and loading/results screens, improve information hierarchy, increase UI polish.

### Key Changes

1. **Loading Screen:** Sans-serif font, dynamic messages based on progress and platform
2. **Results Layout:** Two-column grid (65%/35%) separating main content from metadata
3. **Typography:** Consistent `font-sans` throughout, bold headings
4. **Buttons:** Outline style with orange hover effect
5. **Price Card:** White card with pastel orange badges for prices

---

## 1. Loading Screen (FullscreenLoading)

### Typography
- **Change:** `font-serif` → `font-sans` in "AI pracuje..." heading
- **Size:** Remains `text-2xl font-normal` but with sans-serif
- **Layout:** No structural changes - centered spinner, text, progress bar

### Dynamic Timing
```typescript
const estimatedDuration = 10 + (imageCount * 1);
// 1 image: 11s
// 4 images: 14s
// 8 images: 18s
```

### Dynamic Messages (Mix: Steps + Tips)

**Phase 1: AI Steps (0-100% progress)**

Proportional to duration:

| Progress | Message |
|----------|---------|
| 0-20% | "Analizuję jakość i oświetlenie zdjęć..." |
| 20-40% | "Rozpoznaję produkt i jego stan..." |
| 40-70% | "Dobieram słowa kluczowe dla {PLATFORM_NAME}..." |
| 70-90% | "Piszę chwytliwy tytuł..." |
| 90-100% | "Finalizuję opis..." |

**Phase 2: Indeterminate (if exceeds 100%)**

Every 5 seconds, rotate random tip:
- "Zdjęcia z dobrym oświetleniem sprzedają się 2× szybciej"
- "Szczegółowy opis zwiększa zaufanie kupujących o 40%"
- "Pierwsze zdjęcie decyduje o 80% kliknięć w ogłoszenie"
- "Produkty z ceną negocjacyjną sprzedają się szybciej"

### Implementation Details

**New Props:**
```typescript
interface FullscreenLoadingProps {
    isLoading: boolean;
    imageCount: number;  // NEW - for duration calculation
    platform: Platform;   // NEW - for platform-specific messages
}
```

**Message Logic:**
- Calculate duration: `10 + imageCount * 1`
- Message based on progress %
- Platform name from `PLATFORM_NAMES[platform]`
- Fade transition: `transition-opacity duration-300`

---

## 2. Results Screen - Header

### Layout in page.tsx

```tsx
<section className="space-y-8">
    {/* Header with buttons */}
    <div className="flex items-start justify-between gap-4 pb-6 border-b">
        <div>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                Twoje ogłoszenie
            </h2>
            <p className="text-muted-foreground leading-relaxed">
                Gotowe do skopiowania i wklejenia
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors">
                <Pencil /> Edytuj
            </Button>
            <Button variant="outline" className="border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors">
                <RotateCcw /> Nowe
            </Button>
        </div>
    </div>

    {/* Grid 65/35 */}
    <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-6">
        <AdResultMain ... />
        <AdResultMeta ... />
    </div>
</section>
```

### Key Changes:
- **Typography:** `font-sans text-3xl sm:text-4xl font-bold` (no serif!)
- **Buttons:** Outline with custom hover (gray → orange)
- **Border:** `border-b` separates header from content

---

## 3. Results Layout - Grid Structure

### Desktop (≥1024px)

```
┌────────────────────────────────┬──────────────────┐
│  Left Column (65%)             │  Right Column    │
│                                │  (35%)           │
│  ┌─────────────────────────┐  │  ┌────────────┐  │
│  │ Title + Copy Button     │  │  │ Parameters │  │
│  └─────────────────────────┘  │  └────────────┘  │
│  ┌─────────────────────────┐  │  ┌────────────┐  │
│  │ Description + Copy Btn  │  │  │ Image      │  │
│  └─────────────────────────┘  │  │ Analysis   │  │
│  ┌─────────────────────────┐  │  └────────────┘  │
│  │ Price (if applicable)   │  │                  │
│  └─────────────────────────┘  │                  │
└────────────────────────────────┴──────────────────┘
```

**Grid CSS:** `grid-cols-1 lg:grid-cols-[65fr_35fr] gap-6`

### Mobile (<1024px)

**Vertical stack order:**
1. AdResultMain (title, description, price) - **MOST IMPORTANT ON TOP**
2. AdResultMeta (parameters, images) - metadata below

**Automatic through:** `grid-cols-1` collapses to single column

---

## 4. Left Column - AdResultMain

### Component Structure

**AdResultMain.tsx** - New component

```typescript
interface AdResultMainProps {
    title: string;
    description: string;
    price?: { min: number; max: number; reason: string } | null;
    isFree: boolean;
    priceType: PriceType;
}
```

### Layout (Vertical Stack)

```tsx
<div className="space-y-6">
    {/* 1. Title Card */}
    <CardWrapper>
        <div className="flex justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                <Tag className="h-4 w-4" /> Tytuł
            </h3>
            <Button variant="ghost" onClick={copyTitle}>
                <Copy /> Kopiuj
            </Button>
        </div>
        <p className="text-lg font-semibold leading-relaxed">
            {title}
        </p>
    </CardWrapper>

    {/* 2. Description Card */}
    <CardWrapper>
        <div className="flex justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                <FileText className="h-4 w-4" /> Opis
            </h3>
            <Button variant="ghost" onClick={copyDescription}>
                <Copy /> Kopiuj
            </Button>
        </div>
        <p className="text-base leading-relaxed whitespace-pre-wrap">
            {description}
        </p>
    </CardWrapper>

    {/* 3. Price Card (if exists) */}
    {(price || isFree) && <PriceCard ... />}
</div>
```

---

## 5. Price Card (Option B - Horizontal Badges)

### PriceCard.tsx - New Component

```tsx
<CardWrapper>
    {isFree ? (
        // Free version
        <div className="flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <div>
                <p className="font-semibold text-green-700 dark:text-green-400">
                    Za darmo
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                    Oddajesz produkt bezpłatnie
                </p>
            </div>
        </div>
    ) : price && (
        // AI suggested price
        <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Sugerowana cena
            </h3>

            {/* Horizontal badges */}
            <div className="flex items-center gap-2">
                <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-base font-bold px-3 py-1.5">
                    {price.min} zł
                </Badge>
                <span className="text-muted-foreground">—</span>
                <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-base font-bold px-3 py-1.5">
                    {price.max} zł
                </Badge>
            </div>

            {/* Reasoning below */}
            <p className="text-sm text-gray-500 leading-relaxed">
                {price.reason}
            </p>
        </div>
    )}
</CardWrapper>
```

### Styling Details:
- **Badge:** `bg-orange-50 text-orange-600 border-orange-200` (pastel orange, not aggressive)
- **Reasoning:** `text-sm text-gray-500` (discreet, gray)
- **Icon:** Wallet/money icon next to "Sugerowana cena"

---

## 6. Right Column - AdResultMeta

### Component Structure

**AdResultMeta.tsx** - New component

```typescript
interface AdResultMetaProps {
    platform: Platform;
    productName?: string;
    condition: ProductCondition;
    priceType: PriceType;
    userPrice?: string;
    delivery: string;
    selectedTone: ToneStyle;
    images: ImageAnalysis[];
    imagePreviews?: string[];
}
```

### Layout (Vertical Stack, 2 Cards)

```tsx
<div className="space-y-6">
    {/* 1. Parameters Card */}
    <CardWrapper title="Parametry ogłoszenia" icon={FileText}>
        <div className="space-y-3 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Platforma:</span>
                <Badge variant="secondary">{PLATFORM_NAMES[platform]}</Badge>
            </div>

            {productName && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Nazwa:</span>
                    <span className="font-medium text-right">{productName}</span>
                </div>
            )}

            <div className="flex justify-between">
                <span className="text-muted-foreground">Stan:</span>
                <span className="font-medium">{CONDITION_NAMES[condition]}</span>
            </div>

            <div className="flex justify-between">
                <span className="text-muted-foreground">Cena:</span>
                <span className="font-medium">
                    {priceType === "free" && "Za darmo"}
                    {priceType === "user_provided" && `${userPrice} zł`}
                    {priceType === "ai_suggest" && "AI zasugerowała"}
                </span>
            </div>

            <div className="flex justify-between">
                <span className="text-muted-foreground">Dostawa:</span>
                <span className="font-medium text-right">{delivery}</span>
            </div>

            <div className="flex justify-between">
                <span className="text-muted-foreground">Styl:</span>
                <Badge variant="outline">{TONE_STYLE_NAMES[selectedTone]}</Badge>
            </div>
        </div>
    </CardWrapper>

    {/* 2. Image Analysis Card */}
    {images.length > 0 && (
        <CardWrapper title={`Analiza zdjęć (${images.length})`} icon={ImageIcon}>
            <div className="space-y-3">
                {images.map((img, index) => (
                    <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                            {imagePreviews?.[index] ? (
                                <img
                                    src={imagePreviews[index]}
                                    alt={`Zdjęcie ${index + 1}`}
                                    className="w-12 h-12 object-cover rounded-md border"
                                    width={48}
                                    height={48}
                                />
                            ) : (
                                <div className="w-12 h-12 bg-muted rounded-md border flex items-center justify-center">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex justify-end">
                                {img.isValid ? (
                                    <Badge className="text-xs bg-green-50 text-green-700 border-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        OK
                                    </Badge>
                                ) : (
                                    <Badge className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Popraw
                                    </Badge>
                                )}
                            </div>

                            {img.quality && (
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold">Jakość:</span> {img.quality}
                                </p>
                            )}

                            {img.suggestions && (
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold">Sugestie:</span> {img.suggestions}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </CardWrapper>
    )}
</div>
```

### Styling Details:
- **CardWrapper:** Same as form (with title and icon in header)
- **Parameters:** `text-sm`, flex justify-between, compact
- **Badge "OK":** `bg-green-50 text-green-700 border-green-200` (pastel green, not aggressive)
- **Badge "Popraw":** `bg-yellow-50 text-yellow-700 border-yellow-200` (yellow instead of orange)
- **Thumbnails:** `w-12 h-12` (smaller than current w-16)

---

## 7. Responsive Behavior

### Desktop (≥1024px)
- Grid: `lg:grid-cols-[65fr_35fr]`
- Left column: 65% width
- Right column: 35% width
- Gap: `gap-6` (24px between columns)

### Mobile/Tablet (<1024px)
- Grid: `grid-cols-1` (single column)
- Order: AdResultMain first, AdResultMeta second
- Gap: `gap-6` (24px between cards in stack)

### Mobile-specific Adjustments:
- Buttons "Edytuj"/"Nowe": Stay horizontal, may wrap vertically on very small screens
- Price badges: Remain horizontal (don't switch to vertical)
- Parameters: Flex justify-between works well on mobile (text wraps if too long)

---

## 8. Animations and Transitions

### Loading Screen

**Message Changes:**
```css
transition-opacity duration-300
```

**Implementation:**
- State: `opacity-0` → trigger → `opacity-100`
- Change on progress threshold (20%, 40%, 70%, 90%)
- In indeterminate: change every 5s

### Results Screen

**Result Appearance (already exists):**
```css
animate-slide-up  /* or animate-fade-in */
```

**Hover Interactions:**
- **Edytuj/Nowe Buttons:** `hover:border-orange-500 hover:text-orange-500 transition-colors`
- **Copy Buttons:** `hover:scale-105 active:scale-95 transition-transform`
- **Price Badges:** `hover:scale-105 transition-transform` (subtle)
- **Cards:** `hover:shadow-md transition-shadow` (CardWrapper already has this)

**Copy Feedback:**
- State `copiedField` changes icon Copy → Check
- Auto-reset after 2 seconds
- Text "Kopiuj" → "Skopiowano"

---

## 9. Accessibility

### Loading Screen

**ARIA Attributes:**
```tsx
<div
    role="status"
    aria-live="polite"
    aria-atomic="true"
>
    <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Postęp generowania ogłoszenia"
    />
    <p aria-live="polite">
        {currentMessage}
    </p>
</div>
```

### Results Screen

**Semantic HTML:**
- `<section>` for main results area
- `<h2>` for "Twoje ogłoszenie"
- `<h3>` for card headers (Tytuł, Opis, Cena)

**Buttons:**
```tsx
<Button aria-label="Kopiuj tytuł do schowka">
    <Copy /> Kopiuj
</Button>

<Button aria-label="Edytuj dane produktu">
    <Pencil /> Edytuj
</Button>
```

**Images:**
```tsx
<img
    src={preview}
    alt={`Zdjęcie produktu ${index + 1}`}
    width={48}
    height={48}
/>
```

**Decorative Icons:**
```tsx
<Tag className="h-4 w-4" aria-hidden="true" />
```

**Focus States:**
- All buttons: `focus-visible:ring-2 focus-visible:ring-ring`
- Keyboard navigation works out-of-box through Button component

---

## 10. Error Handling (Simplified)

### Single Error State

**Only error handling location:**

```tsx
// In AdResult.tsx (main wrapper)
if (!result.isValid) {
    return (
        <Alert variant="destructive" role="alert">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Błąd generowania</AlertTitle>
            <AlertDescription>
                {result.error || "Wystąpił nieoczekiwany błąd. Spróbuj ponownie."}
            </AlertDescription>
        </Alert>
    );
}

// If isValid = true, assume everything exists:
// - result.title (non-empty)
// - result.description (non-empty)
// - result.price (object or null depending on priceType)
// - result.images (array, may be empty but exists)
```

### Backend Contract

If `isValid = true`, API **guarantees:**
- ✅ `title` - string (non-empty)
- ✅ `description` - string (non-empty)
- ✅ `price` - object or null (depending on priceType)
- ✅ `images` - array (may be empty, but exists)
- ✅ `isFree` - boolean

### Edge Cases (Not Errors)

**1. No price (`price = null`):**
- Occurs when `priceType !== "ai_suggest"`
- Price card simply doesn't render
- This is **expected behavior**, not an error

**2. Empty image analysis (`images.length = 0`):**
- Theoretically possible if user didn't upload images (though validation prevents this)
- "Analiza zdjęć" card doesn't render
- This is **expected behavior**, not an error

**3. Long texts:**
- Natural wrapping + `text-wrap: balance`
- Not an error - UI handles automatically

---

## 11. File Structure

### New Files

```
components/
├── AdResultMain.tsx        (NEW - left column)
├── AdResultMeta.tsx        (NEW - right column)
└── PriceCard.tsx           (NEW - price card)
```

### Modified Files

```
components/
├── FullscreenLoading.tsx   (MODIFY - add platform, imageCount props)
└── AdResult.tsx            (MODIFY - main wrapper with grid)

app/
└── page.tsx                (MODIFY - new results header, loading props)
```

### Shared Components (Already Exist)

- `CardWrapper` - used for all cards
- `Badge` - used for platform, condition, OK/Popraw
- `Button` - used for Kopiuj, Edytuj, Nowe

---

## 12. Implementation Summary

### FullscreenLoading Changes
1. Change `font-serif` to `font-sans`
2. Add `platform: Platform` and `imageCount: number` props
3. Calculate dynamic duration: `10 + imageCount * 1`
4. Implement message array based on progress %
5. Add fade transition for message changes
6. Add indeterminate tips rotation (every 5s)

### Results Screen Changes
1. Create new header with outline buttons
2. Create `AdResultMain.tsx` component (left column)
3. Create `AdResultMeta.tsx` component (right column)
4. Create `PriceCard.tsx` component
5. Modify `AdResult.tsx` to use grid layout
6. Update `page.tsx` with new header and grid

### Styling Changes
1. All typography to `font-sans`
2. Buttons: outline with orange hover
3. Price badges: pastel orange (`bg-orange-50 text-orange-600`)
4. OK badges: pastel green (`bg-green-50 text-green-700`)
5. Maintain CardWrapper consistency with form

---

## Success Metrics

**User Experience:**
- ✅ Consistent typography across all screens (no serif fonts)
- ✅ Clear information hierarchy (main content left, metadata right)
- ✅ Reduced visual noise (pastel colors instead of aggressive orange)
- ✅ Better button visibility (outline with orange hover)
- ✅ Dynamic loading feedback (progress-based messages)

**Technical:**
- ✅ Component separation (easier maintenance)
- ✅ Responsive design (desktop grid, mobile stack)
- ✅ Accessibility compliant (ARIA, semantic HTML)
- ✅ Performance maintained (existing dynamic imports)

**Design:**
- ✅ Modern, cohesive aesthetic matching form redesign
- ✅ Clear visual hierarchy
- ✅ Consistent spacing and rhythm
- ✅ Professional polish

---

**Design approved by:** User
**Ready for implementation:** Yes
**Next step:** Create implementation plan using `writing-plans` skill
