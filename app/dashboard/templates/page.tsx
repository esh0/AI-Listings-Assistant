"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { PLATFORM_NAMES, TONE_STYLE_NAMES } from "@/lib/types";
import type { Platform as PrismaP, ToneStyle as PrismaT, ProductCondition as PrismaC } from "@prisma/client";

// Local display names for Prisma ProductCondition enum
const PRISMA_CONDITION_NAMES: Record<PrismaC, string> = {
    nowy: "Nowy",
    uzywany_jak_nowy: "Używany, jak nowy",
    uzywany_w_dobrym_stanie: "Używany, w dobrym stanie",
    uzywany_w_przecietnym_stanie: "Używany, w przeciętnym stanie",
    uszkodzony: "Uszkodzony",
};

interface Template {
    id: string;
    name: string;
    platform: PrismaP;
    tone: PrismaT;
    condition: PrismaC;
    delivery: string[];
    isDefault: boolean;
    createdAt: Date;
}

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [newTemplate, setNewTemplate] = useState({
        name: "",
        platform: "olx" as PrismaP,
        tone: "casual" as PrismaT,
        condition: "nowy" as PrismaC,
        delivery: ["odbiór osobisty", "wysyłka"],
        isDefault: false,
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetch("/api/templates");
            const data = await response.json();
            setTemplates(data.templates || []);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newTemplate.name.trim()) {
            alert("Nazwa szablonu jest wymagana");
            return;
        }

        setIsCreating(true);

        try {
            const response = await fetch("/api/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTemplate),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create template");
            }

            // Reset form and refresh list
            setNewTemplate({
                name: "",
                platform: "olx" as PrismaP,
                tone: "casual" as PrismaT,
                condition: "nowy" as PrismaC,
                delivery: ["odbiór osobisty", "wysyłka"],
                isDefault: false,
            });

            await fetchTemplates();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Nie udało się utworzyć szablonu");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Czy na pewno chcesz usunąć ten szablon?")) {
            return;
        }

        try {
            const response = await fetch(`/api/templates/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete template");
            }

            await fetchTemplates();
        } catch (error) {
            alert("Nie udało się usunąć szablonu");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const response = await fetch(`/api/templates/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isDefault: true }),
            });

            if (!response.ok) {
                throw new Error("Failed to set default");
            }

            await fetchTemplates();
        } catch (error) {
            alert("Nie udało się ustawić domyślnego szablonu");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600 dark:text-gray-400">Ładowanie szablonów…</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Szablony</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Zapisz często używane ustawienia jako szablony
                </p>
            </div>

            {/* Create Template Form */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                    Nowy szablon
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nazwa szablonu
                        </label>
                        <Input
                            value={newTemplate.name}
                            onChange={(e) =>
                                setNewTemplate({ ...newTemplate, name: e.target.value })
                            }
                            placeholder="np. Elektronika OLX"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Platforma
                        </label>
                        <select
                            value={newTemplate.platform}
                            onChange={(e) =>
                                setNewTemplate({
                                    ...newTemplate,
                                    platform: e.target.value as PrismaP,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                        >
                            <option value="olx">OLX</option>
                            <option value="allegro_lokalnie">Allegro Lokalnie</option>
                            <option value="facebook_marketplace">Facebook Marketplace</option>
                            <option value="vinted">Vinted</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ton
                        </label>
                        <select
                            value={newTemplate.tone}
                            onChange={(e) =>
                                setNewTemplate({
                                    ...newTemplate,
                                    tone: e.target.value as PrismaT,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                        >
                            <option value="professional">Profesjonalny</option>
                            <option value="friendly">Przyjazny</option>
                            <option value="casual">Swobodny</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Stan
                        </label>
                        <select
                            value={newTemplate.condition}
                            onChange={(e) =>
                                setNewTemplate({
                                    ...newTemplate,
                                    condition: e.target.value as PrismaC,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                        >
                            <option value="nowy">Nowy</option>
                            <option value="uzywany_jak_nowy">Używany, jak nowy</option>
                            <option value="uzywany_w_dobrym_stanie">Używany, w dobrym stanie</option>
                            <option value="uzywany_w_przecietnym_stanie">Używany, w przeciętnym stanie</option>
                            <option value="uszkodzony">Uszkodzony</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <Button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Utwórz szablon
                    </Button>
                </div>
            </Card>

            {/* Templates List */}
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                    Twoje szablony ({templates.length})
                </h2>

                {templates.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Nie masz jeszcze żadnych szablonów
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <Card key={template.id} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {template.name}
                                    </h3>
                                    {template.isDefault && (
                                        <Star className="h-5 w-5 text-orange-500 fill-orange-500" />
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex gap-2">
                                        <Badge variant="outline">
                                            {PLATFORM_NAMES[template.platform]}
                                        </Badge>
                                        <Badge variant="secondary">
                                            {TONE_STYLE_NAMES[template.tone]}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Stan: {PRISMA_CONDITION_NAMES[template.condition]}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {!template.isDefault && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleSetDefault(template.id)}
                                        >
                                            <Star className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(template.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
