"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Sparkles, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LandingForm } from "@/components/LandingForm";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

const DEMO_TEXT =
    "Elegancki zegarek w stylu vintage, idealny na prezent. Mechanizm kwarcowy, skórzany pasek, stan bardzo dobry. Wysyłka w 24h.";

export default function HomePage() {
    const [typedText, setTypedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < DEMO_TEXT.length) {
                setTypedText(DEMO_TEXT.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => setShowCursor(false), 1000);
            }
        }, 35);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* Navbar */}
            <motion.header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
                    : "bg-transparent"
                    }`}
                role="banner"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="font-bold text-lg tracking-tight">
                            Marketplace <span className="font-serif italic text-primary">AI</span>
                        </span>
                    </div>
                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/auth/signin?callbackUrl=/dashboard">
                            <Button variant="ghost" size="sm">
                                Zaloguj się
                            </Button>
                        </Link>
                        <Button
                            variant="gradient"
                            size="sm"
                            className="hidden sm:inline-flex"
                            onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            Wypróbuj za darmo
                        </Button>
                    </div>
                </div>
            </motion.header>

            <main role="main" className="pt-16">
                {/* Hero Section */}
                <section
                    className="relative isolate min-h-screen flex flex-col items-center justify-center pb-8 px-4"
                    aria-labelledby="hero-heading"
                >
                    {/* Background glow blob */}
                    <div
                        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10"
                        aria-hidden="true"
                    />

                    <motion.div
                        className="w-full max-w-3xl mx-auto space-y-6 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                            500+ wygenerowanych ogłoszeń
                        </motion.div>

                        {/* Headline */}
                        <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                            Sprzedaj szybciej<br />
                            <span className="text-gradient font-serif italic">z lepszym opisem</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-muted-foreground text-lg" style={{ textWrap: "balance" }}>
                            Wrzuć zdjęcie, wybierz platformę — AI napisze ogłoszenie,
                            <br className="hidden sm:block" />
                            {" "}które sprzedaje.
                        </p>
                    </motion.div>

                    {/* Before/After Demo */}
                    <motion.div
                        className="w-full max-w-2xl mx-auto mt-8"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                    >
                        <div
                            className="grid grid-cols-2 gap-4 px-4"
                            aria-label="Porównanie przed i po"
                        >
                            {/* PRZED card */}
                            <div className="border-2 border-border rounded-xl bg-background p-5 space-y-3">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    PRZED
                                </p>
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                    <span className="text-4xl" role="img" aria-label="Zegarek">
                                        &#x231A;
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                    &quot;zegarek na sprzedaż, stan ok&quot;
                                </p>
                            </div>

                            {/* PO — AI card */}
                            <div className="border-2 border-primary/30 rounded-xl bg-card p-5 space-y-3 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:pointer-events-none relative">
                                <p className="text-xs font-medium text-primary uppercase tracking-wider relative z-10">
                                    PO — AI
                                </p>
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative">
                                    <span className="text-4xl" role="img" aria-label="Zegarek">
                                        &#x231A;
                                    </span>
                                    <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium" aria-hidden="true">
                                        AI
                                    </span>
                                </div>
                                <div className="space-y-1 relative">
                                    <p className="text-sm font-semibold">
                                        Elegancki zegarek vintage — idealny prezent
                                    </p>
                                    <p className="text-xs text-muted-foreground min-h-[3.5rem]">
                                        {typedText}
                                        {showCursor && (
                                            <span
                                                className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-blink align-middle"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* "Wypróbuj teraz" scroll CTA */}
                    <motion.div
                        className="text-center pt-8 pb-4 animate-float"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        <button
                            onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex flex-col items-center gap-1"
                        >
                            Wypróbuj teraz
                            <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
                        </button>
                    </motion.div>
                </section>

                {/* Form Section */}
                <section className="px-4 pb-16" aria-labelledby="form-heading">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="text-center space-y-1">
                            <h2 id="form-section" className="text-2xl font-bold scroll-mt-20">
                                Stwórz ogłoszenie
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                3 kroki do idealnego opisu
                            </p>
                        </div>
                        <LandingForm />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
