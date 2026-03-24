"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, Zap, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";

const PLANS = [
    {
        key: "FREE",
        name: "Free",
        price: "0",
        period: "na zawsze",
        icon: Zap,
        features: [
            "5 generacji / miesiąc",
            "Maks. 3 zdjęcia",
            "4 platformy (OLX, Allegro, FB Marketplace, Vinted)",
            "3 style tonu",
        ],
        retention: "Historia ogłoszeń: 7 dni",
        cta: "Obecny plan",
        highlighted: false,
    },
    {
        key: "STARTER",
        name: "Starter",
        price: "19,99",
        period: "/ miesiąc",
        icon: Star,
        features: [
            "30 generacji / miesiąc",
            "Maks. 5 zdjęć",
            "4 platformy (OLX, Allegro, FB Marketplace, Vinted)",
            "Wszystkie style tonu",
            "Eksport CSV",
        ],
        retention: "Historia ogłoszeń: 180 dni",
        cta: "Wybierz Starter",
        highlighted: false,
    },
    {
        key: "RESELER",
        name: "Reseler",
        price: "49,99",
        period: "/ miesiąc",
        icon: Crown,
        features: [
            "80 generacji / miesiąc",
            "Maks. 8 zdjęć",
            "7 platform (OLX, Allegro, FB, Vinted + eBay, Amazon, Etsy)",
            "Wszystkie style tonu",
            "Eksport CSV",
            "Priorytetowa generacja",
        ],
        retention: "Historia ogłoszeń: 365 dni",
        cta: "Wybierz Reseler",
        highlighted: true,
        badge: "Najpopularniejszy",
    },
] as const;

const BOOSTS = [
    { key: "BOOST_10", credits: 10, price: "9,99" },
    { key: "BOOST_30", credits: 30, price: "24,99" },
    { key: "BOOST_60", credits: 60, price: "39,99" },
] as const;

export default function DashboardPricingPage() {
    const { data: session } = useSession();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [loadingBoost, setLoadingBoost] = useState<string | null>(null);

    const currentPlan = session?.user?.plan ?? "FREE";

    useEffect(() => {
        trackEvent("pricing_page_viewed", { page_context: "dashboard" });
    }, []);

    const handleCheckout = async (plan: string) => {
        trackEvent("plan_upgrade_initiated", { plan_selected: plan, page_context: "dashboard" });
        setLoadingPlan(plan);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } finally {
            setLoadingPlan(null);
        }
    };

    const handleBoost = async (boostPack: string) => {
        trackEvent("boost_pack_initiated", { boost_pack: boostPack, page_context: "dashboard" });
        setLoadingBoost(boostPack);
        try {
            const res = await fetch("/api/stripe/boost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ boostPack }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } finally {
            setLoadingBoost(null);
        }
    };

    const handlePortal = async () => {
        setLoadingPlan("portal");
        try {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold">Cennik</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                    Generuj profesjonalne ogłoszenia szybciej. Wybierz plan dopasowany do Twoich potrzeb.
                </p>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
                {PLANS.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrent = currentPlan === plan.key;
                    const isFreePlan = plan.key === "FREE";
                    const isDowngrade = isFreePlan && currentPlan !== "FREE";

                    return (
                        <Card
                            key={plan.key}
                            className={`relative flex flex-col p-6 ${
                                plan.highlighted ? "border-primary border-2 shadow-lg" : ""
                            }`}
                        >
                            {plan.highlighted && "badge" in plan && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border-0">
                                    {plan.badge}
                                </Badge>
                            )}

                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-primary" />
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                </div>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">{plan.price}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {plan.price === "0" ? "" : "zł"} {plan.period}
                                    </span>
                                </div>

                                <ul className="space-y-2">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    <li className="flex items-start gap-2 text-sm">
                                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                        <span>{plan.retention}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-6">
                                {isCurrent ? (
                                    <Button variant="outline" className="w-full" disabled>
                                        Obecny plan
                                    </Button>
                                ) : isDowngrade ? (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handlePortal}
                                        disabled={loadingPlan === "portal"}
                                    >
                                        {loadingPlan === "portal" ? "Przekierowuję…" : "Zarządzaj subskrypcją"}
                                    </Button>
                                ) : (
                                    <Button
                                        className={`w-full ${
                                            plan.highlighted
                                                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                                : ""
                                        }`}
                                        onClick={() => handleCheckout(plan.key)}
                                        disabled={loadingPlan === plan.key}
                                    >
                                        {loadingPlan === plan.key ? "Przekierowuję…" : plan.cta}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Boost Credits */}
            <div className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold">Doładuj kredyty</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Potrzebujesz więcej generacji? Dokup jednorazowy pakiet kredytów.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    {BOOSTS.map((boost) => (
                        <Card key={boost.key} className="p-6 text-center space-y-4">
                            <div>
                                <span className="text-3xl font-bold">{boost.credits}</span>
                                <span className="text-sm text-muted-foreground ml-1">kredytów</span>
                            </div>
                            <div className="text-2xl font-bold">
                                {boost.price} <span className="text-sm font-normal text-muted-foreground">zł</span>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleBoost(boost.key)}
                                disabled={loadingBoost === boost.key}
                            >
                                {loadingBoost === boost.key ? "Przekierowuję…" : "Kup kredyty"}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold">Często zadawane pytania</h2>
                <div className="space-y-4 max-w-3xl mx-auto">
                    {[
                        {
                            q: "Jak działają kredyty?",
                            a: "Jeden kredyt = jedna generacja ogłoszenia. Kredyty odnawiają się co miesiąc w dniu subskrypcji. Niewykorzystane kredyty nie przechodzą na kolejny miesiąc.",
                        },
                        {
                            q: "Czy mogę zmienić plan?",
                            a: "Tak, możesz zmienić plan w każdym momencie. Przy upgrade dostaniesz natychmiast nowy limit kredytów. Przy downgrade zmiana nastąpi na koniec okresu rozliczeniowego.",
                        },
                        {
                            q: "Czym są doładowania kredytów?",
                            a: "Doładowania to jednorazowe pakiety kredytów, które dodają się do Twojego limitu. Nie wygasają z końcem miesiąca — zostają aż je wykorzystasz.",
                        },
                        {
                            q: "Jak mogę anulować subskrypcję?",
                            a: "Możesz anulować subskrypcję w każdym momencie przez portal płatności. Po anulowaniu Twój plan zmieni się na Free na koniec okresu rozliczeniowego.",
                        },
                        {
                            q: "Jak długo przechowywane są moje ogłoszenia?",
                            a: "Zależy od planu: Free — 7 dni, Starter — 180 dni, Reseler — 365 dni. Po upływie okresu ogłoszenia są automatycznie i trwale usuwane. Eksportuj ważne dane przed wygaśnięciem lub przejdź na wyższy plan.",
                        },
                        {
                            q: "Jakie metody płatności akceptujecie?",
                            a: "Akceptujemy karty płatnicze (Visa, Mastercard) oraz BLIK. Płatności obsługuje Stripe — wiodący procesor płatności.",
                        },
                    ].map((faq) => (
                        <details key={faq.q} className="group border rounded-lg">
                            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium hover:bg-muted/50 transition-colors">
                                {faq.q}
                                <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                                    &#9660;
                                </span>
                            </summary>
                            <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    );
}
