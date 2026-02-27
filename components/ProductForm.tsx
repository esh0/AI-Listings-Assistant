"use client";

import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
    Platform,
    ProductCondition,
    DeliveryOption,
    PLATFORM_NAMES,
    CONDITION_NAMES,
    DELIVERY_NAMES,
} from "@/lib/types";

interface ProductFormProps {
    platform: Platform;
    productName: string;
    condition: ProductCondition;
    price: string;
    delivery: DeliveryOption[];
    notes: string;
    onPlatformChange: (value: Platform) => void;
    onProductNameChange: (value: string) => void;
    onConditionChange: (value: ProductCondition) => void;
    onPriceChange: (value: string) => void;
    onDeliveryChange: (value: DeliveryOption[]) => void;
    onNotesChange: (value: string) => void;
}

export function ProductForm({
    platform,
    productName,
    condition,
    price,
    delivery,
    notes,
    onPlatformChange,
    onProductNameChange,
    onConditionChange,
    onPriceChange,
    onDeliveryChange,
    onNotesChange,
}: ProductFormProps) {
    const platformOptions = React.useMemo(() =>
        Object.entries(PLATFORM_NAMES).map(([value, label]) => ({
            value,
            label,
        })), []
    );

    const conditionOptions = React.useMemo(() =>
        Object.entries(CONDITION_NAMES).map(([value, label]) => ({
            value,
            label,
        })), []
    );

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
            <div className="space-y-2">
                <label
                    htmlFor="platform"
                    className="text-sm font-medium leading-none"
                >
                    Platforma sprzedażowa{" "}
                    <span className="text-destructive">*</span>
                </label>
                <Select
                    id="platform"
                    value={platform}
                    onChange={(e) =>
                        onPlatformChange(e.target.value as Platform)
                    }
                    options={platformOptions}
                    aria-required="true"
                />
            </div>

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
                    placeholder="np. iPhone 13 Pro, Krzesło IKEA, Kurtka zimowa..."
                    maxLength={200}
                    aria-describedby="productName-hint"
                />
                <p id="productName-hint" className="text-xs text-muted-foreground">
                    Jeśli nie podasz nazwy, AI rozpozna produkt ze zdjęcia
                </p>
            </div>

            {/* Condition */}
            <div className="space-y-2">
                <label
                    htmlFor="condition"
                    className="text-sm font-medium leading-none"
                >
                    Stan produktu <span className="text-destructive">*</span>
                </label>
                <Select
                    id="condition"
                    value={condition}
                    onChange={(e) =>
                        onConditionChange(e.target.value as ProductCondition)
                    }
                    options={conditionOptions}
                    aria-required="true"
                />
            </div>

            {/* Price */}
            <div className="space-y-2">
                <label
                    htmlFor="price"
                    className="text-sm font-medium leading-none"
                >
                    Cena{" "}
                    <span className="text-muted-foreground text-xs">
                        (opcjonalne)
                    </span>
                </label>
                <div className="relative">
                    <Input
                        id="price"
                        type="number"
                        min="0"
                        max="999999"
                        step="0.01"
                        value={price}
                        onChange={(e) => onPriceChange(e.target.value)}
                        placeholder="0.00"
                        className="pr-12"
                        aria-describedby="price-hint"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" aria-label="Waluta">
                        PLN
                    </span>
                </div>
                <p id="price-hint" className="text-xs text-muted-foreground">
                    Jeśli nie podasz ceny, AI zasugeruje odpowiednią kwotę
                </p>
            </div>

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
                    placeholder="np. uszkodzenia, braki, wymiary, historia produktu..."
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