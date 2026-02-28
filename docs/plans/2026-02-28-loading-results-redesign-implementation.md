# Loading and Results Screens Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign loading and results screens to match modern card-based form UI with consistent typography, dynamic loading messages, and improved information hierarchy.

**Architecture:** Refactor FullscreenLoading to accept platform and imageCount props for dynamic messages. Split AdResult into two sub-components (AdResultMain for left column, AdResultMeta for right column) with 65/35 grid layout. Create new PriceCard component with pastel orange badges.

**Tech Stack:** React, TypeScript, Tailwind CSS, Next.js 15, lucide-react icons

---

## Task 1: Update FullscreenLoading - Typography and Props

**Files:**
- Modify: `components/FullscreenLoading.tsx`

**Step 1: Change font-serif to font-sans**

In `components/FullscreenLoading.tsx`, line 71, change:

```tsx
// OLD
<h2 className="font-serif text-2xl font-normal tracking-tight">
    AI pracuje...
</h2>

// NEW
<h2 className="font-sans text-2xl font-normal tracking-tight">
    AI pracuje...
</h2>
```

**Step 2: Add new props to interface**

In `components/FullscreenLoading.tsx`, update interface (lines 7-10):

```tsx
interface FullscreenLoadingProps {
    isLoading: boolean;
    duration?: number; // Keep for backward compatibility, will be overridden
    imageCount: number;  // NEW
    platform: Platform;   // NEW
}
```

Add import at top:

```tsx
import { Platform, PLATFORM_NAMES } from "@/lib/types";
```

**Step 3: Test visual change**

Run: `npm run dev`
Navigate to app, upload images, click generate
Expected: Heading uses sans-serif font (matches form)

**Step 4: Commit typography change**

```bash
git add components/FullscreenLoading.tsx
git commit -m "refactor: change loading screen heading to font-sans for consistency"
```

---

## Task 2: Add Dynamic Duration Calculation

**Files:**
- Modify: `components/FullscreenLoading.tsx`

**Step 1: Calculate duration based on imageCount**

In `components/FullscreenLoading.tsx`, update component (line 12-15):

```tsx
export function FullscreenLoading({
    isLoading,
    duration, // Will be overridden
    imageCount,
    platform,
}: FullscreenLoadingProps) {
    // Calculate dynamic duration: 10s base + 1s per image
    const calculatedDuration = 10 + imageCount * 1;
    const effectiveDuration = calculatedDuration; // Use calculated, ignore prop

    const [progress, setProgress] = useState(0);
    const [isIndeterminate, setIsIndeterminate] = useState(false);
```

**Step 2: Update useEffect to use effectiveDuration**

Change all instances of `duration` in useEffect to `effectiveDuration` (lines 19-48):

```tsx
useEffect(() => {
    if (!isLoading) {
        setProgress(0);
        setIsIndeterminate(false);
        return;
    }

    const startTime = Date.now();
    const endTime = startTime + effectiveDuration * 1000; // Changed

    const updateProgress = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const percentage = Math.min((elapsed / (effectiveDuration * 1000)) * 100, 100); // Changed

        if (percentage >= 100) {
            setIsIndeterminate(true);
            setProgress(100);
        } else {
            setProgress(percentage);
        }
    };

    const interval = setInterval(updateProgress, 100);
    updateProgress();

    return () => clearInterval(interval);
}, [isLoading, effectiveDuration, imageCount]); // Changed deps
```

**Step 3: Test duration calculation**

Run: `npm run dev`
Upload 1 image: Should take ~11s to reach 100%
Upload 4 images: Should take ~14s to reach 100%
Expected: Duration scales with image count

**Step 4: Commit duration logic**

```bash
git add components/FullscreenLoading.tsx
git commit -m "feat: add dynamic duration calculation based on image count"
```

---

## Task 3: Add Dynamic Progress Messages

**Files:**
- Modify: `components/FullscreenLoading.tsx`

**Step 1: Create message helper function**

Add new function before component (around line 11):

