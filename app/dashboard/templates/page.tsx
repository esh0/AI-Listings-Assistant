import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TemplatesSoftwall } from "@/components/TemplatesSoftwall";
import { TemplatesList } from "@/components/TemplatesList";
import type { Template } from "@/components/TemplatesList";
import type { DeliveryOption, PriceType } from "@/lib/types";
import { CONDITION_MAP_REVERSE } from "@/lib/condition-map";

export default async function TemplatesPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    if (session.user.plan !== "RESELER") {
        return (
            <div className="space-y-6">
                <div className="pl-14 lg:pl-0">
                    <h1 className="text-xl sm:text-2xl font-bold">Szablony</h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Zapisz często używane ustawienia jako szablony
                    </p>
                </div>
                <TemplatesSoftwall />
            </div>
        );
    }

    const templates = await prisma.template.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    const mappedTemplates: Template[] = templates.map((t) => ({
        ...t,
        condition: CONDITION_MAP_REVERSE[t.condition],
        delivery: t.delivery as DeliveryOption[],
        priceType: t.priceType as PriceType | null,
        createdAt: t.createdAt.toISOString(),
    }));

    return (
        <div className="space-y-6">
            <div className="pl-14 lg:pl-0">
                <h1 className="text-xl sm:text-2xl font-bold">Szablony</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                    Zapisz często używane ustawienia jako szablony
                </p>
            </div>
            <TemplatesList initialTemplates={mappedTemplates} />
        </div>
    );
}
