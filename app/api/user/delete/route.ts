import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

function getStoragePath(url: string): string | null {
    // URL format: https://<project>.supabase.co/storage/v1/object/public/marketplace-ads/<path>
    const marker = "/marketplace-ads/";
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.slice(idx + marker.length);
}

export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }
    const userId = session.user.id;

    // Fetch user with ads (images field is JSON: Array<{ url: string, ... }>)
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { ads: { select: { images: true } } },
    });

    if (!user) {
        return NextResponse.json({ error: "Nie znaleziono użytkownika" }, { status: 404 });
    }

    // Extract image URLs from the JSON images field
    const allImageUrls: string[] = user.ads.flatMap((ad) => {
        const images = ad.images as Array<{ url: string }>;
        if (!Array.isArray(images)) return [];
        return images.map((img) => img.url).filter(Boolean);
    });

    const storagePaths = allImageUrls
        .map(getStoragePath)
        .filter((p): p is string => p !== null);

    if (storagePaths.length > 0) {
        try {
            await supabase.storage.from("marketplace-ads").remove(storagePaths);
        } catch (err) {
            console.error("[delete-account] Nie udało się usunąć plików ze Storage:", err);
            // Kontynuuj — nie blokuj usunięcia konta z powodu błędu Storage
        }
    }

    // Anuluj subskrypcję Stripe
    if (user.stripeSubscriptionId) {
        try {
            await stripe.subscriptions.cancel(user.stripeSubscriptionId);
        } catch (err) {
            console.error("[delete-account] Nie udało się anulować subskrypcji Stripe:", err);
        }
    }

    // Usuń klienta Stripe
    if (user.stripeCustomerId) {
        try {
            await stripe.customers.del(user.stripeCustomerId);
        } catch (err) {
            console.error("[delete-account] Nie udało się usunąć klienta Stripe:", err);
        }
    }

    // Usuń użytkownika z bazy — kaskadowe usunięcie obejmuje: Ad, Template, ActivityLog, Account, Session
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
}
