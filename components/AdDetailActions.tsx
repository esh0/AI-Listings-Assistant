"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, Archive, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { AdStatus } from "@prisma/client";

interface AdDetailActionsProps {
    ad: {
        id: string;
        status: AdStatus;
    };
}

export function AdDetailActions({ ad }: AdDetailActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const isProcessingRef = useRef(false);

    const handleMarkAsPublished = async () => {
        const confirmed = confirm("Czy na pewno chcesz oznaczyć to ogłoszenie jako opublikowane?");
        if (!confirmed) return;

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "PUBLISHED" }),
            });
            if (!response.ok) throw new Error("Failed to update ad");
            router.refresh();
        } catch (error) {
            console.error("Failed to mark as published:", error);
        } finally {
            setIsUpdating(false);
            isProcessingRef.current = false;
        }
    };

    const handleMarkAsSold = async () => {
        const price = prompt("Podaj cenę sprzedaży (zł):");
        if (!price) return;

        const soldPrice = parseFloat(price);
        if (isNaN(soldPrice) || soldPrice <= 0) return;

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "SOLD", soldPrice }),
            });
            if (!response.ok) throw new Error("Failed to mark ad as sold");
            router.refresh();
        } catch (error) {
            console.error("Failed to mark ad as sold:", error);
        } finally {
            setIsUpdating(false);
            isProcessingRef.current = false;
        }
    };

    const handleArchive = async () => {
        const confirmed = confirm("Czy na pewno chcesz zarchiwizować to ogłoszenie?");
        if (!confirmed) return;

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "ARCHIVED" }),
            });
            if (!response.ok) throw new Error("Failed to archive ad");
            router.refresh();
        } catch (error) {
            console.error("Failed to archive ad:", error);
        } finally {
            setIsUpdating(false);
            isProcessingRef.current = false;
        }
    };

    const handleDelete = async () => {
        const confirmed = confirm(
            "Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna."
        );
        if (!confirmed) return;

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete ad");
            router.push("/dashboard/ads");
        } catch (error) {
            console.error("Failed to delete ad:", error);
            setIsUpdating(false);
            isProcessingRef.current = false;
        }
    };

    return (
        <div className="flex gap-2 flex-shrink-0">
            {ad.status === "DRAFT" && (
                <Button
                    onClick={handleMarkAsPublished}
                    disabled={isUpdating}
                    size="sm"
                    variant="outline"
                    className="text-success hover:text-success hover:bg-success/10"
                    title="Oznacz jako opublikowane"
                >
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Opublikuj</span>
                </Button>
            )}

            {ad.status === "PUBLISHED" && (
                <Button
                    onClick={handleMarkAsSold}
                    disabled={isUpdating}
                    size="sm"
                    variant="outline"
                    className="text-primary hover:text-primary hover:bg-primary/10"
                    title="Oznacz jako sprzedane"
                >
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Sprzedane</span>
                </Button>
            )}

            {(ad.status === "DRAFT" || ad.status === "PUBLISHED") && (
                <Button
                    onClick={handleArchive}
                    disabled={isUpdating}
                    size="sm"
                    variant="outline"
                    title="Archiwizuj"
                >
                    <Archive className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Archiwizuj</span>
                </Button>
            )}

            <Button
                onClick={handleDelete}
                disabled={isUpdating}
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Usuń"
            >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Usuń</span>
            </Button>
        </div>
    );
}
