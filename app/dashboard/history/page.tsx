import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { History } from "lucide-react";
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
        <div className="p-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-start gap-3">
                <History className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Historia</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Ostatnie 50 zdarzeń w Twoim koncie
                    </p>
                </div>
            </div>

            <Suspense fallback={<HistorySkeleton />}>
                <HistoryList />
            </Suspense>
        </div>
    );
}
