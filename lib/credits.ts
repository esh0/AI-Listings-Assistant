import { prisma } from "@/lib/prisma";

/**
 * Credit limits per plan
 */
export const CREDIT_LIMITS = {
  FREE: 3,
  PREMIUM: 9999, // Effectively unlimited
} as const;

/**
 * Check if user has available credits
 * @returns true if user has credits, false otherwise
 */
export async function hasCredits(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsAvailable: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.creditsAvailable > 0;
}

/**
 * Get user's available credits
 */
export async function getAvailableCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsAvailable: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.creditsAvailable;
}

/**
 * Consume one credit for ad generation
 * Throws error if no credits available
 */
export async function consumeCredit(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsAvailable: true, plan: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.creditsAvailable <= 0) {
    if (user.plan === "FREE") {
      throw new Error(
        "Wykorzystałeś wszystkie darmowe kredyty (3/miesiąc). Przejdź na plan PREMIUM dla nieograniczonego dostępu."
      );
    }
    throw new Error("Brak dostępnych kredytów.");
  }

  // Decrement credits
  await prisma.user.update({
    where: { id: userId },
    data: {
      creditsAvailable: {
        decrement: 1,
      },
    },
  });
}

/**
 * Reset user's credits based on their plan
 * Called monthly or when upgrading plan
 */
export async function resetCredits(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const newCredits = CREDIT_LIMITS[user.plan];

  await prisma.user.update({
    where: { id: userId },
    data: {
      creditsAvailable: newCredits,
      creditsResetAt: new Date(),
    },
  });
}

/**
 * Upgrade user to PREMIUM plan
 */
export async function upgradeToPremium(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "PREMIUM",
      creditsAvailable: CREDIT_LIMITS.PREMIUM,
      creditsResetAt: new Date(),
    },
  });
}
