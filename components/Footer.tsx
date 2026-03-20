"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export function Footer() {
    const { status } = useSession();
    const pricingHref = status === "authenticated" ? "/dashboard/pricing" : "/pricing";

    return (
        <footer className="border-t border-border py-4 px-4">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <nav aria-label="Stopka" className="flex items-center gap-6">
                    <Link href={pricingHref} className="hover:text-foreground transition-colors">
                        Cennik
                    </Link>
                    <Link href="/regulamin" className="hover:text-foreground transition-colors">
                        Regulamin
                    </Link>
                    <Link href="/polityka-prywatnosci" className="hover:text-foreground transition-colors">
                        Polityka prywatności
                    </Link>
                </nav>
                <p>&copy; 2026 Marketplace AI</p>
            </div>
        </footer>
    );
}
