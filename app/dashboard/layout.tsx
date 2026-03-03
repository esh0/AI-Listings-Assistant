import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar
                user={{
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                    plan: session.user.plan,
                    creditsAvailable: session.user.creditsAvailable,
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
