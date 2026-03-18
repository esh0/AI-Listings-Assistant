"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Coins, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NoCreditsModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export function NoCreditsModal({ isVisible, onClose }: NoCreditsModalProps) {
    const router = useRouter();
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isVisible) return;

        previouslyFocusedRef.current = document.activeElement as HTMLElement;
        document.body.style.overflow = "hidden";

        const timer = setTimeout(() => modalRef.current?.focus(), 0);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key === "Tab" && modalRef.current) {
                const focusable = modalRef.current.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
            previouslyFocusedRef.current?.focus();
        };
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" aria-hidden="true">
            <Card
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="nocredits-title"
                tabIndex={-1}
                className="relative max-w-md w-full p-5 sm:p-8 outline-none"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                    aria-label="Zamknij"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-4 rounded-full bg-warning/10">
                        <Coins className="h-8 w-8 text-warning" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-5 sm:mb-6">
                    <h2 id="nocredits-title" className="text-xl sm:text-2xl font-bold mb-2">
                        Brak kredytów
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Wykorzystałeś wszystkie kredyty w tym miesiącu. Przejdź na wyższy plan lub dokup jednorazowy pakiet kredytów.
                    </p>
                </div>

                {/* Benefits */}
                <div className="bg-muted rounded-lg p-3 sm:p-4 mb-5 sm:mb-6">
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span><span className="font-medium">Starter</span> — 30 generacji / miesiąc</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span><span className="font-medium">Reseler</span> — 80 generacji / miesiąc</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span><span className="font-medium">Doładowania</span> — jednorazowe pakiety 10, 30 lub 60 kredytów</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => router.push("/dashboard/pricing")}
                        className="w-full h-12 font-semibold"
                        variant="gradient"
                    >
                        <Coins className="h-5 w-5 mr-2" />
                        Zobacz plany i kredyty
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full h-12"
                    >
                        Zamknij
                    </Button>
                </div>
            </Card>
        </div>
    );
}
