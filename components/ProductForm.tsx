"use client";

import React, { memo, useCallback, useState, useRef, useEffect } from "react";
import { Sparkles, ShoppingBag, Store, Facebook, Shirt, Crown, ShoppingCart, Package, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Platform,
    ProductCondition,
    DeliveryOption,
    ToneStyle,
    PriceType,
    PLATFORM_NAMES,
    DELIVERY_NAMES,
    PLATFORM_DEFAULT_TONES,
    TONE_STYLE_NAMES,
    FREE_TONES,
    ADVANCED_TONES,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const LOCKED_PLATFORMS: Platform[] = ["ebay", "amazon", "etsy"];

// Platform icons with brand colors (intentional hardcoded per CLAUDE.md exceptions)
const PLATFORM_ICONS = {
    olx: { Icon: ShoppingBag, color: "text-orange-500" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600" },
    vinted: { Icon: Shirt, color: "text-teal-600" },
    ebay: { Icon: ShoppingCart, color: "text-yellow-500" },
    amazon: { Icon: Package, color: "text-yellow-600" },
    etsy: { Icon: Tag, color: "text-orange-400" },
} as const;

// Condition short labels
const CONDITION_SHORT: Record<ProductCondition, string> = {
    nowy: "Nowy",
    "używany, jak nowy": "Jak nowy",
    "używany, w dobrym stanie": "Bardzo dobry",
    "używany, w przeciętnym stanie": "Dobry",
    uszkodzony: "Dostateczny",
};

const CONDITIONS: ProductCondition[] = [
    "nowy",
    "używany, jak nowy",
    "używany, w dobrym stanie",
    "używany, w przeciętnym stanie",
    "uszkodzony",
];

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
    customToneActive?: boolean;  // NEW — when true, hides tone selector and shows "Styl z szablonu: Własny"
}

// Component for Card 2: Platform + Tone
export function ProductForm({
    platform,
    selectedTone,
    onPlatformChange,
    onToneChange,
    userPlan,
    customToneActive,
}: Pick<ProductFormProps, 'platform' | 'selectedTone' | 'onPlatformChange' | 'onToneChange' | 'userPlan' | 'customToneActive'>) {
    const handlePlatformChange = useCallback((p: Platform) => {
        onPlatformChange(p);
        onToneChange(PLATFORM_DEFAULT_TONES[p]);
    }, [onPlatformChange, onToneChange]);

    const [tooltipTone, setTooltipTone] = useState<ToneStyle | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleLockedToneClick = (tone: ToneStyle) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setTooltipTone(tone);
        timerRef.current = setTimeout(() => setTooltipTone(null), 2000);
    };

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

    return (
        <div className="space-y-6">
            {/* Platform tiles */}
            <fieldset className="space-y-3">
                <legend className="text-sm font-medium leading-none">
                    Platforma sprzedażowa
                </legend>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Wybór platformy sprzedażowej">
                    {/* Unlocked platforms */}
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
                    {/* Locked platforms — eBay, Amazon, Etsy (RESELER only) */}
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
            </fieldset>

            {/* Tone pills */}
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
                    {ADVANCED_TONES.map((tone) => {
                        const isLocked = userPlan === "FREE";
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
                                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                                        {TONE_STYLE_NAMES[tone]}
                                    </button>
                                    {tooltipTone === tone && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs whitespace-nowrap z-10 pointer-events-none">
                                            Dostępne w planach Starter i Reseler
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
                )}
            </fieldset>
        </div>
    );
}

// Component for Card 3: Product Parameters
export function ProductParameters({
    condition,
    price,
    delivery,
    priceType,
    onConditionChange,
    onPriceChange,
    onDeliveryChange,
    onPriceTypeChange,
}: Omit<ProductFormProps, 'platform' | 'notes' | 'selectedTone' | 'productName' | 'onPlatformChange' | 'onNotesChange' | 'onToneChange' | 'onProductNameChange' | 'userPlan'>) {
    const isFreeChecked = priceType === "free";

    const handleDeliveryToggle = useCallback((option: DeliveryOption) => {
        onDeliveryChange((prevDelivery) => {
            if (prevDelivery.includes(option)) {
                if (prevDelivery.length > 1) {
                    return prevDelivery.filter((d) => d !== option);
                }
                return prevDelivery;
            } else {
                return [...prevDelivery, option];
            }
        });
    }, [onDeliveryChange]);

    const handleFreeCheckbox = useCallback((checked: boolean) => {
        if (checked) {
            onPriceTypeChange("free");
            onPriceChange("");
        } else {
            onPriceTypeChange(price ? "user_provided" : "ai_suggest");
        }
    }, [price, onPriceTypeChange, onPriceChange]);

    const handlePriceInput = useCallback((val: string) => {
        const sanitized = val.replace(/[^0-9.]/g, "");
        onPriceChange(sanitized);
        if (!isFreeChecked) {
            onPriceTypeChange(sanitized ? "user_provided" : "ai_suggest");
        }
    }, [isFreeChecked, onPriceChange, onPriceTypeChange]);

    return (
        <div className="space-y-4">
            {/* Condition pills */}
            <fieldset className="space-y-2">
                <legend className="text-sm font-medium leading-none">
                    Stan produktu
                </legend>
                <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Wybór stanu produktu">
                    {CONDITIONS.map((conditionValue) => {
                        const isSelected = condition === conditionValue;
                        return (
                            <button
                                key={conditionValue}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => onConditionChange(conditionValue)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full border text-sm transition-all duration-200",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    isSelected
                                        ? "border-primary bg-primary/10 text-primary cursor-default"
                                        : "border-border text-muted-foreground hover:border-primary/50 cursor-pointer"
                                )}
                            >
                                {CONDITION_SHORT[conditionValue]}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* Price field */}
            <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium leading-none block">
                    Cena <span className="text-muted-foreground text-xs">(opcjonalne — AI zasugeruje cenę, jeśli nie podasz)</span>
                </label>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Input
                            id="price"
                            name="price"
                            type="text"
                            inputMode="decimal"
                            value={price}
                            onChange={(e) => handlePriceInput(e.target.value)}
                            placeholder="0"
                            disabled={isFreeChecked}
                            className="pr-12 h-10 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Cena produktu"
                            autoComplete="off"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" aria-hidden="true">
                            PLN
                        </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group shrink-0 ml-auto">
                        <input
                            type="checkbox"
                            checked={isFreeChecked}
                            onChange={(e) => handleFreeCheckbox(e.target.checked)}
                            className="h-4 w-4 rounded border-input accent-primary focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            aria-label="Za darmo"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground">
                            Za darmo
                        </span>
                    </label>
                </div>
            </div>

            {/* Delivery */}
            <fieldset className="space-y-2">
                <legend className="text-sm font-medium leading-none">
                    Sposób dostawy
                </legend>
                <div className="flex flex-wrap gap-3" role="group" aria-label="Wybór sposobu dostawy">
                    {(Object.entries(DELIVERY_NAMES) as [DeliveryOption, string][]).map(([value, label]) => (
                        <label key={value} className={cn("flex items-center gap-2 group", delivery.length === 1 && delivery.includes(value) ? "cursor-default" : "cursor-pointer")}>
                            <input
                                type="checkbox"
                                checked={delivery.includes(value)}
                                onChange={() => handleDeliveryToggle(value)}
                                disabled={delivery.length === 1 && delivery.includes(value)}
                                className="h-4 w-4 rounded border-input accent-primary focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label={label}
                            />
                            <span className="text-sm group-hover:text-foreground">{label}</span>
                        </label>
                    ))}
                </div>
            </fieldset>
        </div>
    );
}

// Component for Card 4: Notes + CTA
export function NotesAndCTA({
    notes,
    canSubmit,
    hasCredits = true,
    isOffline,
    onNotesChange,
    onSubmit,
}: {
    notes: string;
    canSubmit: boolean;
    hasCredits?: boolean;
    isOffline: boolean;
    onNotesChange: (value: string) => void;
    onSubmit: () => void;
}) {
    const isDisabled = !canSubmit || isOffline || !hasCredits;

    return (
        <div className="flex flex-col h-full">
            {/* Notes textarea */}
            <div className="space-y-2 flex-1 flex flex-col">
                <label htmlFor="notes" className="text-sm font-medium leading-none">
                    Dodatkowe informacje <span className="text-muted-foreground text-xs">(opcjonalne)</span>
                </label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="np. uszkodzenia, braki, wymiary, historia produktu…"
                    rows={3}
                    maxLength={1000}
                    aria-describedby="notes-hint"
                    className="flex-1 min-h-0 resize-none"
                />
                <p id="notes-hint" className="text-xs text-muted-foreground">
                    {notes.length}/1000 znaków
                </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
                <Button
                    type="button"
                    size="lg"
                    variant="gradient"
                    className="w-full h-14 text-lg font-bold"
                    onClick={onSubmit}
                    disabled={isDisabled}
                    aria-label="Generuj ogłoszenie sprzedażowe"
                    title={isOffline ? "Brak połączenia z internetem" : !hasCredits ? "Brak kredytów" : undefined}
                >
                    <Sparkles className="h-5 w-5 mr-2" aria-hidden="true" />
                    {isOffline ? "Brak połączenia" : "Generuj ogłoszenie"}
                </Button>
                {!hasCredits && (
                    <div className="mt-3 text-center text-sm text-muted-foreground">
                        <p className="mb-1">Wykorzystałeś wszystkie kredyty w tym miesiącu.</p>
                        <Link
                            href="/pricing"
                            className="text-primary font-medium hover:underline"
                        >
                            Zmień plan lub dokup kredyty →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
