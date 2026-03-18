"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, FileText, ShoppingBag, Store, Facebook, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateFormModal } from "@/components/TemplateFormModal";
import { cn } from "@/lib/utils";
import type { Platform, ToneStyle, ProductCondition, DeliveryOption, PriceType } from "@/lib/types";
import { PLATFORM_NAMES, TONE_STYLE_NAMES } from "@/lib/types";

// Platform icons with brand colors (intentional hardcoded per project rules)
const PLATFORM_ICONS = {
    olx: { Icon: ShoppingBag, color: "text-orange-500" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600" },
    vinted: { Icon: Shirt, color: "text-teal-600" },
} as const;

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
}

export function TemplatesList({ initialTemplates }: { initialTemplates: Template[] }) {
    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

    const handleDelete = useCallback(async (template: Template) => {
        if (!window.confirm(`Czy na pewno chcesz usunąć szablon "${template.name}"?`)) return;
        setIsDeleting(template.id);
        try {
            const res = await fetch(`/api/templates/${template.id}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) {
                alert("Nie udało się usunąć szablonu. Spróbuj ponownie.");
                return;
            }
            await refreshTemplates();
        } finally {
            setIsDeleting(null);
        }
    }, [refreshTemplates]);

    const handleEdit = useCallback((template: Template) => {
        setEditingTemplate(template);
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
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                    {templates.length}{" "}
                    {templates.length === 1 ? "szablon" : templates.length >= 2 && templates.length <= 4 ? "szablony" : "szablonów"}
                </p>
                <Button size="sm" onClick={handleNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nowy szablon
                </Button>
            </div>

            {templates.length === 0 ? (
                <div className="flex flex-col items-center text-center py-16 space-y-3 text-muted-foreground">
                    <FileText className="h-10 w-10 opacity-40" />
                    <p className="font-medium">Brak szablonów</p>
                    <p className="text-sm">Utwórz pierwszy szablon klikając &ldquo;Nowy szablon&rdquo;</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => {
                        const { Icon, color } = PLATFORM_ICONS[template.platform];
                        return (
                            <div
                                key={template.id}
                                className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-medium text-sm leading-tight">{template.name}</p>
                                    <div className="flex gap-1 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => handleEdit(template)}
                                            aria-label="Edytuj szablon"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(template)}
                                            disabled={isDeleting === template.id}
                                            aria-label="Usuń szablon"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={cn("flex items-center gap-1 text-xs", color)}>
                                        <Icon className="h-3.5 w-3.5" />
                                        {PLATFORM_NAMES[template.platform]}
                                    </span>
                                    <span className="text-xs text-muted-foreground">·</span>
                                    <span className="text-xs text-muted-foreground">
                                        {TONE_STYLE_NAMES[template.tone]}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-auto">
                                    {new Date(template.createdAt).toLocaleDateString("pl-PL")}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {modalOpen && (
                <TemplateFormModal
                    template={editingTemplate}
                    onClose={handleModalClose}
                />
            )}
        </>
    );
}
