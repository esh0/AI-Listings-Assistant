import { FileText, Edit, CheckCircle, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
    stats: {
        total: number;
        drafts: number;
        published: number;
        sold: number;
    };
}

const STAGGER_CLASSES = [
    "animate-stagger-1",
    "animate-stagger-2",
    "animate-stagger-3",
    "animate-stagger-4",
] as const;

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Wszystkie ogłoszenia",
            value: stats.total,
            icon: FileText,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            title: "Wersje robocze",
            value: stats.drafts,
            icon: Edit,
            color: "text-muted-foreground",
            bgColor: "bg-muted",
        },
        {
            title: "Opublikowane",
            value: stats.published,
            icon: CheckCircle,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            title: "Sprzedane",
            value: stats.sold,
            icon: DollarSign,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <Card key={card.title} className={`p-5 ${STAGGER_CLASSES[index]}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg flex-shrink-0 ${card.bgColor}`}>
                                <Icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-foreground tracking-tight">
                                    {card.value}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {card.title}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
