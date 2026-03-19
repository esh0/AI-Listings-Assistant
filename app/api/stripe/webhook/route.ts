import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { changePlan, addBoostCredits, CREDIT_LIMITS } from "@/lib/credits";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Idempotency check — Stripe retries webhooks on failure, deduplicate by event ID
    try {
        await prisma.processedWebhookEvent.create({ data: { id: event.id } });
    } catch {
        // Unique constraint violation = event already processed
        return NextResponse.json({ received: true, deduplicated: true });
    }

    switch (event.type) {
        // Subscription created or boost purchased
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;

            if (!userId) break;

            if (session.mode === "subscription") {
                const plan = session.metadata?.plan;
                if (plan) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: { stripeSubscriptionId: session.subscription as string },
                    });
                    await changePlan(userId, plan);
                }
            } else if (session.mode === "payment") {
                const credits = parseInt(session.metadata?.credits || "0", 10);
                if (credits > 0) {
                    await addBoostCredits(userId, credits);
                }
            }
            break;
        }

        // Subscription renewed (monthly payment)
        case "invoice.paid": {
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionId = invoice.parent?.type === "subscription_details"
                ? invoice.parent.subscription_details?.subscription
                : null;

            if (!subscriptionId || typeof subscriptionId !== "string") break;

            const user = await prisma.user.findFirst({
                where: { stripeSubscriptionId: subscriptionId },
            });

            if (user) {
                const limit = CREDIT_LIMITS[user.plan] ?? CREDIT_LIMITS.FREE;
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        creditsAvailable: limit,
                        creditsResetAt: new Date(),
                    },
                });
            }
            break;
        }

        // Subscription cancelled
        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;

            const user = await prisma.user.findFirst({
                where: { stripeSubscriptionId: subscription.id },
            });

            if (user) {
                await changePlan(user.id, "FREE");
                await prisma.user.update({
                    where: { id: user.id },
                    data: { stripeSubscriptionId: null },
                });
            }
            break;
        }

        default:
            break;
    }

    return NextResponse.json({ received: true });
}
