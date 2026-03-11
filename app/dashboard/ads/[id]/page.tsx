import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLATFORM_NAMES, TONE_STYLE_NAMES } from "@/lib/types";
import { ArrowLeft, ShoppingBag, Store, Facebook, Shirt } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AdDetailActions } from "@/components/AdDetailActions";

// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export default async function AdDetailPage(props: { params: Params }) {
    // Parallelize auth and params resolution
    const [session, params] = await Promise.all([
        auth(),
        props.params
    ]);

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const ad = await prisma.ad.findUnique({
        where: {
            id: params.id,
            userId: session.user.id, // Ensure user owns this ad
        },
    });

    if (!ad) {
        notFound();
    }

    const images = Array.isArray(ad.images) ? ad.images : [];
    const parameters = ad.parameters as any;

    const STATUS_LABELS: Record<string, string> = {
        DRAFT: "Wersja robocza",
        PUBLISHED: "Opublikowane",
        SOLD: "Sprzedane",
        ARCHIVED: "Zarchiwizowane",
    };

    const STATUS_COLORS: Record<string, string> = {
        DRAFT: "bg-muted text-muted-foreground",
        PUBLISHED: "bg-success/10 text-success",
        SOLD: "bg-primary/10 text-primary",
        ARCHIVED: "bg-muted text-muted-foreground",
    };

    const PLATFORM_ICONS = {
        olx: ShoppingBag,
        allegro_lokalnie: Store,
        facebook_marketplace: Facebook,
        vinted: Shirt,
    } as const;

    const PLATFORM_COLORS = {
        olx: "text-orange-500",
        allegro_lokalnie: "text-green-600",
        facebook_marketplace: "text-blue-600",
        vinted: "text-teal-600",
    } as const;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <div className="pl-12 lg:pl-0">
                <Link href="/dashboard/ads">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Wróć do ogłoszeń
                    </Button>
                </Link>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {(() => {
                            const Icon = PLATFORM_ICONS[ad.platform as keyof typeof PLATFORM_ICONS];
                            const colorClass = PLATFORM_COLORS[ad.platform as keyof typeof PLATFORM_COLORS];
                            return Icon ? (
                                <span title={PLATFORM_NAMES[ad.platform]}>
                                    <Icon className={cn("h-5 w-5", colorClass)} />
                                </span>
                            ) : (
                                <Badge variant="outline">{PLATFORM_NAMES[ad.platform]}</Badge>
                            );
                        })()}
                        <Badge className={STATUS_COLORS[ad.status]} variant="secondary">
                            {STATUS_LABELS[ad.status]}
                        </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{ad.title}</h1>
                </div>

                {/* Action Buttons */}
                <AdDetailActions ad={ad} />
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Description */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Opis</h2>
                        <p className="text-foreground whitespace-pre-wrap">
                            {ad.description}
                        </p>
                    </Card>

                    {/* Images */}
                    {images.length > 0 && (
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">Zdjęcia</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {images.map((img: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Zdjęcie ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            width={300}
                                            height={300}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-3">Cena</h3>
                        <p className="text-2xl font-bold text-primary">
                            {ad.soldPrice
                                ? `${ad.soldPrice} zł (sprzedane)`
                                : ad.priceMin && ad.priceMax
                                ? `${ad.priceMin} - ${ad.priceMax} zł`
                                : ad.priceMin
                                ? `${ad.priceMin} zł`
                                : "Do ustalenia"}
                        </p>
                    </Card>

                    {/* Metadata */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4">Szczegóły</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-muted-foreground">
                                    Utworzono:
                                </span>
                                <br />
                                <span className="font-medium">
                                    {new Date(ad.createdAt).toLocaleString("pl-PL")}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Zaktualizowano:
                                </span>
                                <br />
                                <span className="font-medium">
                                    {new Date(ad.updatedAt).toLocaleString("pl-PL")}
                                </span>
                            </div>
                            {parameters?.condition && (
                                <div>
                                    <span className="text-muted-foreground">
                                        Stan:
                                    </span>
                                    <br />
                                    <span className="font-medium">{parameters.condition}</span>
                                </div>
                            )}
                            {parameters?.tone && (
                                <div>
                                    <span className="text-muted-foreground">
                                        Styl opisu:
                                    </span>
                                    <br />
                                    <span className="font-medium">
                                        {TONE_STYLE_NAMES[parameters.tone as keyof typeof TONE_STYLE_NAMES]}
                                    </span>
                                </div>
                            )}
                            {parameters?.delivery && Array.isArray(parameters.delivery) && (
                                <div>
                                    <span className="text-muted-foreground">
                                        Dostawa:
                                    </span>
                                    <br />
                                    <span className="font-medium">
                                        {parameters.delivery.join(", ")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