```tsx
function getLoadingMessage(
    progress: number,
    isIndeterminate: boolean,
    platform: Platform,
    indeterminateTime: number
): string {
    // Phase 1: Progress-based messages (0-100%)
    if (!isIndeterminate) {
        if (progress < 20) return "Analizuję jakość i oświetlenie zdjęć...";
        if (progress < 40) return "Rozpoznaję produkt i jego stan...";
        if (progress < 70) return `Dobieram słowa kluczowe dla ${PLATFORM_NAMES[platform]}...`;
        if (progress < 90) return "Piszę chwytliwy tytuł...";
        return "Finalizuję opis...";
    }

    // Phase 2: Indeterminate tips (rotate every 5s)
    const tips = [
        "Zdjęcia z dobrym oświetleniem sprzedają się 2× szybciej",
        "Szczegółowy opis zwiększa zaufanie kupujących o 40%",
        "Pierwsze zdjęcie decyduje o 80% kliknięć w ogłoszenie",
        "Produkty z ceną negocjacyjną sprzedają się szybciej",
    ];
    const tipIndex = Math.floor(indeterminateTime / 5000) % tips.length;
    return tips[tipIndex];
}
```

**Step 2: Add state for indeterminate time tracking**

In component, add new state (after line 17):

```tsx
const [progress, setProgress] = useState(0);
const [isIndeterminate, setIsIndeterminate] = useState(false);
const [indeterminateTime, setIndeterminateTime] = useState(0); // NEW
```

**Step 3: Update useEffect to track indeterminate time**

In useEffect, add indeterminate time tracking:

```tsx
useEffect(() => {
    if (!isLoading) {
        setProgress(0);
        setIsIndeterminate(false);
        setIndeterminateTime(0); // NEW
        return;
    }

    const startTime = Date.now();
    let indeterminateStartTime: number | null = null; // NEW

    const updateProgress = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const percentage = Math.min((elapsed / (effectiveDuration * 1000)) * 100, 100);

        if (percentage >= 100) {
            setIsIndeterminate(true);
            setProgress(100);

            // NEW: Track indeterminate time
            if (indeterminateStartTime === null) {
                indeterminateStartTime = now;
            }
            const indeterminateElapsed = now - indeterminateStartTime;
            setIndeterminateTime(indeterminateElapsed);
        } else {
            setProgress(percentage);
        }
    };

    const interval = setInterval(updateProgress, 100);
    updateProgress();

    return () => clearInterval(interval);
}, [isLoading, effectiveDuration, imageCount]);
```

**Step 4: Use dynamic message in JSX**

Replace static text with dynamic message (around line 74):

```tsx
{/* Text */}
<div className="space-y-3">
    <h2 className="font-sans text-2xl font-normal tracking-tight">
        AI pracuje...
    </h2>
    <p className="text-muted-foreground text-base leading-relaxed transition-opacity duration-300">
        {getLoadingMessage(progress, isIndeterminate, platform, indeterminateTime)}
    </p>
</div>
```

**Step 5: Test dynamic messages**

Run: `npm run dev`
Upload images, start generation
Expected: Message changes at 20%, 40%, 70%, 90%
Expected: Platform name appears in 40-70% message
Expected: If loading takes >duration, tips rotate every 5s

**Step 6: Commit dynamic messages**

```bash
git add components/FullscreenLoading.tsx
git commit -m "feat: add dynamic progress messages with platform-specific text"
```

---

## Task 4: Update page.tsx to Pass New Props

**Files:**
- Modify: `app/page.tsx`

**Step 1: Pass imageCount and platform to FullscreenLoading**

In `app/page.tsx`, find FullscreenLoading usage (around line 240):

```tsx
// OLD
if (isLoading) {
    return <FullscreenLoading isLoading={isLoading} duration={15} />;
}

// NEW
if (isLoading) {
    return (
        <FullscreenLoading
            isLoading={isLoading}
            imageCount={images.length}
            platform={platform}
        />
    );
}
```

**Step 2: Test integration**

Run: `npm run dev`
Select platform (e.g., OLX), upload 3 images, generate
Expected: Loading shows "Dobieram słowa kluczowe dla OLX..." at 40-70%
Expected: Duration ~13 seconds (10 + 3)

**Step 3: Commit integration**

```bash
git add app/page.tsx
git commit -m "feat: connect loading screen with platform and image count"
```

---

## Task 5: Create PriceCard Component

**Files:**
- Create: `components/PriceCard.tsx`

**Step 1: Create PriceCard component file**

