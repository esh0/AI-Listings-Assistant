"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLATFORM_NAMES } from "@/lib/types";
import { Eye, Edit, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { AdStatus, Platform } from "@prisma/client";

interface AdCardProps {
    ad: {
        id: string;
        platform: Platform;
        title: string;
        description: string;
        status: AdStatus;
        priceMin?: number | null;
        priceMax?: number | null;
        soldPrice?: number | null;
        images: any;
        createdAt: Date;
        updatedAt: Date;
    };
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onMarkAsSold?: (id: string) => void;
}

const STATUS_LABELS: Record<AdStatus, string> = {
    DRAFT: "Wersja robocza",
    PUBLISHED: "Opublikowane",
    SOLD: "Sprzedane",
    ARCHIVED: "Zarchiwizowane",
};

const STATUS_COLORS: Record<AdStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    SOLD: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    ARCHIVED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export function AdCard({
    ad,
    onView,
    onEdit,
    onDelete,
    onMarkAsSold,
}: AdCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    // Get first image thumbnail
    const images = Array.isArray(ad.images) ? ad.images : [];
    const firstImage = images[0];
    const thumbnailUrl = firstImage?.url || "/placeholder-image.png";

    // Format price display
    const priceDisplay = ad.soldPrice
        ? `${ad.soldPrice} zł`
        : ad.priceMin && ad.priceMax
        ? `${ad.priceMin} - ${ad.priceMax} zł`
        : ad.priceMin
        ? `${ad.priceMin} zł`
        : "Cena do ustalenia";

    const handleDelete = async () => {
        if (!onDelete) return;

        const confirmed = confirm(
            "Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna."
        );

        if (confirmed) {
            setIsDeleting(true);
            await onDelete(ad.id);
        }
    };

    return (
        <Card className="overflow-hidden transition-shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Thumbnail */}
                <div className="w-full sm:w-36 h-36 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <div className="w-full h-full overflow-hidden rounded flex items-center justify-center bg-white dark:bg-gray-900">
                        <img
                            src={thumbnailUrl}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                            width={144}
                            height={144}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-h-[144px]">
                    <div className="mb-3">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
                                {ad.title}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                {new Date(ad.createdAt).toLocaleDateString("pl-PL")}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">
                                {PLATFORM_NAMES[ad.platform]}
                            </Badge>
                            <Badge
                                className={STATUS_COLORS[ad.status]}
                                variant="secondary"
                            >
                                {STATUS_LABELS[ad.status]}
                            </Badge>
                            <span className="text-sm font-medium text-foreground">
                                {priceDisplay}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-end gap-4 flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
                            {ad.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                            {onView && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onView(ad.id)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            )}
                            {onEdit && ad.status !== "SOLD" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onEdit(ad.id)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}
                            {onMarkAsSold && ad.status === "PUBLISHED" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onMarkAsSold(ad.id)}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
