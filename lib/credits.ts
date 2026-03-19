import { prisma } from "@/lib/prisma";
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
 */
export async function consumeCredit(userId: string): Promise<void> {
    // Atomic decrement of subscription credits (only if > 0)
    const subResult = await prisma.user.updateMany({
        where: { id: userId, creditsAvailable: { gt: 0 } },
        data: { creditsAvailable: { decrement: 1 } },
    });

    if (subResult.count > 0) return; // Success

    // Atomic decrement of boost credits (only if > 0)
    const boostResult = await prisma.user.updateMany({
        where: { id: userId, boostCredits: { gt: 0 } },
        data: { boostCredits: { decrement: 1 } },
    });

    if (boostResult.count > 0) return; // Success

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
