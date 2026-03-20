import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdDetailView } from "@/components/AdDetailView";
import type { Platform } from "@/lib/types";

export async function AdDetailServer({ id }: { id: string }) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const ad = await prisma.ad.findUnique({
        where: { id, userId: session.user.id },
    });

    if (!ad) {
        notFound();
    }

    const images = Array.isArray(ad.images)
        ? (ad.images as Array<{ url: string; quality?: string; suggestions?: string }>)
        : [];

    const parameters = ad.parameters as {
        condition?: string;
        tone?: string;
        delivery?: string[];
        productName?: string;
        notes?: string;
        priceType?: string;
        userPrice?: number;
    } | null;

    return (
        <AdDetailView
            ad={{
                id: ad.id,
                title: ad.title,
                description: ad.description,
                status: ad.status,
                platform: ad.platform as Platform,
                priceMin: ad.priceMin,
                priceMax: ad.priceMax,
                soldPrice: ad.soldPrice,
                publishPrice: ad.publishPrice,
                createdAt: ad.createdAt,
                updatedAt: ad.updatedAt,
                images,
                parameters,
            }}
        />
    );
}
