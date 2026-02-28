# UI Redesign: Dashboard Grid Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform existing vertical form layout into modern 2x2 dashboard grid with segmented controls, platform tiles, and improved visual hierarchy.

**Architecture:** Component-based redesign maintaining existing state management. Create reusable Card wrapper, PlatformSelector tiles, ToneSelector segmented control, and ConditionSegmentedControl. Restructure main page to 2x2 grid (desktop) / vertical stack (mobile). Move CTA button to sticky position in Card 4.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, lucide-react icons

**Design Document:** `docs/plans/2026-02-28-ui-redesign-dashboard-grid.md`

---

## Task 1: Create Card wrapper component

**Files:**
- Create: `components/ui/card-wrapper.tsx`

**Step 1: Create Card component with header support**

Create new file with Card wrapper that provides consistent styling for all grid cards:

```tsx
"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardWrapperProps {
    children: React.ReactNode;
    title?: string;
    icon?: LucideIcon;
    className?: string;
    headerClassName?: string;
}

export function CardWrapper({
    children,
    title,
    icon: Icon,
    className,
    headerClassName,
}: CardWrapperProps) {
    return (
        <div
            className={cn(
                "bg-card border border-border rounded-xl shadow-sm p-6 transition-shadow duration-200 hover:shadow-md",
                className
            )}
        >
            {title && (
                <div className={cn("mb-4 flex items-center gap-2", headerClassName)}>
                    {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>
            )}
            {children}
        </div>
    );
}
```

**Step 2: Verify Card component renders**

Run dev server and verify no TypeScript errors:
```bash
npm run dev
```

Expected: Server starts without errors

**Step 3: Commit Card wrapper**

```bash
git add components/ui/card-wrapper.tsx
git commit -m "feat: add CardWrapper component for grid layout"
```

---

## Task 2: Create PlatformSelector with tile grid

**Files:**
- Create: `components/PlatformSelector.tsx`

**Step 1: Create PlatformSelector component**

Create new file with 2x2 grid of clickable platform tiles:

```tsx
"use client";

import React, { useCallback } from "react";
import { ShoppingBag, Store, Facebook, Shirt } from "lucide-react";
import { Platform, PLATFORM_NAMES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
    platform: Platform;
    onPlatformChange: (platform: Platform) => void;
}

const PLATFORM_ICONS = {
    olx: ShoppingBag,
    "allegro lokalnie": Store,
    "facebook marketplace": Facebook,
    vinted: Shirt,
} as const;

const PLATFORM_COLORS = {
    olx: "text-orange-500",
    "allegro lokalnie": "text-green-600",
    "facebook marketplace": "text-blue-600",
    vinted: "text-teal-600",
} as const;

export function PlatformSelector({ platform, onPlatformChange }: PlatformSelectorProps) {
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, platformValue: Platform) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPlatformChange(platformValue);
            }
        },
        [onPlatformChange]
    );

    return (
        <fieldset className="space-y-3">
            <legend className="text-sm font-medium leading-none">
                Platforma sprzedażowa <span className="text-destructive">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Wybór platformy sprzedażowej">
                {(Object.entries(PLATFORM_NAMES) as [Platform, string][]).map(([value, label]) => {
                    const Icon = PLATFORM_ICONS[value];
                    const isSelected = platform === value;
                    const colorClass = PLATFORM_COLORS[value];

                    return (
                        <div
                            key={value}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onClick={() => onPlatformChange(value)}
                            onKeyDown={(e) => handleKeyDown(e, value)}
                            className={cn(
                                "h-24 border-2 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                isSelected
                                    ? "border-primary bg-primary/10 shadow-sm"
                                    : "border-border bg-background hover:border-primary/50 hover:scale-[1.02] hover:shadow-sm"
                            )}
                        >
                            <Icon className={cn("h-8 w-8", isSelected ? "text-primary" : colorClass)} aria-hidden="true" />
                            <span className="text-sm font-medium">{label}</span>
                        </div>
                    );
                })}
            </div>
        </fieldset>
    );
}
```

**Step 2: Verify component compiles**

Check for TypeScript errors:
```bash
npm run dev
```

Expected: No compilation errors

