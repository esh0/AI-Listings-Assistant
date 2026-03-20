import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/SettingsClient";

export const runtime = "nodejs";

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Ustawienia konta</h1>
            <SettingsClient
                name={session.user.name}
                email={session.user.email}
                plan={(session.user.plan as "FREE" | "STARTER" | "RESELER") ?? "FREE"}
            />
        </div>
    );
}
