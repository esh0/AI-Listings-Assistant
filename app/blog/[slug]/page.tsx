import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { BlogLayout } from "@/components/BlogLayout";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Nie znaleziono" };

    const url = `https://www.marketplace-ai.pl/blog/${post.slug}`;

    return {
        title: post.metaTitle,
        description: post.metaDescription,
        keywords: [post.primaryKeyword, ...post.tags],
        alternates: { canonical: url },
        openGraph: {
            title: post.metaTitle,
            description: post.metaDescription,
            type: "article",
            locale: "pl_PL",
            url,
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt ?? post.publishedAt,
            authors: ["Marketplace AI"],
            images: [
                {
                    url: "https://www.marketplace-ai.pl/og-image.svg",
                    width: 1200,
                    height: 630,
                    alt: post.metaTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.metaTitle,
            description: post.metaDescription,
            images: ["https://www.marketplace-ai.pl/og-image.svg"],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const { default: PostContent } = await import(`@/app/blog/posts/${slug}`);

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        author: {
            "@type": "Organization",
            name: "Marketplace AI",
            url: "https://www.marketplace-ai.pl",
        },
        publisher: {
            "@type": "Organization",
            name: "Marketplace AI",
            url: "https://www.marketplace-ai.pl",
        },
        url: `https://www.marketplace-ai.pl/blog/${post.slug}`,
        description: post.metaDescription,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <BlogLayout post={post}>
                <PostContent />
            </BlogLayout>
        </>
    );
}
