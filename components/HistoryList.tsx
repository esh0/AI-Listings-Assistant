import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Zap, Save, Eye, ShoppingCart, Ban, Trash2, Clock, History } from "lucide-react";

function timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "przed chwilą";
    if (minutes < 60) return `${minutes} min temu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} godz. temu`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Wczoraj";
    if (days < 7) return `${days} dni temu`;
    return new Date(date).toLocaleDateString("pl-PL");
}

const ACTION_CONFIG: Record<string, { label: string; Icon: React.ElementType; color: string; dot: string }> = {
    AD_GENERATED: { label: "Wygenerowano ogłoszenie", Icon: Zap, color: "text-primary", dot: "bg-primary" },
    AD_SAVED: { label: "Zapisano ogłoszenie", Icon: Save, color: "text-success", dot: "bg-success" },
    AD_PUBLISHED: { label: "Opublikowano ogłoszenie", Icon: Eye, color: "text-success", dot: "bg-success" },
    AD_SOLD: { label: "Oznaczono jako sprzedane", Icon: ShoppingCart, color: "text-primary", dot: "bg-primary" },
    AD_ARCHIVED: { label: "Wycofano ogłoszenie", Icon: Ban, color: "text-muted-foreground", dot: "bg-muted-foreground" },
    AD_DELETED: { label: "Usunięto ogłoszenie", Icon: Trash2, color: "text-destructive", dot: "bg-destructive" },
};

export async function HistoryList() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const logs = await prisma.activityLog.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">Brak aktywności</p>
                <p className="text-muted-foreground/60 text-sm mt-1">
                    Tutaj pojawią się zdarzenia po wygenerowaniu pierwszego ogłoszenia.
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
            <ol className="space-y-0">
                {logs.map((log, index) => {
                    const config = ACTION_CONFIG[log.action] ?? {
                        label: log.action,
                        Icon: Clock,
                        color: "text-muted-foreground",
                        dot: "bg-muted-foreground",
                    };
                    const { label, Icon, color, dot } = config;

                    return (
                        <li
                            key={log.id}
                            className="relative pl-10 pb-6"
                            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
                        >
                            <span className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-background ${dot}`} />
                            <div className="bg-card border border-border rounded-xl px-4 py-3 hover:border-border/80 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium leading-snug">{label}</p>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">{log.detail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span className="whitespace-nowrap">{timeAgo(log.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
