"use client";

import { useState, useCallback } from "react";
import { Plus, FileText, ShoppingBag, Store, Facebook, Shirt, MoreVertical, Pencil, Trash2, ShoppingCart, Package, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateFormModal } from "@/components/TemplateFormModal";
import { cn } from "@/lib/utils";
import type { Platform, ToneStyle, ProductCondition, DeliveryOption, PriceType } from "@/lib/types";
import { PLATFORM_NAMES, TONE_STYLE_NAMES, CONDITION_NAMES, DELIVERY_NAMES } from "@/lib/types";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";

// Platform icons with brand colors (intentional hardcoded per project rules)
const PLATFORM_ICONS = {
    olx: { Icon: ShoppingBag, color: "text-orange-500" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600" },
    vinted: { Icon: Shirt, color: "text-teal-600" },
    ebay: { Icon: ShoppingCart, color: "text-yellow-500" },
    amazon: { Icon: Package, color: "text-yellow-600" },
    etsy: { Icon: Tag, color: "text-orange-400" },
} as const;

const PAGE_SIZE = 20;

export interface Template {
    id: string;
    name: string;
    platform: Platform;
    tone: ToneStyle;
    condition: ProductCondition;
    delivery: DeliveryOption[];
    bodyTemplate?: string | null;
    priceType?: PriceType | null;
    notes?: string | null;
    isDefault: boolean;
    createdAt: string;
    customToneInstructions?: string | null;
}

export function TemplatesList({ initialTemplates }: { initialTemplates: Template[] }) {
    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState<Template | null>(null);

    const totalPages = Math.max(1, Math.ceil(templates.length / PAGE_SIZE));
    const paginated = templates.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const refreshTemplates = useCallback(async () => {
        try {
            const res = await fetch("/api/templates");
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch {
            // silently ignore network errors — list stays as-is
        }
    }, []);

    const handleDelete = useCallback((template: Template) => {
        setOpenMenuId(null);
        setDeleteConfirm(template);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteConfirm) return;
        const template = deleteConfirm;
        setDeleteConfirm(null);
        setIsDeleting(template.id);
        try {
            const res = await fetch(`/api/templates/${template.id}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) {
                toast.error("Nie udało się usunąć szablonu. Spróbuj ponownie.");
                return;
            }
            toast.success(`Szablon "${template.name}" został usunięty`);
            await refreshTemplates();
        } finally {
            setIsDeleting(null);
        }
    }, [deleteConfirm, refreshTemplates]);

    const handleEdit = useCallback((template: Template) => {
        setEditingTemplate(template);
        setOpenMenuId(null);
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(async (saved: boolean) => {
        setModalOpen(false);
        setEditingTemplate(null);
        if (saved) await refreshTemplates();
    }, [refreshTemplates]);

    const handleNew = useCallback(() => {
        setEditingTemplate(null);
        setModalOpen(true);
    }, []);

    return (
        <>
            <ConfirmDialog
                open={!!deleteConfirm}
                title="Usuń szablon"
                description={`Czy na pewno chcesz usunąć szablon "${deleteConfirm?.name}"? Ta operacja jest nieodwracalna.`}
                confirmLabel="Usuń"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirm(null)}
            />

            {/* Count */}
            <p className="text-sm text-muted-foreground">
                {templates.length}{" "}
                {templates.length === 1 ? "szablon" : templates.length >= 2 && templates.length <= 4 ? "szablony" : "szablonów"}
            </p>

            {templates.length === 0 ? (
                <div className="flex flex-col items-center text-center py-16 space-y-3 text-muted-foreground">
                    <FileText className="h-10 w-10 opacity-40" />
                    <p className="font-medium">Brak szablonów</p>
                    <p className="text-sm">Utwórz pierwszy szablon klikając przycisk &ldquo;Nowy szablon&rdquo;</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {paginated.map((template) => {
                        const { Icon, color } = PLATFORM_ICONS[template.platform];
                        return (
                            <div
                                key={template.id}
                                className="relative flex items-center gap-4 p-5 rounded-xl border border-border bg-card"
                            >
                                {/* Platform icon */}
                                <div className={cn("flex-shrink-0", color)}>
                                    <Icon className="h-8 w-8" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground truncate">{template.name}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-xs text-muted-foreground">
                                            {PLATFORM_NAMES[template.platform]}
                                        </span>
                                        <span className="text-xs text-muted-foreground">·</span>
                                        <span className="text-xs text-muted-foreground">
                                            {TONE_STYLE_NAMES[template.tone]}
                                        </span>
                                        <span className="text-xs text-muted-foreground">·</span>
                                        <span className="text-xs text-muted-foreground">
                                            {CONDITION_NAMES[template.condition]}
                                        </span>
                                        <span className="text-xs text-muted-foreground">·</span>
                                        <span className="text-xs text-muted-foreground">
                                            {template.delivery.map((d) => DELIVERY_NAMES[d]).join(", ")}
                                        </span>
                                    </div>
                                </div>

                                {/* Date */}
                                <span className="hidden sm:block text-xs text-muted-foreground flex-shrink-0">
                                    {new Date(template.createdAt).toLocaleDateString("pl-PL")}
                                </span>

                                {/* Three-dot menu */}
                                <div className="relative flex-shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setOpenMenuId(openMenuId === template.id ? null : template.id)}
                                        aria-label="Opcje szablonu"
                                        aria-expanded={openMenuId === template.id}
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>

                                    {openMenuId === template.id && (
                                        <>
                                            {/* Backdrop */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setOpenMenuId(null)}
                                            />
                                            {/* Dropdown */}
                                            <div className="absolute right-0 top-9 z-20 min-w-[140px] rounded-xl border border-border bg-card shadow-lg py-1">
                                                <button
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                                                    onClick={() => handleEdit(template)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edytuj
                                                </button>
                                                <button
                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                                    onClick={() => handleDelete(template)}
                                                    disabled={isDeleting === template.id}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Usuń
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Poprzednia
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Następna
                    </Button>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={handleNew}
                className="fixed bottom-[72px] right-6 z-50 sm:right-8 flex items-center gap-1.5 bg-gradient-primary text-primary-foreground font-semibold px-5 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity text-sm"
            >
                <Plus className="h-4 w-4" />
                Nowy szablon
            </button>

            {modalOpen && (
                <TemplateFormModal
                    template={editingTemplate}
                    onClose={handleModalClose}
                />
            )}
        </>
    );
}
