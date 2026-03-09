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

            {/* Desktop: Segmented Control */}
            <div
                className="hidden lg:flex gap-1 bg-muted rounded-lg p-1"
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
                                "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
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

            {/* Mobile: Radio Buttons */}
            <div className="lg:hidden space-y-2" role="radiogroup" aria-label="Wybór stylu komunikacji">
                {tones.map((tone) => {
                    const isSelected = selectedTone === tone;
                    return (
                        <label key={tone} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="tone"
                                value={tone}
                                checked={isSelected}
                                onChange={() => onToneChange(tone)}
                                className="h-4 w-4 border-input accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                            <span className="text-sm font-medium group-hover:text-foreground">
                                {TONE_STYLE_NAMES[tone]}
                            </span>
                        </label>
                    );
                })}
            </div>

            {/* Description (shown below when selected) */}
            <div
                className="text-sm text-muted-foreground space-y-1 animate-fade-in"
                aria-live="polite"
            >
                <p>{TONE_STYLE_DESCRIPTIONS[selectedTone]}</p>
                <p className="text-primary font-medium">
                    {TONE_RECOMMENDATIONS[selectedTone]}
                </p>
            </div>
        </fieldset>
    );
}
