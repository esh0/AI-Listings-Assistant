import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { StatsServer } from "@/components/StatsServer";
import { StatsSkeleton } from "@/components/StatsSkeleton";

export const runtime = "nodejs";

export default async function StatsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold">Statystyki</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Twoja aktywność w liczbach</p>
            </div>
            <Suspense fallback={<StatsSkeleton />}>
                <StatsServer />
            </Suspense>
        </div>
    );
}
