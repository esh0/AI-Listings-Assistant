import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { HistoryList } from "@/components/HistoryList";
import { HistorySkeleton } from "@/components/HistorySkeleton";

export const runtime = "nodejs";

export default async function HistoryPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin?callbackUrl=/dashboard/history");
    }

    return (
        <div className="space-y-6">
            {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold">Historia</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                    Ostatnie 50 zdarzeń w Twoim koncie
                </p>

            <Suspense fallback={<HistorySkeleton />}>
                <HistoryList />
            </Suspense>
        </div>
    );
}
