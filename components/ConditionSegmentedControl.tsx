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
    "używany, jak nowy": "Jak nowy",
    "używany, w dobrym stanie": "Używany",
    "używany, w przeciętnym stanie": "Przeciętny",
    uszkodzony: "Uszkodzony",
};

export function ConditionSegmentedControl({
    condition,
    onConditionChange,
}: ConditionSegmentedControlProps) {
    const conditions: ProductCondition[] = [
        "nowy",
        "używany, jak nowy",
        "używany, w dobrym stanie",
        "używany, w przeciętnym stanie",
        "uszkodzony",
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
