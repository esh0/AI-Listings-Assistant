"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Platform, PLATFORM_NAMES } from "@/lib/types";

interface FullscreenLoadingProps {
    isLoading: boolean;
    duration?: number; // Duration in seconds for the progress bar
    imageCount: number;
    platform: Platform;
}

/**
 * Returns dynamic loading message based on progress and platform
 * Phase 1: Progress-based messages (0-100%)
 * Phase 2: Indeterminate tips rotation (every 5s)
 */
function getLoadingMessage(
    progress: number,
    isIndeterminate: boolean,
    platform: Platform,
    indeterminateTime: number
): string {
    // Phase 2: Indeterminate tips (rotate every 5s)
    if (isIndeterminate) {
        const tipIndex = Math.floor(indeterminateTime / 5000) % 3;
        const tips = [
            `Optymalizowanie treści dla ${PLATFORM_NAMES[platform]}...`,
            "Sprawdzanie jakości opisu i zgodności z zasadami platformy...",
            "To trwa nieco dłużej niż zwykle, ale już prawie gotowe...",
        ];
        return tips[tipIndex];
    }

    // Phase 1: Progress-based messages
    if (progress < 20) {
        return "Analizuje zdjęcia i rozpoznaje produkt...";
    } else if (progress < 40) {
        return `Przygotowuje tytuł i opis dla ${PLATFORM_NAMES[platform]}...`;
    } else if (progress < 70) {
        return "Analizuje stan przedmiotu i sugeruje cenę...";
    } else if (progress < 90) {
        return "Ocenia jakość zdjęć i tworzy rekomendacje...";
    } else {
        return "Finalizowanie ogłoszenia...";
    }
}

export function FullscreenLoading({
    isLoading,
    duration = 15,
    imageCount,
    platform,
}: FullscreenLoadingProps) {
    const [progress, setProgress] = useState(0);
    const [isIndeterminate, setIsIndeterminate] = useState(false);
    const [indeterminateTime, setIndeterminateTime] = useState(0);

    // Calculate duration based on image count: 10 base + 1 second per image
    const calculatedDuration = 10 + imageCount * 1;
    const effectiveDuration = calculatedDuration;

    useEffect(() => {
        if (!isLoading) {
            setProgress(0);
            setIsIndeterminate(false);
            setIndeterminateTime(0);
            return;
        }

        // Start progress animation
        const startTime = Date.now();
        const endTime = startTime + effectiveDuration * 1000;
        let indeterminateStartTime: number | null = null;

        const updateProgress = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const percentage = Math.min((elapsed / (effectiveDuration * 1000)) * 100, 100);

            if (percentage >= 100) {
                setIsIndeterminate(true);
                setProgress(100);

                // Track indeterminate time
                if (indeterminateStartTime === null) {
                    indeterminateStartTime = now;
                }
                const indeterminateElapsed = now - indeterminateStartTime;
                setIndeterminateTime(indeterminateElapsed);
            } else {
                setProgress(percentage);
            }
        };

        // Update every 100ms for smooth animation
        const interval = setInterval(updateProgress, 100);
        updateProgress(); // Initial call

        return () => clearInterval(interval);
    }, [isLoading, effectiveDuration, imageCount]);

    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4 animate-fade-in"
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Animated Icon - refined spinner */}
                <div className="relative mx-auto w-20 h-20" aria-hidden="true">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div
                        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                        style={{ animationDuration: '0.8s' }}
                    />
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        AI pracuje...
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed transition-opacity duration-300">
                        {getLoadingMessage(progress, isIndeterminate, platform, indeterminateTime)}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                    <div
                        className="h-1.5 w-full bg-muted rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={Math.round(progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Postęp generowania ogłoszenia"
                    >
                        {isIndeterminate ? (
                            <div className="h-full w-1/3 bg-primary rounded-full animate-indeterminate" />
                        ) : (
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground tabular-nums">
                        {isIndeterminate
                            ? "Finalizowanie..."
                            : `${Math.round(progress)}%`}
                    </p>
                </div>
            </div>
        </div>
    );
}