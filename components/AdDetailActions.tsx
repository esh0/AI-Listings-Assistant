"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, Archive, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdStatus, Platform } from "@prisma/client";

interface AdDetailActionsProps {
    ad: {
        id: string;
        status: AdStatus;
        platform: Platform;
    };
}

export function AdDetailActions({ ad }: AdDetailActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleMarkAsPublished = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "PUBLISHED" }),
            });

            if (!response.ok) {
                throw new Error("Failed to update ad");
            }

            router.refresh();
        } catch (error) {
            console.error("Failed to mark as published:", error);
            alert("Nie udało się oznaczyć jako opublikowane");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMarkAsSold = async () => {
        const price = prompt("Podaj cenę sprzedaży (zł):");
        if (!price) return;

        const soldPrice = parseFloat(price);
        if (isNaN(soldPrice) || soldPrice <= 0) {
            alert("Nieprawidłowa cena");
            return;
        }

        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "SOLD",
                    soldPrice,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to mark ad as sold");
            }

            router.refresh();
        } catch (error) {
            console.error("Failed to mark ad as sold:", error);
            alert("Nie udało się oznaczyć jako sprzedane");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleArchive = async () => {
        const confirmed = confirm("Czy na pewno chcesz zarchiwizować to ogłoszenie?");
        if (!confirmed) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "ARCHIVED" }),
            });

            if (!response.ok) {
                throw new Error("Failed to archive ad");
            }

            router.refresh();
        } catch (error) {
            console.error("Failed to archive ad:", error);
            alert("Nie udało się zarchiwizować ogłoszenia");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = confirm(
            "Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna."
        );
        if (!confirmed) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete ad");
            }

            router.push("/dashboard/ads");
        } catch (error) {
            console.error("Failed to delete ad:", error);
            alert("Nie udało się usunąć ogłoszenia");
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex gap-2">
            {ad.status === "DRAFT" && (
                <Button
                    onClick={handleMarkAsPublished}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    <Upload className="h-4 w-4 mr-2" />
                    Oznacz jako opublikowane
                </Button>
            )}

            {ad.status === "PUBLISHED" && (
                <Button
                    onClick={handleMarkAsSold}
                    disabled={isUpdating}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Oznacz jako sprzedane
                </Button>
            )}

            {(ad.status === "DRAFT" || ad.status === "PUBLISHED") && (
                <Button
                    onClick={handleArchive}
                    disabled={isUpdating}
                    variant="outline"
                >
                    <Archive className="h-4 w-4 mr-2" />
                    Archiwizuj
                </Button>
            )}

            <Button
                onClick={handleDelete}
                disabled={isUpdating}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Usuń
            </Button>
        </div>
    );
}