**Step 3: Commit PlatformSelector**

```bash
git add components/PlatformSelector.tsx
git commit -m "feat: add PlatformSelector with 2x2 tile grid"
```

---

## Task 3: Create ToneSelector segmented control

**Files:**
- Create: `components/ToneSelector.tsx`

**Step 1: Create ToneSelector component**

Create segmented control with horizontal layout and description below:

```tsx
"use client";

import React, { useCallback } from "react";
import { ToneStyle, TONE_STYLE_NAMES, TONE_STYLE_DESCRIPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ToneSelectorProps {
    selectedTone: ToneStyle;
    onToneChange: (tone: ToneStyle) => void;
}

const TONE_RECOMMENDATIONS = {
    professional: "⭐ Polecany dla: Allegro Lokalnie",
    friendly: "⭐ Polecany dla: Facebook Marketplace, Vinted",
    casual: "⭐ Polecany dla: OLX",
} as const;

export function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
    const tones: ToneStyle[] = ["professional", "friendly", "casual"];

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, tone: ToneStyle) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToneChange(tone);
            }
            // Arrow key navigation
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const currentIndex = tones.indexOf(selectedTone);
                const nextIndex =
                    e.key === "ArrowRight"
                        ? (currentIndex + 1) % tones.length
                        : (currentIndex - 1 + tones.length) % tones.length;
                onToneChange(tones[nextIndex]);
            }
        },
        [onToneChange, selectedTone]
    );

    return (
        <fieldset className="space-y-3">
            <legend className="text-sm font-medium leading-none">
                Styl komunikacji <span className="text-destructive">*</span>
            </legend>

            {/* Segmented Control */}
            <div
                className="flex gap-1 bg-muted rounded-lg p-1"
                role="radiogroup"
                aria-label="Wybór stylu komunikacji"
            >
                {tones.map((tone) => {
                    const isSelected = selectedTone === tone;
                    return (
                        <button
                            key={tone}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={isSelected ? 0 : -1}
                            onClick={() => onToneChange(tone)}
                            onKeyDown={(e) => handleKeyDown(e, tone)}
                            className={cn(
                                "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                isSelected
                                    ? "bg-background shadow-sm text-foreground"
                                    : "bg-transparent text-muted-foreground hover:bg-background/50"
                            )}
                        >
                            {TONE_STYLE_NAMES[tone]}
                        </button>
                    );
                })}
            </div>

            {/* Description (shown below when selected) */}
            <div
                className="text-sm text-muted-foreground space-y-1 animate-in fade-in slide-in-from-top-1 duration-200"
                aria-live="polite"
            >
                <p>{TONE_STYLE_DESCRIPTIONS[selectedTone]}</p>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {TONE_RECOMMENDATIONS[selectedTone]}
                </p>
            </div>
        </fieldset>
    );
}
```

**Step 2: Verify component compiles**

```bash
npm run dev
```

Expected: No TypeScript errors

**Step 3: Commit ToneSelector**

```bash
git add components/ToneSelector.tsx
git commit -m "feat: add ToneSelector segmented control with descriptions"
```

---

## Task 4: Create ConditionSegmentedControl

**Files:**
- Create: `components/ConditionSegmentedControl.tsx`

**Step 1: Create ConditionSegmentedControl component**

Create 4-button segmented control with responsive layout (horizontal desktop, vertical mobile):

