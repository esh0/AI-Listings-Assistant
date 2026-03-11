"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLATFORM_NAMES } from "@/lib/types";
import { Eye, Edit, Trash2, CheckCircle, ShoppingBag, Store, Facebook, Shirt, CircleDollarSign } from "lucide-react";
import { useState } from "react";
import { AdStatus, Platform } from "@prisma/client";
import { cn } from "@/lib/utils";

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
    onMarkAsPublished?: (id: string) => void;
    onClick?: (id: string) => void; // For clickable cards (dashboard)
    showTooltips?: boolean; // Show tooltips on action buttons
    isSelected?: boolean;
    onToggleSelect?: (id: string) => void;
}

const STATUS_LABELS: Record<AdStatus, string> = {
    DRAFT: "Wersja robocza",
    PUBLISHED: "Opublikowane",
    SOLD: "Sprzedane",
    ARCHIVED: "Zarchiwizowane",
};

const STATUS_COLORS: Record<AdStatus, string> = {
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

export function AdCard({
    ad,
    onView,
    onEdit,
    onDelete,
    onMarkAsSold,
    onMarkAsPublished,
    onClick,
    showTooltips = false,
    isSelected = false,
    onToggleSelect,
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

    const handleCardClick = () => {
        if (onClick) {
            onClick(ad.id);
        }
    };

    // Determine if card should have hover effect and be clickable
    const hasActions = !!(onView || onEdit || onDelete || onMarkAsSold || onMarkAsPublished);
    const isClickable = !!onClick;

    // Platform icon
    const PlatformIcon = PLATFORM_ICONS[ad.platform];
    const platformColor = PLATFORM_COLORS[ad.platform];

    return (
        <div className="flex items-start gap-3">
            {onToggleSelect && (
                <div className="pt-6 flex-shrink-0">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(ad.id)}
                        className="h-4 w-4 accent-primary cursor-pointer"
                        aria-label={`Zaznacz ogłoszenie: ${ad.title}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            <Card
                className={cn(
                    "overflow-hidden p-5 flex-1",
                    isClickable && "cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]",
                    isSelected && "ring-2 ring-primary"
                )}
                onClick={isClickable ? handleCardClick : undefined}
            >
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Thumbnail */}
                <div className="w-full sm:w-36 h-48 sm:h-36 bg-muted flex-shrink-0">
                    <div className="w-full h-full overflow-hidden rounded flex items-center justify-center bg-card">
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
                        <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                            <h3 className="text-lg font-bold text-foreground line-clamp-2 flex-1 tracking-tight">
                                {ad.title}
                            </h3>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                {new Date(ad.createdAt).toLocaleDateString("pl-PL")}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div
                                className="flex items-center gap-1.5"
                                title={PLATFORM_NAMES[ad.platform]}
                            >
                                <PlatformIcon className={cn("h-4 w-4", platformColor)} aria-hidden="true" />
                            </div>
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

                    <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                            {ad.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0 self-end sm:self-auto">
                            {onView && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(ad.id);
                                    }}
                                    title={showTooltips ? "Zobacz szczegóły" : undefined}
                                    aria-label="Zobacz szczegóły"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            )}
                            {onEdit && ad.status !== "SOLD" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(ad.id);
                                    }}
                                    title={showTooltips ? "Edytuj ogłoszenie" : undefined}
                                    aria-label="Edytuj ogłoszenie"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            )}
                            {onMarkAsPublished && ad.status === "DRAFT" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsPublished(ad.id);
                                    }}
                                    className="text-success hover:text-success/80 hover:bg-success/10"
                                    title={showTooltips ? "Oznacz jako opublikowane" : undefined}
                                    aria-label="Oznacz jako opublikowane"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                </Button>
                            )}
                            {onMarkAsSold && ad.status === "PUBLISHED" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsSold(ad.id);
                                    }}
                                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                    title={showTooltips ? "Oznacz jako sprzedane" : undefined}
                                    aria-label="Oznacz jako sprzedane"
                                >
                                    <CircleDollarSign className="h-4 w-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                    disabled={isDeleting}
                                    className={cn(
                                        "text-destructive hover:text-destructive/80 hover:bg-destructive/10",
                                        isDeleting && "opacity-50 cursor-not-allowed"
                                    )}
                                    title={showTooltips ? "Usuń ogłoszenie" : undefined}
                                    aria-label="Usuń ogłoszenie"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </Card>
        </div>
    );
}
