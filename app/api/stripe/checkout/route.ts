import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
    if (!planConfig) {
        return NextResponse.json({ error: "Nieprawidłowy plan" }, { status: 400 });
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

    // Create checkout session
    let checkoutSession;
    try {
        checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            payment_method_types: ["card", "blik"],
            line_items: [
                {
                    price: planConfig.priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?upgrade=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing?upgrade=cancelled`,
            metadata: {
                userId: session.user.id,
                plan,
            },
        });
    } catch (err) {
        console.error("[checkout] Stripe error:", err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });
}
