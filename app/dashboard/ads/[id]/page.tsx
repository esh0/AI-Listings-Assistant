import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdDetailView } from "@/components/AdDetailView";
import type { Platform } from "@/lib/types";

// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export default async function AdDetailPage(props: { params: Params }) {
    const [session, params] = await Promise.all([auth(), props.params]);

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const ad = await prisma.ad.findUnique({
        where: { id: params.id, userId: session.user.id },
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
                createdAt: ad.createdAt,
                updatedAt: ad.updatedAt,
                images,
                parameters,
            }}
        />
    );
}
