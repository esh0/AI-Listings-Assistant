import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
        return NextResponse.json(
            { error: "Brak aktywnej subskrypcji" },
            { status: 400 }
        );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
}
