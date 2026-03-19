"use client";

import { Button } from "@/components/ui/button";
import { Pencil, ShoppingCart, Ban, Upload, Trash2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { AdStatus } from "@prisma/client";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SoldPriceDialog } from "@/components/SoldPriceDialog";

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

type DialogType = "publish" | "archive" | "delete" | null;

export function AdDetailActions({ ad, title, description, hasEdits, editing, onEditToggle }: AdDetailActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [dialog, setDialog] = useState<DialogType>(null);
    const [soldDialogOpen, setSoldDialogOpen] = useState(false);
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
            toast.error("Nie udało się zaktualizować ogłoszenia");
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
        setDialog("publish");
    };

    const handleMarkAsSold = () => {
        setSoldDialogOpen(true);
    };

    const handleArchive = () => {
        setDialog("archive");
    };

    const handleDelete = () => {
        setDialog("delete");
    };

    const handleDialogConfirm = async () => {
        const type = dialog;
        setDialog(null);
        if (type === "publish") {
            await patch({ status: "PUBLISHED" });
            toast.success("Ogłoszenie oznaczone jako opublikowane");
        } else if (type === "archive") {
            await patch({ status: "ARCHIVED" });
            toast.success("Ogłoszenie zostało wycofane");
        } else if (type === "delete") {
            if (isProcessingRef.current) return;
            isProcessingRef.current = true;
            setIsUpdating(true);
            try {
                const response = await fetch(`/api/ads/${ad.id}`, { method: "DELETE" });
                if (!response.ok) throw new Error();
                toast.success("Ogłoszenie zostało usunięte");
                router.push("/dashboard/ads");
            } catch {
                toast.error("Nie udało się usunąć ogłoszenia");
                setIsUpdating(false);
                isProcessingRef.current = false;
            }
        }
    };

    const handleSoldConfirm = async (price: number) => {
        setSoldDialogOpen(false);
        await patch({ status: "SOLD", soldPrice: price });
        toast.success(`Ogłoszenie sprzedane za ${price} zł`);
    };

    return (
        <>
            <ConfirmDialog
                open={!!dialog}
                title={
                    dialog === "delete" ? "Usuń ogłoszenie" :
                    dialog === "archive" ? "Wycofaj ogłoszenie" :
                    "Opublikuj ogłoszenie"
                }
                description={
                    dialog === "delete" ? "Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna." :
                    dialog === "archive" ? "Czy na pewno chcesz wycofać to ogłoszenie?" :
                    "Oznaczyć ogłoszenie jako opublikowane?"
                }
                confirmLabel={
                    dialog === "delete" ? "Usuń" :
                    dialog === "archive" ? "Wycofaj" :
                    "Opublikuj"
                }
                variant={dialog === "delete" ? "destructive" : "default"}
                onConfirm={handleDialogConfirm}
                onCancel={() => setDialog(null)}
            />
            <SoldPriceDialog
                open={soldDialogOpen}
                onConfirm={handleSoldConfirm}
                onCancel={() => setSoldDialogOpen(false)}
            />

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