```tsx
"use client";

import React, { useCallback } from "react";
import { ProductCondition, CONDITION_NAMES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ConditionSegmentedControlProps {
    condition: ProductCondition;
    onConditionChange: (condition: ProductCondition) => void;
}

// Shortened labels for UI (full values remain in form data)
const CONDITION_SHORT_LABELS: Record<ProductCondition, string> = {
    nowy: "Nowy",
    idealny: "Jak nowy",
    "używany, w dobrym stanie": "Używany",
    "ślady używania, uszkodzony": "Uszkodzony",
};

export function ConditionSegmentedControl({
    condition,
    onConditionChange,
}: ConditionSegmentedControlProps) {
    const conditions: ProductCondition[] = [
        "nowy",
        "idealny",
        "używany, w dobrym stanie",
        "ślady używania, uszkodzony",
    ];

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, conditionValue: ProductCondition) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onConditionChange(conditionValue);
            }
            // Arrow key navigation (desktop horizontal)
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const currentIndex = conditions.indexOf(condition);
                const nextIndex =
                    e.key === "ArrowRight"
                        ? (currentIndex + 1) % conditions.length
                        : (currentIndex - 1 + conditions.length) % conditions.length;
                onConditionChange(conditions[nextIndex]);
            }
        },
        [onConditionChange, condition]
    );

    return (
        <fieldset className="space-y-3">
            <legend className="text-sm font-medium leading-none">
                Stan produktu <span className="text-destructive">*</span>
            </legend>

            {/* Desktop: Horizontal segmented control */}
            <div
                className="hidden sm:flex gap-1 bg-muted rounded-lg p-1"
                role="radiogroup"
                aria-label="Wybór stanu produktu"
            >
                {conditions.map((conditionValue) => {
                    const isSelected = condition === conditionValue;
                    return (
                        <button
                            key={conditionValue}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={isSelected ? 0 : -1}
                            onClick={() => onConditionChange(conditionValue)}
                            onKeyDown={(e) => handleKeyDown(e, conditionValue)}
                            className={cn(
                                "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                isSelected
                                    ? "bg-background shadow-sm text-foreground"
                                    : "bg-transparent text-muted-foreground hover:bg-background/50"
                            )}
                        >
                            {CONDITION_SHORT_LABELS[conditionValue]}
                        </button>
                    );
                })}
            </div>

            {/* Mobile: Vertical radio buttons */}
            <div className="sm:hidden space-y-2">
                {conditions.map((conditionValue) => (
                    <label
                        key={conditionValue}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <input
                            type="radio"
                            name="condition-mobile"
                            value={conditionValue}
                            checked={condition === conditionValue}
                            onChange={(e) => onConditionChange(e.target.value as ProductCondition)}
                            className="h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-required="true"
                        />
                        <span className="text-sm font-medium group-hover:text-foreground">
                            {CONDITION_NAMES[conditionValue]}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
```

**Step 2: Verify component compiles**

```bash
npm run dev
```

Expected: No TypeScript errors

**Step 3: Commit ConditionSegmentedControl**

```bash
git add components/ConditionSegmentedControl.tsx
git commit -m "feat: add ConditionSegmentedControl with responsive layout"
```

---

## Task 5: Update UploadDropzone styling

**Files:**
- Modify: `components/UploadDropzone.tsx`

**Step 1: Update grid to 3-4 columns and improve empty state**

Modify existing UploadDropzone component:

```tsx
// Line 142: Change grid columns from grid-cols-2 sm:grid-cols-3 to grid-cols-3 sm:grid-cols-4
<div className="grid grid-cols-3 sm:grid-cols-4 gap-3">

// Line 146: Change border and rounded from border-2 rounded-md to border-2 rounded-lg
className="relative group aspect-square rounded-lg border-2 border-border bg-muted overflow-hidden hover:border-primary transition-all"

// Line 224-238: Update empty state text sizes
<div className="flex flex-col items-center gap-4 text-center pointer-events-none">
    <div className="rounded-full bg-muted p-6 group-hover:bg-primary/10 transition-colors">
        <Upload className={cn(
            "h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors",
            isCompressing && "animate-pulse"
        )} aria-hidden="true" />
    </div>
    <div className="space-y-2">
        <p className="text-xl font-semibold">
            {isCompressing ? "Przetwarzanie…" : "Przeciągnij zdjęcia tutaj"}
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
            {isCompressing ? "Optymalizacja obrazów…" : "lub kliknij, aby wybrać pliki"}
        </p>
    </div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ImageIcon className="h-4 w-4" aria-hidden="true" />
        <span>JPG, PNG, WEBP • automatyczna optymalizacja • do {MAX_IMAGES} zdjęć</span>
    </div>
</div>
```

**Step 2: Test dropzone changes**

Run dev server and check dropzone appearance:
```bash
npm run dev
```

Expected: Larger icons and text in empty state, 3-4 column grid for thumbnails

