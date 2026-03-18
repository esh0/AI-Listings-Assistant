import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdsListServer } from "@/components/AdsListServer";
import { AdsListSkeleton } from "@/components/AdsListSkeleton";
import { Suspense } from "react";

// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdsPage(props: { searchParams: SearchParams }) {
    const [session, searchParams] = await Promise.all([
        auth(),
        props.searchParams,
    ]);

    if (!session?.user?.id) {
        redirect("/auth/signin?callbackUrl=/dashboard/ads");
    }

    return (
        <>
        <div className="space-y-4">
            {/* Header */}
            <div className="pl-14 lg:pl-0">
                <h1 className="text-xl sm:text-2xl font-bold">Moje ogłoszenia</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Zarządzaj swoimi wygenerowanymi ogłoszeniami</p>
            </div>

            {/* Ads List with filters */}
            <Suspense fallback={<AdsListSkeleton />}>
                <AdsListServer searchParams={searchParams} />
            </Suspense>
        </div>
        </>
    );
}
