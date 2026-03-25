import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface BlogPostCardProps {
    post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
    const formattedDate = new Date(post.publishedAt).toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article>
            <Link href={`/blog/${post.slug}`} className="block group">
                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                        {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <span>{formattedDate}</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readingTimeMinutes} min
                            </span>
                        </div>
                        <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                            Czytaj
                            <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
