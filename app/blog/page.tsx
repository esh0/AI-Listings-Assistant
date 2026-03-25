import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { BlogPostCard } from "@/components/BlogPostCard";
import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog — Porady o sprzedaży online | Marketplace AI",
    description:
        "Poradniki jak pisać skuteczne ogłoszenia na OLX, Vinted, Allegro Lokalnie i Facebook Marketplace. Praktyczne wskazówki i szablony.",
    alternates: {
        canonical: "https://marketplace-ai.pl/blog",
    },
    openGraph: {
        title: "Blog — Porady o sprzedaży online | Marketplace AI",
        description:
            "Poradniki jak pisać skuteczne ogłoszenia na OLX, Vinted, Allegro Lokalnie i Facebook Marketplace.",
        type: "website",
        locale: "pl_PL",
        url: "https://marketplace-ai.pl/blog",
    },
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        Marketplace <span className="font-serif italic text-primary">AI</span>
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Blog</h1>
                    <p className="text-muted-foreground">
                        Porady jak pisać ogłoszenia które sprzedają — OLX, Vinted, Allegro Lokalnie i Facebook Marketplace.
                    </p>
                </div>

                <div className="space-y-4">
                    {posts.map((post) => (
                        <BlogPostCard key={post.slug} post={post} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
