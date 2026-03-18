import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TemplatesSoftwall } from "@/components/TemplatesSoftwall";
import { TemplatesListServer } from "@/components/TemplatesListServer";
import { TemplatesListSkeleton } from "@/components/TemplatesListSkeleton";

export const runtime = "nodejs";

export default async function TemplatesPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    if (session.user.plan !== "RESELER") {
        return (
            <div className="space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold">Szablony</h1>
                <p className="text-muted-foreground text-sm">Zapisz często używane ustawienia jako szablony</p>
                <TemplatesSoftwall />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold">Szablony</h1>
            <p className="text-muted-foreground text-sm">Zapisz często używane ustawienia jako szablony</p>
            <Suspense fallback={<TemplatesListSkeleton />}>
                <TemplatesListServer />
            </Suspense>
        </div>
    );
}
