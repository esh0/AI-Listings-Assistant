"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";

export function Footer() {
    const { status } = useSession();
    const pricingHref = status === "authenticated" ? "/dashboard/pricing" : "/pricing";

    return (
        <footer className="border-t border-border py-8 px-4">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-semibold">
                        Marketplace <span className="font-serif italic text-primary">AI</span>
                    </span>
                </div>
                <nav aria-label="Stopka" className="flex items-center gap-6">
                    <span>OLX</span>
                    <span>Allegro</span>
                    <span>Vinted</span>
                    <Link href={pricingHref} className="hover:text-foreground transition-colors">
                        Cennik
                    </Link>
                </nav>
                <p>&copy; 2026 Marketplace AI</p>
            </div>
        </footer>
    );
}