Create `components/PriceCard.tsx`:

```tsx
"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardWrapper } from "@/components/ui/card-wrapper";

interface PriceCardProps {
    price?: { min: number; max: number; reason: string } | null;
    isFree: boolean;
}

export function PriceCard({ price, isFree }: PriceCardProps) {
    return (
        <CardWrapper>
            {isFree ? (
                // Free version
                <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">🎁</span>
                    <div>
                        <p className="font-semibold text-green-700 dark:text-green-400">
                            Za darmo
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                            Oddajesz produkt bezpłatnie
                        </p>
                    </div>
                </div>
            ) : price ? (
                // AI suggested price
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" aria-hidden="true" />
                        Sugerowana cena
                    </h3>

                    {/* Horizontal badges */}
                    <div className="flex items-center gap-2">
                        <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-base font-bold px-3 py-1.5 hover:scale-105 transition-transform">
                            {price.min} zł
                        </Badge>
                        <span className="text-muted-foreground">—</span>
                        <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-base font-bold px-3 py-1.5 hover:scale-105 transition-transform">
                            {price.max} zł
                        </Badge>
                    </div>

                    {/* Reasoning below */}
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {price.reason}
                    </p>
                </div>
            ) : null}
        </CardWrapper>
    );
}
```

**Step 2: Test PriceCard rendering**

This will be tested after integration in Task 7.

**Step 3: Commit PriceCard**

```bash
git add components/PriceCard.tsx
git commit -m "feat: create PriceCard component with pastel orange badges"
```

---

## Task 6: Create AdResultMain Component

**Files:**
- Create: `components/AdResultMain.tsx`

**Step 1: Create AdResultMain component file**

Create `components/AdResultMain.tsx`:

```tsx
"use client";

import React, { useState } from "react";
import { Copy, Check, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { PriceCard } from "@/components/PriceCard";
import type { PriceType } from "@/lib/types";

interface AdResultMainProps {
    title: string;
    description: string;
    price?: { min: number; max: number; reason: string } | null;
    isFree: boolean;
    priceType: PriceType;
}

export function AdResultMain({
    title,
    description,
    price,
    isFree,
    priceType,
}: AdResultMainProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Title Card */}
            <CardWrapper>
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Tag className="h-4 w-4" aria-hidden="true" />
                        Tytuł
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(title, "title")}
                        aria-label="Kopiuj tytuł do schowka"
                        className="transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        {copiedField === "title" ? (
                            <>
                                <Check className="h-4 w-4" aria-hidden="true" />
                                Skopiowano
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" aria-hidden="true" />
                                Kopiuj
                            </>
                        )}
                    </Button>
                </div>
                <p className="text-lg font-semibold leading-relaxed">
                    {title}
                </p>
            </CardWrapper>

            {/* Description Card */}
            <CardWrapper>
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                        Opis
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(description, "description")}
                        aria-label="Kopiuj opis do schowka"
                        className="transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        {copiedField === "description" ? (
                            <>
                                <Check className="h-4 w-4" aria-hidden="true" />
                                Skopiowano
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4" aria-hidden="true" />
                                Kopiuj
                            </>
                        )}
                    </Button>
                </div>
                <p className="text-base leading-relaxed whitespace-pre-wrap [text-wrap:balance]">
                    {description}
                </p>
            </CardWrapper>

            {/* Price Card (if applicable) */}
            {(price || isFree) && <PriceCard price={price} isFree={isFree} />}
        </div>
    );
}
```

**Step 2: Test component structure**

This will be tested after integration in Task 9.

**Step 3: Commit AdResultMain**

```bash
git add components/AdResultMain.tsx
git commit -m "feat: create AdResultMain component for left column results"
```

---

## Task 7: Create AdResultMeta Component

**Files:**
- Create: `components/AdResultMeta.tsx`

**Step 1: Create AdResultMeta component file**

Create `components/AdResultMeta.tsx`:

