"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                {/* Brand */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <ShoppingBag className="h-7 w-7 text-primary" />
                    <span className="text-xl">
                        <span className="font-bold">Marketplace</span>
                        <span className="font-serif italic text-primary"> AI</span>
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
                    Błąd dashboardu
                </h1>

                {/* Description */}
                <p className="text-muted-foreground mb-8 text-balance">
                    Wystąpił błąd w tej sekcji. Możesz spróbować ponownie lub wrócić do przeglądu dashboardu.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        Spróbuj ponownie
                    </button>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-border bg-card hover:bg-muted text-foreground"
                    >
                        Przejdź do przeglądu
                    </Link>
                </div>
            </div>
        </div>
    );
}
