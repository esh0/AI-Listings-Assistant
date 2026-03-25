import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BlogCTA() {
    return (
        <section
            aria-labelledby="cta-heading"
            className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center"
        >
            <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
            </div>
            <h3
                id="cta-heading"
                className="text-xl font-bold text-foreground mb-2"
            >
                Wypróbuj za darmo — bez rejestracji
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                Wrzuć zdjęcie produktu, wybierz platformę — AI napisze gotowe ogłoszenie
                w kilka sekund. Pierwsze 3 generacje za darmo, bez karty kredytowej.
            </p>
            <Link
                href="/"
                className={cn(buttonVariants({ variant: "gradient", size: "lg" }))}
            >
                Generuj ogłoszenie za darmo
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
                OLX · Allegro Lokalnie · Facebook Marketplace · Vinted
            </p>
        </section>
    );
}
