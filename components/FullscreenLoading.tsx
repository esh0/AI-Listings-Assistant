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

export function FullscreenLoading({
    isLoading,
    duration = 15,
    imageCount,
    platform,
}: FullscreenLoadingProps) {
    const [progress, setProgress] = useState(0);
    const [isIndeterminate, setIsIndeterminate] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setProgress(0);
            setIsIndeterminate(false);
            return;
        }

        // Start progress animation
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;

        const updateProgress = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const percentage = Math.min((elapsed / (duration * 1000)) * 100, 100);

            if (percentage >= 100) {
                setIsIndeterminate(true);
                setProgress(100);
            } else {
                setProgress(percentage);
            }
        };

        // Update every 100ms for smooth animation
        const interval = setInterval(updateProgress, 100);
        updateProgress(); // Initial call

        return () => clearInterval(interval);
    }, [isLoading, duration]);

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
                    <h2 className="font-sans text-2xl font-normal tracking-tight">
                        AI pracuje...
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        Analizuje zdjęcia i tworzy profesjonalne ogłoszenie
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
                    <p className="text-sm text-muted-foreground font-mono tabular-nums tracking-wide">
                        {isIndeterminate
                            ? "Finalizowanie..."
                            : `${Math.round(progress)}%`}
                    </p>
                </div>
            </div>
        </div>
    );
}