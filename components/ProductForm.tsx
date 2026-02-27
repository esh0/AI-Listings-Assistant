"use client";

import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
    Platform,
    ProductCondition,
    DeliveryOption,
    ToneStyle,
    PriceType,
    PLATFORM_NAMES,
    CONDITION_NAMES,
    DELIVERY_NAMES,
    PLATFORM_DEFAULT_TONES,
    TONE_STYLE_NAMES,
    TONE_STYLE_DESCRIPTIONS,
} from "@/lib/types";

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
    onDeliveryChange: (value: DeliveryOption[]) => void;
    onNotesChange: (value: string) => void;
    onToneChange: (value: ToneStyle) => void;
    onPriceTypeChange: (value: PriceType) => void;
}

export function ProductForm({
    platform,
    productName,
    condition,
    price,
    delivery,
    notes,
    selectedTone,
    priceType,
    onPlatformChange,
    onProductNameChange,
    onConditionChange,
    onPriceChange,
    onDeliveryChange,
    onNotesChange,
    onToneChange,
    onPriceTypeChange,
}: ProductFormProps) {
    const handleDeliveryToggle = React.useCallback((option: DeliveryOption) => {
        if (delivery.includes(option)) {
            if (delivery.length > 1) {
                onDeliveryChange(delivery.filter((d) => d !== option));
            }
        } else {
            onDeliveryChange([...delivery, option]);
        }
    }, [delivery, onDeliveryChange]);

    return (
        <div className="space-y-4">
            {/* Platform */}
            <fieldset className="space-y-3">
                <legend className="text-sm font-medium leading-none">
                    Platforma sprzedażowa{" "}
                    <span className="text-destructive">*</span>
                </legend>
                <div className="space-y-2">
                    {(Object.entries(PLATFORM_NAMES) as [Platform, string][]).map(
                        ([value, label]) => (
                            <label
                                key={value}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="radio"
                                    name="platform"
                                    value={value}
                                    checked={platform === value}
                                    onChange={(e) =>
                                        onPlatformChange(e.target.value as Platform)
                                    }
                                    className="h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-required="true"
                                />
                                <span className="text-sm font-medium group-hover:text-foreground">
                                    {label}
                                </span>
                            </label>
                        )
                    )}
                </div>
            </fieldset>

            {/* Tone Style */}
            <fieldset className="space-y-3">
                <legend className="text-sm font-medium leading-none">
                    Styl komunikacji <span className="text-destructive">*</span>
                </legend>
                <div className="space-y-2">
                    <label
                        className="flex items-start gap-3 cursor-pointer group"
                    >
                        <input
                            type="radio"
                            name="tone"
                            value="professional"
                            checked={selectedTone === "professional"}
                            onChange={(e) =>
                                onToneChange(e.target.value as ToneStyle)
                            }
                            className="mt-0.5 h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-describedby="tone-professional-description"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium group-hover:text-foreground">
                                {TONE_STYLE_NAMES["professional"]}
                            </span>
                            <p
                                id="tone-professional-description"
                                className="text-xs text-muted-foreground mt-0.5"
                            >
                                {TONE_STYLE_DESCRIPTIONS["professional"]}
                                <span className="block mt-1 text-blue-600 dark:text-blue-400 font-medium">
                                    ⭐ Polecany dla: Allegro Lokalnie
                                </span>
                            </p>
                        </div>
                    </label>

                    <label
                        className="flex items-start gap-3 cursor-pointer group"
                    >
                        <input
                            type="radio"
                            name="tone"
                            value="friendly"
                            checked={selectedTone === "friendly"}
                            onChange={(e) =>
                                onToneChange(e.target.value as ToneStyle)
                            }
                            className="mt-0.5 h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-describedby="tone-friendly-description"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium group-hover:text-foreground">
                                {TONE_STYLE_NAMES["friendly"]}
                            </span>
                            <p
                                id="tone-friendly-description"
                                className="text-xs text-muted-foreground mt-0.5"
                            >
                                {TONE_STYLE_DESCRIPTIONS["friendly"]}
                                <span className="block mt-1 text-blue-600 dark:text-blue-400 font-medium">
                                    ⭐ Polecany dla: Facebook Marketplace, Vinted
                                </span>
                            </p>
                        </div>
                    </label>

                    <label
                        className="flex items-start gap-3 cursor-pointer group"
                    >
                        <input
                            type="radio"
                            name="tone"
                            value="casual"
                            checked={selectedTone === "casual"}
                            onChange={(e) =>
                                onToneChange(e.target.value as ToneStyle)
                            }
                            className="mt-0.5 h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-describedby="tone-casual-description"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium group-hover:text-foreground">
                                {TONE_STYLE_NAMES["casual"]}
                            </span>
                            <p
                                id="tone-casual-description"
                                className="text-xs text-muted-foreground mt-0.5"
                            >
                                {TONE_STYLE_DESCRIPTIONS["casual"]}
                                <span className="block mt-1 text-blue-600 dark:text-blue-400 font-medium">
                                    ⭐ Polecany dla: OLX
                                </span>
                            </p>
                        </div>
                    </label>
                </div>
            </fieldset>

            {/* Product Name */}
            <div className="space-y-2">
                <label
                    htmlFor="productName"
                    className="text-sm font-medium leading-none"
                >
                    Nazwa produktu{" "}
                    <span className="text-muted-foreground text-xs">
                        (opcjonalne)
                    </span>
                </label>
                <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => onProductNameChange(e.target.value)}
                    placeholder="np. iPhone 13 Pro, Krzesło IKEA, Kurtka zimowa…"
                    maxLength={200}
                    aria-describedby="productName-hint"
                />
                <p id="productName-hint" className="text-xs text-muted-foreground">
                    Jeśli nie podasz nazwy, AI rozpozna produkt ze zdjęcia
                </p>
            </div>

            {/* Condition */}
            <fieldset className="space-y-3">
                <legend className="text-sm font-medium leading-none">
                    Stan produktu <span className="text-destructive">*</span>
                </legend>
                <div className="space-y-2">
                    {(Object.entries(CONDITION_NAMES) as [ProductCondition, string][]).map(
                        ([value, label]) => (
                            <label
                                key={value}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <input
                                    type="radio"
                                    name="condition"
                                    value={value}
                                    checked={condition === value}
                                    onChange={(e) =>
                                        onConditionChange(e.target.value as ProductCondition)
                                    }
                                    className="h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-required="true"
                                />
                                <span className="text-sm font-medium group-hover:text-foreground">
                                    {label}
                                </span>
                            </label>
                        )
                    )}
                </div>
            </fieldset>

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
                            onChange={(e) =>
                                onPriceTypeChange(e.target.value as PriceType)
                            }
                            className="mt-0.5 h-4 w-4 border-gray-300 accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium group-hover:text-foreground">
                                Zasugeruj cenę
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
                            onChange={(e) =>
                                onPriceTypeChange(e.target.value as PriceType)
                            }
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
                            onChange={(e) =>
                                onPriceTypeChange(e.target.value as PriceType)
                            }
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
                        <label
                            htmlFor="userPrice"
                            className="text-sm font-medium leading-none"
                        >
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
                <div className="flex flex-wrap gap-2" role="group" aria-label="Wybór sposobu dostawy">
                    {(
                        Object.entries(DELIVERY_NAMES) as [
                            DeliveryOption,
                            string
                        ][]
                    ).map(([value, label]) => (
                        <label
                            key={value}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={delivery.includes(value)}
                                onChange={() => handleDeliveryToggle(value)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label={label}
                            />
                            <span className="text-sm group-hover:text-foreground">{label}</span>
                        </label>
                    ))}
                </div>
                {delivery.length === 0 && (
                    <p className="text-xs text-destructive" role="alert" aria-live="polite">
                        Wybierz przynajmniej jedną opcję
                    </p>
                )}
            </fieldset>

            {/* Notes */}
            <div className="space-y-2">
                <label
                    htmlFor="notes"
                    className="text-sm font-medium leading-none"
                >
                    Dodatkowe informacje{" "}
                    <span className="text-muted-foreground text-xs">
                        (opcjonalne)
                    </span>
                </label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="np. uszkodzenia, braki, wymiary, historia produktu…"
                    rows={3}
                    maxLength={1000}
                    aria-describedby="notes-hint"
                />
                <p id="notes-hint" className="text-xs text-muted-foreground">
                    {notes.length}/1000 znaków
                </p>
            </div>
        </div>
    );
}