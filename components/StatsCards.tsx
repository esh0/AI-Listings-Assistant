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

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Wszystkie ogłoszenia",
            value: stats.total,
            icon: FileText,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-950",
        },
        {
            title: "Wersje robocze",
            value: stats.drafts,
            icon: Edit,
            color: "text-gray-600 dark:text-gray-400",
            bgColor: "bg-gray-50 dark:bg-gray-800",
        },
        {
            title: "Opublikowane",
            value: stats.published,
            icon: CheckCircle,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-950",
        },
        {
            title: "Sprzedane",
            value: stats.sold,
            icon: DollarSign,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-50 dark:bg-orange-950",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <Card key={card.title} className="p-6">
                        <div className="flex items-center gap-4">
                            <div
                                className={`p-3 rounded-lg ${card.bgColor}`}
                            >
                                <Icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-foreground mt-1">
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
