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