**Step 3: Commit UploadDropzone updates**

```bash
git add components/UploadDropzone.tsx
git commit -m "style: improve UploadDropzone grid and empty state styling"
```

---

## Task 6: Refactor ProductForm to use new components

**Files:**
- Modify: `components/ProductForm.tsx`

**Step 1: Import new components and restructure**

Replace platform and tone sections with new components:

```tsx
// Add imports at top
import { PlatformSelector } from "@/components/PlatformSelector";
import { ToneSelector } from "@/components/ToneSelector";
import { ConditionSegmentedControl } from "@/components/ConditionSegmentedControl";

// Replace lines 76-107 (Platform section) with:
<PlatformSelector
    platform={platform}
    onPlatformChange={onPlatformChange}
/>

// Replace lines 109-205 (Tone section) with:
<ToneSelector
    selectedTone={selectedTone}
    onToneChange={onToneChange}
/>

// Replace lines 232-261 (Condition section) with:
<ConditionSegmentedControl
    condition={condition}
    onConditionChange={onConditionChange}
/>
```

**Step 2: Update spacing from space-y-4 to space-y-6**

```tsx
// Line 75: Update container spacing
return (
    <div className="space-y-6">
        {/* Components... */}
    </div>
);
```

**Step 3: Update price section label**

```tsx
// Line 283: Change "Zasugeruj cenę" to "AI zasugeruje cenę"
<span className="text-sm font-medium group-hover:text-foreground">
    AI zasugeruje cenę
</span>
```

**Step 4: Test refactored form**

```bash
npm run dev
```

Expected: Form renders with new components, all interactions work

**Step 5: Commit ProductForm refactor**

```bash
git add components/ProductForm.tsx
git commit -m "refactor: use new components in ProductForm (PlatformSelector, ToneSelector, ConditionSegmentedControl)"
```

---

## Task 7: Update main page layout to 2x2 grid

**Files:**
- Modify: `app/page.tsx`

**Step 1: Import CardWrapper**

```tsx
// Add import at top (around line 11)
import { CardWrapper } from "@/components/ui/card-wrapper";
```

**Step 2: Update hero section typography**

```tsx
// Line 273-276: Remove font-serif, change font-normal to font-bold
<h1 id="page-title" className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight">
    Sprzedaj szybciej <br className="hidden sm:inline" />
    <span className="text-primary">z lepszym opisem</span>
</h1>
```

**Step 3: Restructure form to 2x2 grid with cards**

Replace lines 284-340 (form section) with:

```tsx
{/* Form Section - 2x2 Grid */}
{!result && (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Photos */}
        <CardWrapper title="Zdjęcia produktu" icon={Camera}>
            <UploadDropzone
                images={images}
                onImagesChange={setImages}
            />
        </CardWrapper>

        {/* Card 2: Platform + Tone */}
        <CardWrapper className="space-y-6">
            <ProductForm
                platform={platform}
                productName={productName}
                condition={condition}
                price={price}
                delivery={delivery}
                notes={notes}
                selectedTone={selectedTone}
                priceType={priceType}
                onPlatformChange={setPlatform}
                onProductNameChange={setProductName}
                onConditionChange={setCondition}
                onPriceChange={setPrice}
                onDeliveryChange={setDelivery}
                onNotesChange={setNotes}
                onToneChange={setSelectedTone}
                onPriceTypeChange={setPriceType}
            />
        </CardWrapper>

        {/* Card 3: Parameters (part of ProductForm, will be split in next task) */}

        {/* Card 4: Notes + CTA (will be created in next task) */}
    </div>
)}
```

**Step 4: Test grid layout**

```bash
npm run dev
```

Expected: Desktop shows 2 cards side by side, mobile stacks vertically

**Step 5: Commit grid layout changes**

```bash
git add app/page.tsx
git commit -m "refactor: restructure main page to 2x2 grid layout with CardWrapper"
```

---

## Task 8: Split ProductForm into separate cards

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/ProductForm.tsx`

**Step 1: Extract parameters section from ProductForm**

Create separate sections in ProductForm for Card 3 and Card 4:

In `components/ProductForm.tsx`, split into two exported components:

```tsx
// Keep existing imports and interface

