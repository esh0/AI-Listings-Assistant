"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("cookie_notice_accepted")) {
            setVisible(true);
        }
    }, []);

    const dismiss = () => {
        localStorage.setItem("cookie_notice_accepted", "1");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-border bg-card">
            <div className="max-w-4xl mx-auto flex items-center gap-4 flex-wrap">
                <p className="flex-1 text-sm text-muted-foreground min-w-0">
                    Ta strona używa niezbędnych plików cookie do obsługi sesji logowania.{" "}
                    <Link href="/polityka-prywatnosci" className="underline text-foreground hover:text-primary transition-colors">
                        Dowiedz się więcej
                    </Link>
                    .
                </p>
                <button
                    onClick={dismiss}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    Rozumiem
                </button>
                <button
                    onClick={dismiss}
                    aria-label="Zamknij"
                    className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
