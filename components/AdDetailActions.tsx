"use client";

import { Button } from "@/components/ui/button";
import { Pencil, ShoppingCart, Ban, Upload, Trash2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { AdStatus } from "@prisma/client";

interface AdDetailActionsProps {
    ad: {
        id: string;
        status: AdStatus;
    };
    title?: string;
    description?: string;
    hasEdits?: boolean;
    editing?: boolean;
    onEditToggle?: () => void;
}

export function AdDetailActions({ ad, title, description, hasEdits, editing, onEditToggle }: AdDetailActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const isProcessingRef = useRef(false);

    const patch = async (body: object) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/ads/${ad.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error("Failed to update ad");
            router.refresh();
        } catch (error) {
            console.error("Failed to update ad:", error);
        } finally {
            setIsUpdating(false);
            isProcessingRef.current = false;
        }
    };

    const handleSaveEdits = () => {
        if (!title?.trim() || !description?.trim()) return;
        patch({ title: title.trim(), description: description.trim() });
    };

    const handleMarkAsPublished = () => {
        if (!confirm("Czy na pewno chcesz oznaczyć to ogłoszenie jako opublikowane?")) return;
        patch({ status: "PUBLISHED" });
    };

    const handleMarkAsSold = () => {
        const price = prompt("Podaj cenę sprzedaży (zł):");
        if (!price) return;
        const soldPrice = parseFloat(price);
        if (isNaN(soldPrice) || soldPrice <= 0) return;
        patch({ status: "SOLD", soldPrice });
    };

    const handleArchive = () => {
        if (!confirm("Czy na pewno chcesz zarchiwizować to ogłoszenie?")) return;
        patch({ status: "ARCHIVED" });
    };

    const handleDelete = async () => {
        if (!confirm("Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna.")) return;
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
        <>
            {/* Save edits — only when there are unsaved changes */}
            {hasEdits && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveEdits}
                    disabled={isUpdating || !title?.trim() || !description?.trim()}
                >
                    <Save className="h-4 w-4 mr-1" />
                    Zapisz
                </Button>
            )}

            {/* Edytuj — tylko dla DRAFT */}
            {ad.status === "DRAFT" && onEditToggle && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onEditToggle}
                    disabled={isUpdating}
                >
                    <Pencil className="h-4 w-4 mr-1" />
                    {editing ? "Zakończ" : "Edytuj"}
                </Button>
            )}

            {/* Opublikuj — tylko dla DRAFT */}
            {ad.status === "DRAFT" && (
                <Button
                    onClick={handleMarkAsPublished}
                    disabled={isUpdating}
                    size="sm"
                    variant="outline"
                >
                    <Upload className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Opublikuj</span>
                </Button>
            )}

            {/* Sprzedane — tylko dla PUBLISHED */}
            {ad.status === "PUBLISHED" && (
                <Button
                    onClick={handleMarkAsSold}
                    disabled={isUpdating}
                    size="sm"
                    variant="outline"
                >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Sprzedane</span>
                </Button>
            )}

            {/* Wycofaj — dla DRAFT i PUBLISHED */}
            {(ad.status === "DRAFT" || ad.status === "PUBLISHED") && (
                <Button
                    onClick={handleArchive}
                    disabled={isUpdating}
                    size="sm"
                    variant="outline"
                >
                    <Ban className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Wycofaj</span>
                </Button>
            )}

            {/* Usuń — zawsze */}
            <Button
                onClick={handleDelete}
                disabled={isUpdating}
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </>
    );
}
