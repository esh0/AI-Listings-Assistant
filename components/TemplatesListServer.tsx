import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TemplatesList } from "@/components/TemplatesList";
import type { Template } from "@/components/TemplatesList";
import type { DeliveryOption, PriceType } from "@/lib/types";
import { CONDITION_MAP_REVERSE } from "@/lib/condition-map";

export async function TemplatesListServer() {
    const session = await auth();
    if (!session?.user?.id) return null;

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

    return <TemplatesList initialTemplates={mappedTemplates} />;
}
