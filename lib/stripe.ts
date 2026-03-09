import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
});

// Subscription tier mapping
export const STRIPE_PLANS = {
    STARTER: {
        priceId: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
        name: "Starter",
        price: 1999, // grosze (19.99 zł)
    },
    RESELER: {
        priceId: process.env.STRIPE_PRICE_RESELER_MONTHLY!,
        name: "Reseler",
        price: 4999,
    },
    BUSINESS: {
        priceId: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
        name: "Business",
        price: 9999,
    },
} as const;

// Boost credit packs
export const STRIPE_BOOSTS = {
    BOOST_10: {
        priceId: process.env.STRIPE_PRICE_BOOST_10!,
        credits: 10,
        price: 999,
    },
    BOOST_30: {
        priceId: process.env.STRIPE_PRICE_BOOST_30!,
        credits: 30,
        price: 2499,
    },
    BOOST_60: {
        priceId: process.env.STRIPE_PRICE_BOOST_60!,
        credits: 60,
        price: 3999,
    },
} as const;