// New component for Card 3 (Parameters)
export function ProductParameters({
    productName,
    condition,
    price,
    delivery,
    priceType,
    onProductNameChange,
    onConditionChange,
    onPriceChange,
    onDeliveryChange,
    onPriceTypeChange,
}: Omit<ProductFormProps, 'platform' | 'notes' | 'selectedTone' | 'onPlatformChange' | 'onNotesChange' | 'onToneChange'>) {
    // Move name, condition, price, delivery sections here
    return (
        <div className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
                <label htmlFor="productName" className="text-sm font-medium leading-none">
                    Nazwa produktu{" "}
                    <span className="text-muted-foreground text-xs">(opcjonalne)</span>
                </label>
                <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => onProductNameChange(e.target.value)}
                    placeholder="np. iPhone 13 Pro, Krzesło IKEA…"
                    maxLength={200}
                    aria-describedby="productName-hint"
                />
                <p id="productName-hint" className="text-xs text-muted-foreground">
                    Jeśli nie podasz nazwy, AI rozpozna produkt ze zdjęcia
                </p>
            </div>

            {/* Condition */}
            <ConditionSegmentedControl
                condition={condition}
                onConditionChange={onConditionChange}
            />

            {/* Price Type */}
            <fieldset className="space-y-3">
                <legend className="text-sm font-medium leading-none">
                    Cena <span className="text-destructive">*</span>
                </legend>
                <div className="space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="priceType"
                            value="ai_suggest"
                            checked={priceType === "ai_suggest"}
                            onChange={(e) => onPriceTypeChange(e.target.value as PriceType)}
                            className="mt-0.5 h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium group-hover:text-foreground">
                                AI zasugeruje cenę
                            </span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                AI zaproponuje odpowiednią cenę na podstawie produktu
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="priceType"
                            value="user_provided"
                            checked={priceType === "user_provided"}
                            onChange={(e) => onPriceTypeChange(e.target.value as PriceType)}
                            className="mt-0.5 h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium group-hover:text-foreground">
                                Podaję swoją cenę
                            </span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Wprowadź konkretną kwotę do ogłoszenia
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="priceType"
                            value="free"
                            checked={priceType === "free"}
                            onChange={(e) => onPriceTypeChange(e.target.value as PriceType)}
                            className="mt-0.5 h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium group-hover:text-foreground">
                                Oddam za darmo
                            </span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Produkt zostanie oznaczony jako darmowy
                            </p>
                        </div>
                    </label>
                </div>

                {priceType === "user_provided" && (
                    <div className="space-y-2 pt-2">
                        <label htmlFor="userPrice" className="text-sm font-medium leading-none">
                            Twoja cena <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                id="userPrice"
                                name="price"
                                type="number"
                                inputMode="decimal"
                                min="0"
                                max="999999"
                                step="0.01"
                                value={price}
                                onChange={(e) => onPriceChange(e.target.value)}
                                placeholder="0.00"
                                className="pr-12"
                                aria-label="Cena produktu"
                                autoComplete="off"
                                required
                            />
                            <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
                                aria-label="Waluta"
                            >
                                PLN
                            </span>
                        </div>
                    </div>
                )}
            </fieldset>

            {/* Delivery */}
            <fieldset className="space-y-2">
                <legend className="text-sm font-medium leading-none">
                    Sposób dostawy <span className="text-destructive">*</span>
                </legend>
                <div className="flex flex-wrap gap-4" role="group" aria-label="Wybór sposobu dostawy">
                    {(Object.entries(DELIVERY_NAMES) as [DeliveryOption, string][]).map(
                        ([value, label]) => (
                            <label
                                key={value}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={delivery.includes(value)}
                                    onChange={() => {
                                        onDeliveryChange((prevDelivery) => {
                                            if (prevDelivery.includes(value)) {
                                                if (prevDelivery.length > 1) {
                                                    return prevDelivery.filter((d) => d !== value);
                                                }
                                                return prevDelivery;
                                            } else {
                                                return [...prevDelivery, value];
                                            }
                                        });
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    aria-label={label}
                                />
                                <span className="text-sm group-hover:text-foreground">{label}</span>
                            </label>
                        )
                    )}
                </div>
                {delivery.length === 0 && (
                    <p className="text-xs text-destructive" role="alert" aria-live="polite">
                        Wybierz przynajmniej jedną opcję
                    </p>
                )}
            </fieldset>
        </div>
    );
}

// New component for Card 4 (Notes + CTA)
export function NotesAndCTA({
    notes,
    canSubmit,
    isOffline,
    onNotesChange,
    onSubmit,
}: {
    notes: string;
    canSubmit: boolean;
    isOffline: boolean;
    onNotesChange: (value: string) => void;
    onSubmit: () => void;
}) {
    return (
        <div className="flex flex-col h-full">
            {/* Notes textarea - takes most space */}
            <div className="flex-1 space-y-2">
                <label htmlFor="notes" className="text-sm font-medium leading-none">
                    Dodatkowe informacje{" "}
                    <span className="text-muted-foreground text-xs">(opcjonalne)</span>
                </label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="np. uszkodzenia, braki, wymiary, historia produktu…"
                    rows={8}
                    maxLength={1000}
                    aria-describedby="notes-hint"
                    className="min-h-[200px] resize-none"
                />
                <p id="notes-hint" className="text-xs text-muted-foreground">
                    {notes.length}/1000 znaków
                </p>
            </div>

            {/* CTA Button - sticky to bottom */}
            <div className="sticky bottom-0 pt-4 bg-card">
                <Button
                    type="button"
                    size="lg"
                    className="w-full h-14 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={onSubmit}
                    disabled={!canSubmit || isOffline}
                    aria-label="Generuj ogłoszenie sprzedażowe"
                    title={isOffline ? "Brak połączenia z internetem" : undefined}
                >
                    <Send className="h-5 w-5 mr-2" aria-hidden="true" />
                    {isOffline ? "Brak połączenia" : "Generuj ogłoszenie"}
                </Button>
            </div>
        </div>
    );
}

// Keep original ProductForm for backward compatibility during refactor
export function ProductForm(props: ProductFormProps) {
    // For now, just render platform and tone selectors
    return (
        <div className="space-y-6">
            <PlatformSelector
                platform={props.platform}
                onPlatformChange={props.onPlatformChange}
            />
            <ToneSelector
                selectedTone={props.selectedTone}
                onToneChange={props.onToneChange}
            />
        </div>
    );
}
```

**Step 2: Update page.tsx to use new split components**

```tsx
// Around line 11: Add imports
import { ProductForm, ProductParameters, NotesAndCTA } from "@/components/ProductForm";

// Replace grid section (around line 284) with complete 2x2 grid:
{!result && (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Photos */}
        <CardWrapper title="Zdjęcia produktu" icon={Camera}>
            <UploadDropzone
                images={images}
                onImagesChange={setImages}
            />
        </CardWrapper>

        {/* Card 2: Platform + Tone */}
        <CardWrapper>
            <ProductForm
                platform={platform}
                productName={productName}
                condition={condition}
                price={price}
                delivery={delivery}
                notes={notes}
                selectedTone={selectedTone}
                priceType={priceType}
                onPlatformChange={setPlatform}
                onProductNameChange={setProductName}
                onConditionChange={setCondition}
                onPriceChange={setPrice}
                onDeliveryChange={setDelivery}
                onNotesChange={setNotes}
                onToneChange={setSelectedTone}
                onPriceTypeChange={setPriceType}
            />
        </CardWrapper>

        {/* Card 3: Parameters */}
        <CardWrapper>
            <ProductParameters
                productName={productName}
                condition={condition}
                price={price}
                delivery={delivery}
                priceType={priceType}
                onProductNameChange={setProductName}
                onConditionChange={setCondition}
                onPriceChange={setPrice}
                onDeliveryChange={setDelivery}
                onPriceTypeChange={setPriceType}
            />
        </CardWrapper>

        {/* Card 4: Notes + CTA */}
        <CardWrapper className="flex flex-col">
            <NotesAndCTA
                notes={notes}
                canSubmit={canSubmit}
                isOffline={isOffline}
                onNotesChange={setNotes}
                onSubmit={handleSubmit}
            />
        </CardWrapper>
    </div>
)}

