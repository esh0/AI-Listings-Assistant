import { prisma } from "./prisma";
import { createHash } from "crypto";

const GUEST_MAX_GENERATIONS_PER_UUID = 3;
const GUEST_MAX_GENERATIONS_PER_IP_24H = 5;
const GUEST_MAX_IMAGES = 1;

/**
 * Hash IP address (one-way, RODO-safe)
 */
export function hashIP(ip: string): string {
    return createHash("sha256")
        .update(ip + (process.env.AUTH_SECRET || "salt"))
        .digest("hex");
}

/**
 * Check if guest has remaining generations
 */
export async function checkGuestLimit(
    guestId: string,
    ipHash: string
): Promise<{
    allowed: boolean;
    reason?: string;
    remainingByUuid: number;
    remainingByIp: number;
}> {
    const guestUsage = await prisma.guestUsage.findUnique({
        where: { guestId },
    });

    const usedByUuid = guestUsage?.generationsUsed ?? 0;
    const remainingByUuid = Math.max(0, GUEST_MAX_GENERATIONS_PER_UUID - usedByUuid);

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const ipUsageResult = await prisma.guestUsage.aggregate({
        where: {
            ipHash,
            lastUsedAt: { gte: twentyFourHoursAgo },
        },
        _sum: { generationsUsed: true },
    });

    const usedByIp = ipUsageResult._sum.generationsUsed ?? 0;
    const remainingByIp = Math.max(0, GUEST_MAX_GENERATIONS_PER_IP_24H - usedByIp);

    if (remainingByUuid <= 0) {
        return {
            allowed: false,
            reason: "Wykorzystałeś darmowy limit generacji. Zarejestruj się za darmo i otrzymaj 5 generacji miesięcznie!",
            remainingByUuid: 0,
            remainingByIp,
        };
    }

    if (remainingByIp <= 0) {
        return {
            allowed: false,
            reason: "Zbyt wiele generacji z Twojej sieci. Zarejestruj się za darmo, aby kontynuować.",
            remainingByUuid,
            remainingByIp: 0,
        };
    }

    return { allowed: true, remainingByUuid, remainingByIp };
}

/**
 * Consume one guest generation credit
 */
export async function consumeGuestCredit(
    guestId: string,
    ipHash: string
): Promise<void> {
    await prisma.guestUsage.upsert({
        where: { guestId },
        create: {
            guestId,
            ipHash,
            generationsUsed: 1,
        },
        update: {
            generationsUsed: { increment: 1 },
            ipHash,
        },
    });
}

export { GUEST_MAX_GENERATIONS_PER_UUID, GUEST_MAX_GENERATIONS_PER_IP_24H, GUEST_MAX_IMAGES };
