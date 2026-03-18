import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdDetailServer } from "@/components/AdDetailServer";
import { AdDetailSkeleton } from "@/components/AdDetailSkeleton";

// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export default async function AdDetailPage(props: { params: Params }) {
    const [session, params] = await Promise.all([auth(), props.params]);

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    return (
        <Suspense fallback={<AdDetailSkeleton />}>
            <AdDetailServer id={params.id} />
        </Suspense>
    );
}