{/* Remove old submit button section (around line 362-377) - now integrated in Card 4 */}
```

**Step 3: Add missing imports to ProductForm.tsx**

```tsx
// Add at top of ProductForm.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ConditionSegmentedControl } from "@/components/ConditionSegmentedControl";
import { DeliveryOption, DELIVERY_NAMES } from "@/lib/types";
```

**Step 4: Test complete 2x2 grid**

```bash
npm run dev
```

Expected: Desktop shows 4 cards in 2x2 grid, mobile stacks vertically, CTA button sticky at bottom of Card 4

**Step 5: Commit split form changes**

```bash
git add app/page.tsx components/ProductForm.tsx
git commit -m "refactor: split ProductForm into 4 separate cards (Photos, Platform+Tone, Parameters, Notes+CTA)"
```

---

## Task 9: Add fade-in animation to Tailwind config

**Files:**
- Modify: `tailwind.config.ts`

**Step 1: Add custom animation**

Add fade-in animation to Tailwind config:

```ts
// In tailwind.config.ts, add to theme.extend:
animation: {
  'fade-in': 'fadeIn 0.2s ease-in-out',
},
keyframes: {
  fadeIn: {
    '0%': { opacity: '0', transform: 'translateY(-4px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
},
```

**Step 2: Update ToneSelector to use new animation**

```tsx
// In components/ToneSelector.tsx, replace animate-in classes with:
<div
    className="text-sm text-muted-foreground space-y-1 animate-fade-in"
    aria-live="polite"
>
```

**Step 3: Test animation**

```bash
npm run dev
```

Expected: Tone description fades in smoothly when switching tones

**Step 4: Commit animation config**

```bash
git add tailwind.config.ts components/ToneSelector.tsx
git commit -m "feat: add fade-in animation for tone descriptions"
```

---

## Task 10: Final styling polish and testing

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/ui/card-wrapper.tsx`

**Step 1: Ensure min-heights for cards**

Update CardWrapper to support min-height variants:

```tsx
// In components/ui/card-wrapper.tsx, update className:
<div
    className={cn(
        "bg-card border border-border rounded-xl shadow-sm p-6 transition-shadow duration-200 hover:shadow-md",
        className
    )}
>
```

**Step 2: Add min-heights in page.tsx**

```tsx
// In app/page.tsx grid section, add min-heights:
{/* Card 1: Photos */}
<CardWrapper title="Zdjęcia produktu" icon={Camera} className="min-h-[400px]">

{/* Card 2: Platform + Tone */}
<CardWrapper className="min-h-[400px]">

{/* Card 3: Parameters */}
<CardWrapper className="min-h-[500px]">

{/* Card 4: Notes + CTA */}
<CardWrapper className="min-h-[500px] flex flex-col">
```

**Step 3: Test responsive behavior**

Test at different breakpoints:
```bash
npm run dev
```

Check:
- Desktop (≥1024px): 2x2 grid visible
- Tablet (768-1023px): Single column stack
- Mobile (<768px): Single column stack, condition shows radio buttons

**Step 4: Test all interactions**

Manually test:
- Platform tiles selection
- Tone segmented control with keyboard navigation
- Condition segmented control (desktop) vs radio buttons (mobile)
- Price type radio with conditional input
- Delivery checkboxes validation
- Notes textarea character counter
- CTA button disabled states
- Image upload and grid display

**Step 5: Commit final polish**

```bash
git add app/page.tsx components/ui/card-wrapper.tsx
git commit -m "style: add min-heights to cards and final responsive polish"
```

---

## Task 11: Update CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update UI Components section**

Add new components to documentation:

```markdown
**UI Components:**
- `components/ui/card-wrapper.tsx` - Reusable card wrapper with optional header
- `components/PlatformSelector.tsx` - 2x2 grid of platform tiles with icons
- `components/ToneSelector.tsx` - Horizontal segmented control for tone selection
- `components/ConditionSegmentedControl.tsx` - Responsive condition selector (segmented/radio)
- `components/ProductForm.tsx` - Main form with platform and tone selectors
- `components/UploadDropzone.tsx` - Drag-and-drop image upload with validation
- `components/AdResult.tsx` - Display generated listing with copy buttons
- `components/ThemeProvider.tsx` & `components/ThemeToggle.tsx` - Dark/light mode
- `components/ui/*` - Reusable UI primitives (buttons, inputs, cards, badges, etc.)
```

**Step 2: Update Important Patterns section**

Add new layout pattern:

```markdown
**Layout Pattern (2x2 Dashboard Grid):**
- Desktop (≥1024px): 2x2 grid with 4 cards
  - Card 1: Photo upload dropzone
  - Card 2: Platform tiles + Tone segmented control
  - Card 3: Product parameters (name, condition, price, delivery)
  - Card 4: Additional notes + sticky CTA button
- Mobile (<1024px): Vertical stack of same cards
- Cards: Consistent styling via CardWrapper component
```

**Step 3: Update Code Style section**

Add component-specific style notes:

```markdown
**Component Patterns:**
- Segmented controls: Horizontal button group in muted container
- Platform tiles: 2x2 grid with icons and hover states
- Responsive components: Desktop segmented control, mobile radio buttons
- Sticky CTA: Bottom-positioned button in Card 4 for easy access
```

**Step 4: Commit documentation updates**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with new UI components and layout patterns"
```

---

## Task 12: Manual verification and final commit

**Files:**
- N/A (testing only)

**Step 1: Run full application test**

Start dev server and test complete flow:
```bash
npm run dev
```

Test checklist:
- [ ] Desktop 2x2 grid displays correctly
- [ ] Mobile vertical stack displays correctly
- [ ] All 4 platform tiles are clickable and show selected state
- [ ] Tone segmented control switches and shows descriptions
- [ ] Condition segmented control works (desktop) and radio buttons (mobile)
- [ ] Price type switches correctly, user input appears when selected
- [ ] Delivery checkboxes validate (at least one required)
- [ ] Notes textarea counts characters correctly
- [ ] CTA button is sticky in Card 4 and disabled when invalid
- [ ] Image upload works in Card 1 with 3-4 column grid
- [ ] Form submission generates listing correctly
- [ ] Theme toggle works (dark/light mode)
- [ ] No console errors or TypeScript warnings

**Step 2: Run linter**

```bash
npm run lint
```

Expected: No linting errors

**Step 3: Build production version**

```bash
npm run build
```

Expected: Build succeeds without errors

**Step 4: Create final summary commit**

If any small fixes were needed during testing, commit them:
```bash
git add .
git commit -m "fix: minor adjustments from manual testing"
```

**Step 5: Tag completion**

Create a git tag for this redesign milestone:
```bash
git tag -a ui-redesign-v1 -m "Complete UI redesign: 2x2 dashboard grid layout"
```

---

## Success Criteria

**Visual:**
- ✅ Desktop shows entire form in 2x2 grid without scrolling
- ✅ Mobile shows vertical stack with logical flow
- ✅ Platform tiles use icons for quick recognition
- ✅ Segmented controls reduce visual noise vs radio buttons
- ✅ CTA button is prominent with orange-500 color
- ✅ Typography is unified (no font-serif, all font-sans)
- ✅ Cards have consistent styling with hover effects

**Functional:**
- ✅ All form interactions work identically to before
- ✅ Platform → Tone auto-select logic preserved
- ✅ Form validation works (images, delivery, price)
- ✅ Keyboard navigation works for all controls
- ✅ ARIA labels and roles for accessibility
- ✅ Responsive breakpoints function correctly

**Technical:**
- ✅ No TypeScript errors
- ✅ No console warnings
- ✅ Production build succeeds
- ✅ Bundle size unchanged or improved
- ✅ Existing performance optimizations maintained

---

## Rollback Plan

If issues arise, rollback with:

```bash
# Revert to commit before Task 1
git log --oneline
git reset --hard <commit-hash-before-task-1>
```

Or revert specific commits:
```bash
git revert <commit-hash>
```

---

**Implementation complete!** All 12 tasks create a fully functional 2x2 dashboard grid layout with modern segmented controls, platform tiles, and improved visual hierarchy.
