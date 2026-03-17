"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        plan?: "FREE" | "STARTER" | "RESELER" | "BUSINESS";
        creditsAvailable?: number;
        boostCredits?: number;
        creditsResetAt?: string;
    };
    children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar user={user} collapsed={collapsed} onCollapse={setCollapsed} />
            <main className={cn(
                "transition-all duration-300",
                collapsed ? "lg:pl-16" : "lg:pl-72"
            )}>
                {/* Top bar */}
                <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 bg-background/80 backdrop-blur-sm border-b border-border">
                    <button
                        onClick={() => setCollapsed((v) => !v)}
                        className="hidden lg:flex p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        aria-label={collapsed ? "Rozwiń sidebar" : "Zwiń sidebar"}
                    >
                        <PanelLeft className="h-5 w-5" />
                    </button>
                    <div className="lg:hidden" />
                    <ThemeToggle />
                </div>
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
