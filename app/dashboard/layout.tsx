import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { prisma } from "@/lib/prisma";

// Force Node.js runtime (auth with Prisma not compatible with Edge)
export const runtime = "nodejs";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    // Fetch fresh credits from database (for when full reload happens)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            plan: true,
            creditsAvailable: true,
            boostCredits: true,
            creditsResetAt: true,
        },
    });

    return (
        <DashboardShell
            user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
                plan: (user?.plan || session.user.plan) as "FREE" | "STARTER" | "RESELER" | undefined,
                creditsAvailable: user?.creditsAvailable ?? session.user.creditsAvailable,
                boostCredits: user?.boostCredits ?? session.user.boostCredits,
                creditsResetAt: user?.creditsResetAt?.toISOString() ?? session.user.creditsResetAt,
            }}
        >
            {children}
        </DashboardShell>
    );
}
