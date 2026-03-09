"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    Home,
    FileText,
    Bookmark,
    LogOut,
    CreditCard,
    Menu,
    X,
    Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        plan?: "FREE" | "STARTER" | "RESELER" | "BUSINESS";
        creditsAvailable?: number;
        boostCredits?: number;
        creditsResetAt?: string;
    };
}

const PLAN_LABELS: Record<string, string> = {
    FREE: "Free",
    STARTER: "Starter",
    RESELER: "Reseler",
    BUSINESS: "Business",
};

const PLAN_CREDITS: Record<string, number> = {
    FREE: 5,
    STARTER: 30,
    RESELER: 80,
    BUSINESS: 200,
};

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    const plan = user.plan ?? "FREE";
    const isPaid = plan !== "FREE";

    const handlePortal = useCallback(async () => {
        setIsPortalLoading(true);
        try {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            if (!res.ok) {
                throw new Error("Portal request failed");
            }
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No portal URL returned");
            }
        } catch (error) {
            console.error("Portal error:", error);
            alert("Nie udało się otworzyć panelu subskrypcji. Spróbuj ponownie.");
        } finally {
            setIsPortalLoading(false);
        }
    }, []);
    const credits = user.creditsAvailable ?? 0;
    const boost = user.boostCredits ?? 0;
    const planLimit = PLAN_CREDITS[plan] ?? 5;

    // Calculate next reset date (1 month from last reset)
    const getResetLabel = () => {
        if (!user.creditsResetAt) return null;
        const resetDate = new Date(user.creditsResetAt);
        const nextReset = new Date(resetDate);
        nextReset.setMonth(nextReset.getMonth() + 1);
        const days = Math.max(0, Math.ceil((nextReset.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        if (days === 0) return "dziś";
        if (days === 1) return "jutro";
        return `za ${days} dni`;
    };

    const navLinks = [
        {
            href: "/dashboard",
            label: "Pulpit",
            icon: Home,
        },
        {
            href: "/dashboard/ads",
            label: "Ogłoszenia",
            icon: FileText,
        },
        {
            href: "/dashboard/templates",
            label: "Szablony",
            icon: Bookmark,
        },
        {
            href: "/pricing",
            label: "Cennik",
            icon: Tag,
        },
    ];

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const sidebarContent = (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-border p-6">
                <Link href="/dashboard/new" className="text-xl font-bold text-foreground">
                    Marketplace Assistant
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-muted"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Credits */}
            <div className="border-t border-border p-4 space-y-4">
                {/* Credits Display */}
                <div className="px-4 py-3 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
                                Kredyty
                            </span>
                        </div>
                        <span className="text-lg font-semibold text-foreground">
                            {credits}
                            <span className="text-xs font-normal text-muted-foreground">/{planLimit}</span>
                        </span>
                    </div>
                    {boost > 0 && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Dostawkowe</span>
                            <span className="font-medium text-primary">+{boost}</span>
                        </div>
                    )}
                    {getResetLabel() && (
                        <p className="text-xs text-muted-foreground">
                            Odnowienie {getResetLabel()} ({planLimit} kredytów)
                        </p>
                    )}
                    <Link
                        href="/pricing"
                        className="block text-xs text-center text-primary font-medium hover:underline pt-1"
                    >
                        {isPaid ? "Zmień plan lub dokup kredyty" : "Zmień plan lub dokup kredyty"}
                    </Link>
                    {isPaid && (
                        <button
                            onClick={handlePortal}
                            disabled={isPortalLoading}
                            className="block w-full text-xs text-center text-muted-foreground hover:text-foreground hover:underline pt-1 transition-colors disabled:opacity-50"
                        >
                            {isPortalLoading ? "Przekierowuję…" : "Zarządzaj subskrypcją"}
                        </button>
                    )}
                </div>

                {/* User Info */}
                <div className="px-4 py-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="h-10 w-10 rounded-full"
                                width={40}
                                height={40}
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {user.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="w-full justify-center text-xs"
                    >
                        {PLAN_LABELS[plan] || plan}
                    </Badge>
                </div>

                {/* Theme Toggle & Sign Out */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="flex-1 flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Wyloguj się
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-lg"
                aria-label={isMobileOpen ? "Zamknij menu" : "Otwórz menu"}
                aria-expanded={isMobileOpen}
            >
                {isMobileOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar - Mobile (overlay) */}
            <aside
                className={cn(
                    "lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-card transform transition-transform duration-300",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {sidebarContent}
            </aside>

            {/* Sidebar - Desktop (fixed) */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:bg-card lg:border-r lg:border-border">
                {sidebarContent}
            </aside>
        </>
    );
}