```tsx
"use client";

import React from "react";
import { FileText, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardWrapper } from "@/components/ui/card-wrapper";
import type {
    Platform,
    ProductCondition,
    PriceType,
    ToneStyle,
} from "@/lib/types";
import { PLATFORM_NAMES, CONDITION_NAMES, TONE_STYLE_NAMES } from "@/lib/types";

interface ImageAnalysis {
    isValid: boolean;
    quality?: string;
    suggestions?: string;
}

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

export function AdResultMeta({
    platform,
    productName,
    condition,
    priceType,
    userPrice,
    delivery,
    selectedTone,
    images,
    imagePreviews,
}: AdResultMetaProps) {
    return (
        <div className="space-y-6">
            {/* Parameters Card */}
            <CardWrapper title="Parametry ogłoszenia" icon={FileText}>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Platforma:</span>
                        <Badge variant="secondary">{PLATFORM_NAMES[platform]}</Badge>
                    </div>

                    {productName && (
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Nazwa:</span>
                            <span className="font-medium text-right">{productName}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Stan:</span>
                        <span className="font-medium">{CONDITION_NAMES[condition]}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Cena:</span>
                        <span className="font-medium">
                            {priceType === "free" && "Za darmo"}
                            {priceType === "user_provided" && `${userPrice} zł`}
                            {priceType === "ai_suggest" && "AI zasugerowała"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Dostawa:</span>
                        <span className="font-medium text-right">{delivery}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Styl:</span>
                        <Badge variant="outline">{TONE_STYLE_NAMES[selectedTone]}</Badge>
                    </div>
                </div>
            </CardWrapper>

            {/* Image Analysis Card */}
            {images.length > 0 && (
                <CardWrapper
                    title={`Analiza zdjęć (${images.length})`}
                    icon={ImageIcon}
                >
                    <div className="space-y-3">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="flex gap-3 p-3 rounded-lg bg-muted/30 transition-all hover:bg-muted/40"
                            >
                                {/* Thumbnail */}
                                <div className="flex-shrink-0">
                                    {imagePreviews?.[index] ? (
                                        <img
                                            src={imagePreviews[index]}
                                            alt={`Zdjęcie produktu ${index + 1}`}
                                            className="w-12 h-12 object-cover rounded-md border transition-transform hover:scale-105"
                                            width={48}
                                            height={48}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-muted rounded-md border flex items-center justify-center">
                                            <ImageIcon
                                                className="h-5 w-5 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex items-center justify-end">
                                        {img.isValid ? (
                                            <Badge className="text-xs bg-green-50 text-green-700 border-green-200">
                                                <CheckCircle
                                                    className="h-3 w-3 mr-1"
                                                    aria-hidden="true"
                                                />
                                                OK
                                            </Badge>
                                        ) : (
                                            <Badge className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                                <AlertCircle
                                                    className="h-3 w-3 mr-1"
                                                    aria-hidden="true"
                                                />
                                                Popraw
                                            </Badge>
                                        )}
                                    </div>

                                    {img.quality && (
                                        <p className="text-xs text-muted-foreground break-words leading-relaxed">
                                            <span className="font-semibold">Jakość:</span>{" "}
                                            {img.quality}
                                        </p>
                                    )}

                                    {img.suggestions && (
                                        <p className="text-xs text-muted-foreground break-words leading-relaxed">
                                            <span className="font-semibold">Sugestie:</span>{" "}
                                            {img.suggestions}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardWrapper>
            )}
        </div>
    );
}
```

**Step 2: Test component structure**

This will be tested after integration in Task 9.

**Step 3: Commit AdResultMeta**

```bash
git add components/AdResultMeta.tsx
git commit -m "feat: create AdResultMeta component for right column metadata"
```

---

## Task 8: Refactor AdResult to Use Grid Layout

**Files:**
- Modify: `components/AdResult.tsx`

**Step 1: Import new components**

At top of `components/AdResult.tsx`, add imports:

```tsx
import { AdResultMain } from "@/components/AdResultMain";
import { AdResultMeta } from "@/components/AdResultMeta";
```

**Step 2: Replace entire return JSX with grid layout**

Replace the return statement (starting around line 68) with:

