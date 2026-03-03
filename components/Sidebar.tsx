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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        plan?: "FREE" | "PREMIUM";
        creditsAvailable?: number;
    };
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const creditsDisplay = user.plan === "PREMIUM"
        ? "∞"
        : (user.creditsAvailable ?? 0);

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
    ];

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const sidebarContent = (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-6">
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
                                    ? "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Credits */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                {/* Credits Display */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Kredyty
                        </span>
                    </div>
                    <Badge
                        variant={user.plan === "PREMIUM" ? "default" : "secondary"}
                        className={cn(
                            user.plan === "PREMIUM"
                                ? "bg-orange-500 hover:bg-orange-600"
                                : ""
                        )}
                    >
                        {creditsDisplay}
                    </Badge>
                </div>

                {/* User Info */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {user.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="w-full justify-center text-xs"
                    >
                        {user.plan === "PREMIUM" ? "Premium" : "Free"}
                    </Badge>
                </div>

                {/* Sign Out Button */}
                <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Wyloguj się
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
                aria-label="Toggle menu"
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
                    "lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 transform transition-transform duration-300",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {sidebarContent}
            </aside>

            {/* Sidebar - Desktop (fixed) */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:bg-white lg:dark:bg-gray-900 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
                {sidebarContent}
            </aside>
        </>
    );
}
