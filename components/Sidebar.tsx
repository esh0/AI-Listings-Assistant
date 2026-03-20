"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    FileText,
    Layout,
    History,
    BarChart3,
    ShoppingBag,
    LogOut,
    Coins,
    Menu,
    X,
    CreditCard,
    Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        plan?: "FREE" | "STARTER" | "RESELER";
        creditsAvailable?: number;
        boostCredits?: number;
        creditsResetAt?: string;
    };
    collapsed?: boolean;
    onCollapse?: (v: boolean) => void;
}

const PLAN_LABELS: Record<string, string> = {
    FREE: "Free",
    STARTER: "Starter",
    RESELER: "Reseler",
};

const PLAN_CREDITS: Record<string, number> = {
    FREE: 5,
    STARTER: 30,
    RESELER: 80,
};

const mainItems = [
    { href: "/dashboard", label: "Przegląd", icon: LayoutDashboard },
    { href: "/dashboard/ads", label: "Moje ogłoszenia", icon: FileText },
    { href: "/dashboard/templates", label: "Szablony", icon: Layout },
    { href: "/dashboard/history", label: "Historia", icon: History },
    { href: "/dashboard/stats", label: "Statystyki", icon: BarChart3 },
    { href: "/dashboard/pricing", label: "Cennik", icon: CreditCard },
    { href: "/dashboard/settings", label: "Ustawienia", icon: Settings },
];

export function Sidebar({ user, collapsed = false }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMobileOpen]);

    const plan = (session?.user?.plan ?? user.plan ?? "FREE") as "FREE" | "STARTER" | "RESELER";
    const credits = session?.user?.creditsAvailable ?? user.creditsAvailable ?? 0;
    const boost = session?.user?.boostCredits ?? user.boostCredits ?? 0;
    const planLimit = PLAN_CREDITS[plan] ?? 5;
    const creditPct = Math.min(100, Math.round((credits / planLimit) * 100));

    const getResetLabel = () => {
        if (!user.creditsResetAt) return null;
        const nextReset = new Date(user.creditsResetAt);
        nextReset.setMonth(nextReset.getMonth() + 1);
        const days = Math.max(0, Math.ceil((nextReset.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        if (days === 0) return "dziś";
        if (days === 1) return "jutro";
        return `za ${days} dni`;
    };

    const handleSignOut = () => signOut({ callbackUrl: "/" });

    const isActive = (href: string) => pathname === href;

    const sidebarContent = (
        <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <div className={cn("py-4 flex items-center", collapsed ? "justify-center px-2" : "justify-between px-4")}>
                <Link href="/" className="flex items-center gap-2 min-w-0">
                    <ShoppingBag className="h-5 w-5 text-primary shrink-0" />
                    {!collapsed && (
                        <span className="text-sm font-semibold tracking-tight whitespace-nowrap">
                            Marketplace <span className="font-serif italic text-primary">AI</span>
                        </span>
                    )}
                </Link>
                {!collapsed && (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Zamknij menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-2">
                {!collapsed && (
                    <p className="px-3 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Menu
                    </p>
                )}
                <div className="space-y-0.5">
                    {mainItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                title={collapsed ? item.label : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                    collapsed && "justify-center px-2",
                                    active
                                        ? "bg-accent text-primary font-medium"
                                        : "text-foreground hover:bg-accent/50"
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className={cn("py-3 space-y-2", collapsed ? "px-2" : "px-3")}>
                {/* Credits widget */}
                {!collapsed ? (
                    <Link
                        href="/dashboard/pricing"
                        className="block p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                    >
                        <div className="flex items-center justify-between text-xs mb-1">
                            <div className="flex items-center gap-2">
                                <Coins className="h-3.5 w-3.5 text-primary" />
                                <span className="font-medium">
                                    {credits}{boost > 0 ? ` +${boost}` : ""} / {planLimit} kredytów
                                </span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium">
                                {PLAN_LABELS[plan]}
                            </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-primary transition-all"
                                style={{ width: `${creditPct}%` }}
                            />
                        </div>
                        {getResetLabel() && (
                            <p className="text-[10px] text-muted-foreground mt-1.5">
                                Odnowienie: {planLimit} kredytów {getResetLabel()}
                            </p>
                        )}
                        <p className="text-[10px] text-primary mt-0.5 font-medium">Dokup więcej →</p>
                    </Link>
                ) : (
                    <Link
                        href="/dashboard/pricing"
                        title="Kredyty"
                        className="flex justify-center py-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                        <Coins className="h-4 w-4 text-primary" />
                    </Link>
                )}

                {/* User info */}
                {!collapsed && (
                    <div className="px-3 py-2 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium truncate">{user.name || "User"}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                )}

                {/* Bottom nav */}
                <div className="space-y-0.5">
                    <button
                        onClick={handleSignOut}
                        title={collapsed ? "Wyloguj" : undefined}
                        aria-label="Wyloguj"
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>Wyloguj</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile hamburger */}
            {!isMobileOpen && (
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-lg border border-border"
                    aria-label="Otwórz menu nawigacji"
                    aria-expanded={isMobileOpen}
                    aria-controls="mobile-sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>
            )}

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    aria-hidden="true"
                />
            )}

            {/* Mobile sidebar */}
            <aside
                id="mobile-sidebar"
                className={cn(
                    "lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-card transform transition-transform duration-300 overflow-y-auto border-r border-border",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
                aria-label="Menu nawigacji"
            >
                {sidebarContent}
            </aside>

            {/* Desktop sidebar */}
            <aside className={cn(
                "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-card lg:border-r lg:border-border transition-all duration-300",
                collapsed ? "lg:w-16" : "lg:w-72"
            )}>
                {sidebarContent}
            </aside>
        </>
    );
}
