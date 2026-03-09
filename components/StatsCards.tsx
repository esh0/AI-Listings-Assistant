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
                        <div className="flex items-center justify-between mb-3">
                            <div
                                className={`p-2.5 rounded-lg ${card.bgColor}`}
                            >
                                <Icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-foreground tracking-tight">
                            {card.value}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {card.title}
                        </p>
                    </Card>
                );
            })}
        </div>
    );
}
