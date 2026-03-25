import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { BlogCTA } from "@/components/BlogCTA";
import type { BlogPost } from "@/lib/blog";

interface BlogLayoutProps {
    post: BlogPost;
    children: React.ReactNode;
}

export function BlogLayout({ post, children }: BlogLayoutProps) {
    const formattedDate = new Date(post.publishedAt).toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Marketplace <span className="font-serif italic text-primary">AI</span>
                        <span className="text-border mx-1">/</span>
                        <span>Blog</span>
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground flex items-center gap-1.5">
                    <Link href="/" className="hover:text-foreground transition-colors">Strona główna</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
                </nav>

                {/* Article header */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4 leading-snug">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readingTimeMinutes} min czytania
                        </span>
                    </div>
                </div>

                {/* Article content */}
                <article className="prose-blog">
                    {children}
                </article>

                {/* CTA */}
                <BlogCTA />
            </main>

            <Footer />
        </div>
    );
}
