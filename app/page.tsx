"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdGeneratorForm } from "@/components/AdGeneratorForm";
import Link from "next/link";

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [hasResult, setHasResult] = useState(false);

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status]);

    // Show loading while checking auth
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground">Ładowanie...</p>
                </div>
            </div>
        );
    }

    // Redirect is happening
    if (status === "authenticated") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground">Przekierowywanie...</p>
                </div>
            </div>
        );
    }

    // Landing page for unauthenticated users with form (soft-wall)
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background" role="banner">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center transition-transform hover:scale-105">
                            <ShoppingBag className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            Marketplace AI
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Cennik
                        </Link>
                        <Link href="/auth/signin?callbackUrl=/dashboard">
                            <Button variant="outline" size="sm">
                                Zaloguj się
                            </Button>
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Hero + Form */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" role="main">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    {!hasResult && (
                    <section aria-labelledby="page-title" className="mb-6">
                        <h1 id="page-title" className="text-3xl sm:text-4xl font-bold mb-1 leading-tight tracking-tight">
                            Sprzedaj szybciej{" "}
                            <span className="text-primary">z lepszym opisem</span>
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            Wrzuć zdjęcia, AI stworzy profesjonalne ogłoszenie gotowe na OLX, Allegro, Facebook i Vinted.
                        </p>
                    </section>
                    )}

                    {/* Form */}
                    <AdGeneratorForm onResultChange={setHasResult} />

                    {/* Footer */}
                    <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
                        <p>Obsługuje: OLX • Allegro Lokalnie • Facebook Marketplace • Vinted</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}
