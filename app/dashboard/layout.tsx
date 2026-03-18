import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";

// Force Node.js runtime (auth not compatible with Edge)
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

    return (
        <DashboardShell
            user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
                plan: session.user.plan as "FREE" | "STARTER" | "RESELER" | undefined,
                creditsAvailable: session.user.creditsAvailable,
                boostCredits: session.user.boostCredits,
                creditsResetAt: session.user.creditsResetAt,
            }}
        >
            {children}
        </DashboardShell>
    );
}
