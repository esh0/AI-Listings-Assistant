import { prisma } from "@/lib/prisma";
import { sendLowCreditsEmail } from "@/lib/email";
import type { Plan } from "@prisma/client";

/**
 * Credit limits per plan
 */
export const CREDIT_LIMITS: Record<string, number> = {
    FREE: 5,
    STARTER: 30,
    RESELER: 80,
};

export const IMAGE_LIMITS: Record<string, number> = {
    FREE: 3,
    STARTER: 5,
    RESELER: 8,
};

/**
 * Internal function to get user data (fresh read, no cache)
 */
async function getUserData(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            creditsAvailable: true,
            boostCredits: true,
            plan: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

/**
 * Check if user has available credits (subscription + boost)
 */
export async function hasCredits(userId: string): Promise<boolean> {
    const user = await getUserData(userId);
    return user.creditsAvailable > 0 || user.boostCredits > 0;
}

/**
 * Get user's total available credits (subscription + boost)
 */
export async function getAvailableCredits(userId: string): Promise<number> {
    const user = await getUserData(userId);
    return user.creditsAvailable + user.boostCredits;
}

/**
 * Consume one credit for ad generation.
 * Uses subscription credits first, then boost credits.
 * Atomic: uses conditional UPDATE to prevent TOCTOU race conditions.
 * Side-effect: sends low-credits email (fire-and-forget) when subscription
 * credits drop to exactly 1.
 */
export async function consumeCredit(userId: string): Promise<void> {
    // Atomic decrement of subscription credits (only if > 0)
    const subResult = await prisma.user.updateMany({
        where: { id: userId, creditsAvailable: { gt: 0 } },
        data: { creditsAvailable: { decrement: 1 } },
    });

    if (subResult.count > 0) {
        // Fire-and-forget: check if we should send low-credits email
        maybeNotifyLowCredits(userId).catch(() => {});
        return;
    }

    // Atomic decrement of boost credits (only if > 0)
    const boostResult = await prisma.user.updateMany({
        where: { id: userId, boostCredits: { gt: 0 } },
        data: { boostCredits: { decrement: 1 } },
    });

    if (boostResult.count > 0) return; // Boost credits used — no email for boost path

    // No credits available — fetch plan for user-friendly error message
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
    });

    if (user?.plan === "FREE") {
        throw new Error(
            "Wykorzystałeś wszystkie darmowe kredyty (5/miesiąc). Przejdź na plan Starter dla 30 generacji miesięcznie."
        );
    }
    throw new Error(
        "Brak dostępnych kredytów. Dokup pakiet kredytów lub zmień plan na wyższy."
    );
}

/**
 * Atomically claim the low-credits email slot, then send if slot was claimed.
 * Uses a conditional updateMany (WHERE lastLowCreditEmailAt IS NULL OR < 25 days ago)
 * so only one concurrent caller can win the slot — reduces double-send probability.
 * Not a hard guarantee under all race conditions, but sufficient for this use case.
 */
async function maybeNotifyLowCredits(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            plan: true,
            creditsAvailable: true,
        },
    });

    if (!user) return;
    if (user.creditsAvailable !== 1) return;

    const twentyFiveDaysAgo = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000);

    // Atomically claim the send slot: only update if no email was sent recently
    const claimed = await prisma.user.updateMany({
        where: {
            id: userId,
            OR: [
                { lastLowCreditEmailAt: null },
                { lastLowCreditEmailAt: { lt: twentyFiveDaysAgo } },
            ],
        },
        data: { lastLowCreditEmailAt: new Date() },
    });

    if (claimed.count === 0) return; // Another request already claimed the slot

    await sendLowCreditsEmail({
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
    });
}

/**
 * Reset user's subscription credits based on their plan
 */
export async function resetCredits(userId: string): Promise<void> {
    const user = await getUserData(userId);
    const limit = CREDIT_LIMITS[user.plan] ?? CREDIT_LIMITS.FREE;

    await prisma.user.update({
        where: { id: userId },
        data: {
            creditsAvailable: limit,
            creditsResetAt: new Date(),
        },
    });
}

/**
 * Change user's plan and reset credits accordingly
 */
export async function changePlan(userId: string, plan: string): Promise<void> {
    const limit = CREDIT_LIMITS[plan];
    const imageLimit = IMAGE_LIMITS[plan];
    if (limit === undefined || imageLimit === undefined) {
        throw new Error(`Nieznany plan: ${plan}`);
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            plan: plan as Plan,
            creditsAvailable: limit,
            creditsResetAt: new Date(),
        },
    });
}

/**
 * Add boost credits (one-time purchase, don't expire)
 */
export async function addBoostCredits(userId: string, amount: number): Promise<void> {
    await prisma.user.update({
        where: { id: userId },
        data: { boostCredits: { increment: amount } },
    });
}
