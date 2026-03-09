import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, STRIPE_BOOSTS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }

    const body = await request.json();
    const { boostPack } = body;

    const boostConfig = STRIPE_BOOSTS[boostPack as keyof typeof STRIPE_BOOSTS];
    if (!boostConfig) {
        return NextResponse.json({ error: "Nieprawidłowy pakiet" }, { status: 400 });
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true, email: true, name: true },
    });

    let customerId = user?.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user?.email || undefined,
            name: user?.name || undefined,
            metadata: { userId: session.user.id },
        });
        customerId = customer.id;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { stripeCustomerId: customerId },
        });
    }

    // Create checkout session for one-time payment
    const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        payment_method_types: ["card", "blik"],
        line_items: [
            {
                price: boostConfig.priceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?boost=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing?boost=cancelled`,
        metadata: {
            userId: session.user.id,
            boostPack,
            credits: boostConfig.credits.toString(),
        },
    });

    return NextResponse.json({ url: checkoutSession.url });
}
