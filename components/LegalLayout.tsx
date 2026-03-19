import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";

interface LegalLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top bar */}
            <header className="border-b border-border">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Marketplace <span className="font-serif italic text-primary">AI</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{title}</h1>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
                <div className="prose-legal">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}
