import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function NotFound() {
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

                {/* 404 */}
                <h1 className="text-8xl font-bold tracking-tight text-foreground mb-4">
                    404
                </h1>

                {/* Subtitle */}
                <h2 className="text-2xl font-semibold text-foreground mb-3">
                    Strona nie istnieje
                </h2>

                {/* Description */}
                <p className="text-muted-foreground mb-8 text-balance">
                    Przepraszamy, strona której szukasz nie istnieje lub została przeniesiona.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        Wróć na stronę główną
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-border bg-card hover:bg-muted text-foreground"
                    >
                        Przejdź do dashboardu
                    </Link>
                </div>
            </div>
        </div>
    );
}
