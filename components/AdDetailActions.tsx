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
        priceMin?: number | null;
        priceMax?: number | null;
        soldPrice?: number | null;
        publishPrice?: number | null;
        parameters?: {
            priceType?: string;
            userPrice?: number;
        } | null;
    };
    title?: string;
    description?: string;
    hasEdits?: boolean;
    editing?: boolean;
    onEditToggle?: () => void;
}

type DialogType = "archive" | "delete" | null;

export function AdDetailActions({ ad, title, description, hasEdits, editing, onEditToggle }: AdDetailActionsProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [dialog, setDialog] = useState<DialogType>(null);
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [soldDialogOpen, setSoldDialogOpen] = useState(false);
    const isProcessingRef = useRef(false);

    // Default price for publish dialog: userPrice if user_provided, midpoint of AI range, or undefined for free
    const publishDefaultPrice = (() => {
        const { priceType, userPrice } = ad.parameters ?? {};
        if (priceType === "free") return undefined;
        if (priceType === "user_provided" && userPrice) return userPrice;
        if (ad.priceMin != null && ad.priceMax != null) return Math.round((ad.priceMin + ad.priceMax) / 2);
        return ad.priceMin ?? ad.priceMax ?? undefined;
    })();
    const publishDefaultFree = ad.parameters?.priceType === "free";

    // Default price for sold dialog: price recorded at publish time
    const soldDefaultPrice = ad.publishPrice ?? undefined;
    const soldDefaultFree = ad.publishPrice === null && ad.status === "PUBLISHED";

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
        setPublishDialogOpen(true);
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
        if (type === "archive") {
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

    const handlePublishConfirm = async (price: number | null) => {
        setPublishDialogOpen(false);
        await patch({ status: "PUBLISHED", publishPrice: price });
        toast.success("Ogłoszenie oznaczone jako opublikowane");
    };

    const handleSoldConfirm = async (price: number | null) => {
        setSoldDialogOpen(false);
        await patch({ status: "SOLD", soldPrice: price });
        toast.success(price != null ? `Ogłoszenie sprzedane za ${price} zł` : "Ogłoszenie oznaczone jako sprzedane");
    };

    return (
        <>
            <ConfirmDialog
                open={!!dialog}
                title={
                    dialog === "delete" ? "Usuń ogłoszenie" :
                    "Wycofaj ogłoszenie"
                }
                description={
                    dialog === "delete" ? "Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna." :
                    "Czy na pewno chcesz wycofać to ogłoszenie?"
                }
                confirmLabel={dialog === "delete" ? "Usuń" : "Wycofaj"}
                variant={dialog === "delete" ? "destructive" : "default"}
                onConfirm={handleDialogConfirm}
                onCancel={() => setDialog(null)}
            />
            <SoldPriceDialog
                open={publishDialogOpen}
                defaultValue={publishDefaultPrice}
                defaultFree={publishDefaultFree}
                title="Opublikuj ogłoszenie"
                description="Podaj cenę za jaką oferujesz produkt."
                confirmLabel="Opublikuj"
                showFree
                onConfirm={handlePublishConfirm}
                onCancel={() => setPublishDialogOpen(false)}
            />
            <SoldPriceDialog
                open={soldDialogOpen}
                defaultValue={soldDefaultPrice}
                defaultFree={soldDefaultFree}
                title="Oznacz jako sprzedane"
                description="Podaj cenę za jaką sprzedałeś produkt."
                confirmLabel="Potwierdź sprzedaż"
                showFree
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
