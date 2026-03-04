import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
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
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar
                user={{
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                    plan: user?.plan || session.user.plan,
                    creditsAvailable: user?.creditsAvailable ?? session.user.creditsAvailable,
                }}
            />
            <main className="lg:pl-72">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
