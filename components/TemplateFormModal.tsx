"use client";

import { useState, useRef, useCallback } from "react";
import { X, ShoppingBag, Store, Facebook, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TEMPLATE_PLACEHOLDERS } from "@/lib/template-placeholders";
import {
    PLATFORM_NAMES,
    TONE_STYLE_NAMES,
    DELIVERY_NAMES,
    CONDITION_NAMES,
    FREE_TONES,
    ADVANCED_TONES,
} from "@/lib/types";
import type { Platform, ToneStyle, DeliveryOption, ProductCondition } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Template } from "@/components/TemplatesList";

const PLATFORM_ICONS = {
    olx: { Icon: ShoppingBag, color: "text-orange-500" },
    allegro_lokalnie: { Icon: Store, color: "text-green-600" },
    facebook_marketplace: { Icon: Facebook, color: "text-blue-600" },
    vinted: { Icon: Shirt, color: "text-teal-600" },
} as const;

interface Props {
    template: Template | null;
    onClose: (saved: boolean) => void;
}

export function TemplateFormModal({ template, onClose }: Props) {
    const isEdit = !!template;
    const [name, setName] = useState(template?.name ?? "");
    const [platform, setPlatform] = useState<Platform>(template?.platform ?? "olx");
    const [tone, setTone] = useState<ToneStyle>(template?.tone ?? "friendly");
    const [condition, setCondition] = useState<ProductCondition>(template?.condition ?? "używany, w dobrym stanie");
    const [delivery, setDelivery] = useState<DeliveryOption[]>(
        template?.delivery ?? ["odbiór osobisty", "wysyłka"]
    );
    const [bodyTemplate, setBodyTemplate] = useState(template?.bodyTemplate ?? "");
    const [notes, setNotes] = useState(template?.notes ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertPlaceholder = useCallback((key: string) => {
        const ta = textareaRef.current;
        const start = ta?.selectionStart ?? null;
        const end = ta?.selectionEnd ?? null;
        setBodyTemplate((prev) => {
            const s = start ?? prev.length;
            const e = end ?? prev.length;
            return prev.slice(0, s) + key + prev.slice(e);
        });
        if (ta) {
            requestAnimationFrame(() => {
                ta.focus();
                const pos = (start ?? 0) + key.length;
                ta.setSelectionRange(pos, pos);
            });
        }
    }, []); // no dependencies - uses functional setState and ref

    const toggleDelivery = useCallback((option: DeliveryOption) => {
        setDelivery((prev) => {
            if (prev.includes(option)) {
                if (prev.length > 1) return prev.filter((d) => d !== option);
                return prev;
            }
            return [...prev, option];
        });
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!name.trim()) {
            setError("Podaj nazwę szablonu");
            return;
        }
        if (delivery.length === 0) {
            setError("Wybierz przynajmniej jedną opcję dostawy");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const url = isEdit ? `/api/templates/${template!.id}` : "/api/templates";
            const method = isEdit ? "PATCH" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    platform,
                    tone,
                    condition,
                    delivery,
                    bodyTemplate: bodyTemplate || undefined,
                    notes: notes || undefined,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Błąd podczas zapisywania szablonu");
                return;
            }
            onClose(true);
        } catch {
            setError("Błąd połączenia. Spróbuj ponownie.");
        } finally {
            setIsSubmitting(false);
        }
    }, [name, platform, tone, delivery, bodyTemplate, notes, isEdit, template, onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={(e) => e.target === e.currentTarget && onClose(false)}
        >
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="font-bold text-lg">
                        {isEdit ? "Edytuj szablon" : "Nowy szablon"}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onClose(false)}
                        aria-label="Zamknij"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                            {error}
                        </p>
                    )}

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Nazwa szablonu <span className="text-destructive">*</span>
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="np. Elektronika — Allegro"
                            maxLength={100}
                        />
                    </div>

                    {/* Platform tiles */}
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium">Platforma sprzedażowa</legend>
                        <div className="grid grid-cols-2 gap-3">
                            {(Object.entries(PLATFORM_NAMES) as [Platform, string][]).map(
                                ([p, label]) => {
                                    const { Icon, color } = PLATFORM_ICONS[p];
                                    const isSelected = platform === p;
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            onClick={() => setPlatform(p)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left text-sm",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                isSelected
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/30"
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    "h-5 w-5",
                                                    isSelected ? "text-primary" : color
                                                )}
                                                aria-hidden="true"
                                            />
                                            <span className="font-medium">{label}</span>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </fieldset>

                    {/* Tone pills */}
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium">Styl komunikacji</legend>
                        <div className="flex gap-2 flex-wrap">
                            {([...FREE_TONES, ...ADVANCED_TONES] as ToneStyle[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    role="radio"
                                    aria-checked={tone === t}
                                    onClick={() => setTone(t)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        tone === t
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border text-muted-foreground hover:border-primary/50"
                                    )}
                                >
                                    {TONE_STYLE_NAMES[t]}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    {/* Condition pills */}
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium">Stan produktu</legend>
                        <div className="flex gap-2 flex-wrap">
                            {(Object.entries(CONDITION_NAMES) as [ProductCondition, string][]).map(([c, label]) => (
                                <button
                                    key={c}
                                    type="button"
                                    role="radio"
                                    aria-checked={condition === c}
                                    onClick={() => setCondition(c)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full border text-sm cursor-pointer transition-all",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        condition === c
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border text-muted-foreground hover:border-primary/50"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    {/* Delivery */}
                    <fieldset className="space-y-2">
                        <legend className="text-sm font-medium">Sposób dostawy</legend>
                        <div className="flex flex-wrap gap-4">
                            {(Object.entries(DELIVERY_NAMES) as [DeliveryOption, string][]).map(
                                ([value, label]) => (
                                    <label
                                        key={value}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={delivery.includes(value)}
                                            onChange={() => toggleDelivery(value)}
                                            className="h-4 w-4 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                        <span className="text-sm">{label}</span>
                                    </label>
                                )
                            )}
                        </div>
                    </fieldset>

                    {/* Notatki domyślne */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Domyślne notatki <span className="text-muted-foreground text-xs">(opcjonalne)</span></label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="np. Paragon w zestawie, oryginalne opakowanie"
                            rows={3}
                            maxLength={1000}
                            className="resize-none"
                        />
                    </div>

                    {/* Body template textarea + placeholder insert buttons */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Szkielet opisu{" "}
                            <span className="text-muted-foreground text-xs">(opcjonalne)</span>
                        </label>
                        <Textarea
                            ref={textareaRef}
                            value={bodyTemplate}
                            onChange={(e) => setBodyTemplate(e.target.value)}
                            placeholder="np. Sprzedam {{nazwa}}. Stan: {{stan}}. Dostawa: {{sposób_wysyłki}}."
                            rows={6}
                            maxLength={3000}
                            className="font-mono text-sm resize-none"
                        />
                        <div className="flex flex-wrap gap-1.5">
                            {TEMPLATE_PLACEHOLDERS.map((p) => (
                                <button
                                    key={p.key}
                                    type="button"
                                    onClick={() => insertPlaceholder(p.key)}
                                    title={p.description}
                                    className="px-2 py-1 text-xs rounded-md bg-muted border border-border hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all font-mono"
                                >
                                    + {p.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {bodyTemplate.length}/3000 znaków
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                    <Button
                        variant="outline"
                        onClick={() => onClose(false)}
                        disabled={isSubmitting}
                    >
                        Anuluj
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting
                            ? "Zapisywanie\u2026"
                            : isEdit
                            ? "Zapisz zmiany"
                            : "Utwórz szablon"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
