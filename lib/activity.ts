import { prisma } from "@/lib/prisma";
import { PLATFORM_NAMES } from "@/lib/types";

export async function logActivity(userId: string, action: string, detail: string) {
    await prisma.activityLog.create({ data: { userId, action, detail } });
}

export function adDetail(title: string, platform: string): string {
    const name = PLATFORM_NAMES[platform as keyof typeof PLATFORM_NAMES] ?? platform;
    return `${title} • ${name}`;
}