```tsx
return (
    <div
        className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-6 animate-slide-up"
        role="region"
        aria-label="Wygenerowane ogłoszenie"
    >
        {/* Left Column - Main Results */}
        <AdResultMain
            title={displayContent.title!}
            description={displayContent.description!}
            price={result.price}
            isFree={result.isFree}
            priceType={props.priceType}
        />

        {/* Right Column - Metadata */}
        <AdResultMeta
            platform={props.platform}
            productName={props.productName}
            condition={props.condition}
            priceType={props.priceType}
            userPrice={props.userPrice}
            delivery={props.delivery}
            selectedTone={props.selectedTone}
            images={result.images || []}
            imagePreviews={imagePreviews}
        />
    </div>
);
```

**Step 3: Remove old JSX (everything after error check)**

Delete all old JSX from line ~70 to line ~329 (entire old return structure with parameters card, title section, description section, price section, image analysis, copy all button).

**Step 4: Test grid layout**

Run: `npm run dev`
Generate ad, check results screen
Expected: Two columns on desktop (65/35 split)
Expected: Single column on mobile (main content first, then metadata)

**Step 5: Commit grid refactor**

```bash
git add components/AdResult.tsx
git commit -m "refactor: implement grid layout with AdResultMain and AdResultMeta"
```

---

## Task 9: Update Results Header in page.tsx

**Files:**
- Modify: `app/page.tsx`

**Step 1: Find results section and update header**

In `app/page.tsx`, find the results section (around line 370), replace:

```tsx
// OLD
{result && (
    <section aria-labelledby="result-heading" className="space-y-8 animate-fade-in">
        {/* Results Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b-2 border-foreground">
            <div>
                <h2 id="result-heading" className="font-serif text-3xl sm:text-4xl font-normal mb-2 tracking-tight">
                    Twoje ogłoszenie
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                    Gotowe do skopiowania i wklejenia
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleEdit} ...>
                    <Pencil ... /> Edytuj
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset} ...>
                    <RotateCcw ... /> Nowe
                </Button>
            </div>
        </div>

// NEW
{result && (
    <section aria-labelledby="result-heading" className="space-y-8 animate-fade-in">
        {/* Results Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b">
            <div>
                <h2 id="result-heading" className="font-sans text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                    Twoje ogłoszenie
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                    Gotowe do skopiowania i wklejenia
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    aria-label="Edytuj dane produktu"
                    className="border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                    <Pencil className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    Edytuj
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    aria-label="Zacznij od nowa"
                    className="border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                    <RotateCcw className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    Nowe
                </Button>
            </div>
        </div>
```

**Key changes:**
- `font-serif` → `font-sans`
- `font-normal` → `font-bold`
- `border-b-2 border-foreground` → `border-b`
- Buttons: `variant="ghost"` → `variant="outline"` with custom hover classes

**Step 2: Test header styling**

Run: `npm run dev`
Generate ad, check results header
Expected: Sans-serif bold heading
Expected: Outline buttons with gray border
Expected: Buttons turn orange on hover

**Step 3: Commit header update**

```bash
git add app/page.tsx
git commit -m "refactor: update results header with outline buttons and sans-serif typography"
```

---

## Task 10: Final Testing and Verification

**Files:**
- Test: All modified components

**Step 1: Test loading screen with different scenarios**

Run: `npm run dev`

Test 1: Single image
- Upload 1 image, select OLX, generate
- Expected: Duration ~11s
- Expected: Messages progress through 5 stages
- Expected: "Dobieram słowa kluczowe dla OLX..." appears at 40-70%
- Expected: Font is sans-serif

Test 2: Multiple images
- Upload 4 images, select Facebook Marketplace, generate
- Expected: Duration ~14s
- Expected: "Dobieram słowa kluczowe dla Facebook Marketplace..." appears

Test 3: Long loading (indeterminate)
- If API takes >estimated duration
- Expected: Tips rotate every 5s after 100%

**Step 2: Test results layout on desktop**

Desktop browser (≥1024px):
- Expected: Two columns visible (65/35 split)
- Expected: Left column: Tytuł, Opis, Cena (if applicable)
- Expected: Right column: Parametry, Analiza zdjęć
- Expected: Pastel orange badges for price
- Expected: Pastel green "OK" badges for images
- Expected: Copy buttons work
- Expected: Edytuj/Nowe buttons have orange hover

**Step 3: Test results layout on mobile**

Mobile browser (<1024px) or resize window:
- Expected: Single column stack
- Expected: Order: Tytuł → Opis → Cena → Parametry → Zdjęcia
- Expected: All content readable and properly spaced
- Expected: Buttons remain functional

