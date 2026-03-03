import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLATFORM_NAMES, TONE_STYLE_NAMES } from "@/lib/types";
import { ArrowLeft, CheckCircle, Upload } from "lucide-react";
import Link from "next/link";
import { AdDetailActions } from "@/components/AdDetailActions";

// Force Node.js runtime (Prisma not compatible with Edge)
export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

export default async function AdDetailPage(props: { params: Params }) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const params = await props.params;
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
        DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
        SOLD: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
        ARCHIVED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link href="/dashboard/ads">
                <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Wróć do ogłoszeń
                </Button>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{PLATFORM_NAMES[ad.platform]}</Badge>
                        <Badge className={STATUS_COLORS[ad.status]} variant="secondary">
                            {STATUS_LABELS[ad.status]}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">{ad.title}</h1>
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
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
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
                                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
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
                        <p className="text-2xl font-bold text-orange-600">
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
                                <span className="text-gray-500 dark:text-gray-400">
                                    Utworzono:
                                </span>
                                <br />
                                <span className="font-medium">
                                    {new Date(ad.createdAt).toLocaleString("pl-PL")}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Zaktualizowano:
                                </span>
                                <br />
                                <span className="font-medium">
                                    {new Date(ad.updatedAt).toLocaleString("pl-PL")}
                                </span>
                            </div>
                            {parameters?.condition && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Stan:
                                    </span>
                                    <br />
                                    <span className="font-medium">{parameters.condition}</span>
                                </div>
                            )}
                            {parameters?.tone && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
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
                                    <span className="text-gray-500 dark:text-gray-400">
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