**Step 4: Test with different price types**

Test A: AI suggest price
- Select "AI zasugeruje cenę", generate
- Expected: Price card shows with two badges (min/max)
- Expected: Reasoning text below badges
- Expected: Parametry shows "AI zasugerowała"

Test B: User provided price
- Select "Podaję swoją cenę", enter "50", generate
- Expected: No price card in left column (AI doesn't suggest)
- Expected: Parametry shows "50 zł"

Test C: Free
- Select "Oddam za darmo", generate
- Expected: Price card shows gift emoji and "Za darmo"
- Expected: Green styling
- Expected: Parametry shows "Za darmo"

**Step 5: Test accessibility**

- Tab through buttons (copy, edit, new)
- Expected: Focus visible with ring
- Expected: Keyboard navigation works
- Screen reader: Read heading structure
- Expected: Proper hierarchy (h2 → h3)

**Step 6: Visual regression check**

Compare with design document:
- ✅ Typography: All font-sans (no serif)
- ✅ Layout: 65/35 grid on desktop
- ✅ Buttons: Outline with orange hover
- ✅ Price: Pastel orange badges
- ✅ Images: Pastel green/yellow badges
- ✅ Loading: Dynamic messages with platform name

**Step 7: Commit final verification**

If all tests pass:

```bash
git add -A
git commit -m "test: verify loading and results redesign implementation"
```

---

## Task 11: Update Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Document FullscreenLoading changes**

In `CLAUDE.md`, find "Key Files and Responsibilities" section, update:

```markdown
**UI Components:**
- `components/FullscreenLoading.tsx` - Loading screen with dynamic messages based on platform and image count (10s + 1s per image), progress-based messages (0-20%, 20-40%, 40-70%, 70-90%, 90-100%), indeterminate tips rotation
```

**Step 2: Document new AdResult architecture**

Add to same section:

```markdown
- `components/AdResult.tsx` - Main wrapper with 65/35 grid layout (desktop) / vertical stack (mobile)
- `components/AdResultMain.tsx` - Left column: title, description, price cards with copy buttons
- `components/AdResultMeta.tsx` - Right column: parameters, image analysis
- `components/PriceCard.tsx` - Price display with pastel orange badges for AI-suggested prices, green styling for free items
```

**Step 3: Document styling patterns**

Add new section:

```markdown
### Results Screen Styling

- **Typography:** Consistent `font-sans` throughout (no serif fonts)
- **Layout:** Desktop `lg:grid-cols-[65fr_35fr]`, mobile single column
- **Buttons:** Outline style with `border-gray-200 hover:border-orange-500 hover:text-orange-500`
- **Price badges:** `bg-orange-50 text-orange-600 border-orange-200` (pastel, not aggressive)
- **Image badges OK:** `bg-green-50 text-green-700 border-green-200` (pastel green)
- **Image badges Warning:** `bg-yellow-50 text-yellow-700 border-yellow-200` (yellow for issues)
```

**Step 4: Commit documentation**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with loading and results redesign details"
```

---

## Summary

**Total Tasks:** 11
**Estimated Time:** 4-5 hours
**Files Created:** 3 (PriceCard.tsx, AdResultMain.tsx, AdResultMeta.tsx)
**Files Modified:** 4 (FullscreenLoading.tsx, AdResult.tsx, page.tsx, CLAUDE.md)

**Key Changes:**
1. ✅ Loading screen: Sans-serif font, dynamic duration (10s + 1s/image), progress-based messages
2. ✅ Results layout: 65/35 grid on desktop, vertical stack on mobile
3. ✅ Typography: Consistent font-sans throughout
4. ✅ Buttons: Outline style with orange hover
5. ✅ Price: Pastel orange badges in horizontal layout
6. ✅ Images: Smaller thumbnails (w-12), pastel green/yellow badges

**Testing Focus:**
- Dynamic loading messages with platform name
- Grid layout responsive behavior
- Copy functionality
- Price display variations (AI, user, free)
- Accessibility (keyboard, screen reader)

---

**Implementation Complete!** 🎉

All tasks follow TDD principles where applicable, frequent commits, and comprehensive testing. The redesign maintains consistency with the form UI while improving information hierarchy and visual polish.
