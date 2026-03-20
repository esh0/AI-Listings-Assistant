"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface SoldPriceDialogProps {
    open: boolean;
    defaultValue?: number;
    defaultFree?: boolean;
    title?: string;
    description?: string;
    confirmLabel?: string;
    showFree?: boolean;
    onConfirm: (price: number | null) => void;
    onCancel: () => void;
}

export function SoldPriceDialog({ open, defaultValue, defaultFree = false, title = "Oznacz jako sprzedane", description, confirmLabel = "Potwierdź sprzedaż", showFree = false, onConfirm, onCancel }: SoldPriceDialogProps) {
    const [value, setValue] = useState("");
    const [isFree, setIsFree] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setValue(defaultValue != null ? String(defaultValue) : "");
            setIsFree(defaultFree);
            setError(null);
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 50);
        }
    }, [open, defaultValue, defaultFree]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onCancel]);

    const handleSubmit = () => {
        if (showFree && isFree) { onConfirm(null); return; }
        const price = parseFloat(value.replace(",", "."));
        if (!value.trim()) { setError("Podaj cenę"); return; }
        if (isNaN(price) || price <= 0) { setError("Podaj prawidłową kwotę"); return; }
        onConfirm(price);
    };

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-card rounded-xl border border-border shadow-xl max-w-sm w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <button
                        onClick={onCancel}
                        className="ml-auto p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                        aria-label="Zamknij"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
                <div className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <input
                                ref={inputRef}
                                type="text"
                                inputMode="decimal"
                                value={value}
                                disabled={showFree && isFree}
                                onChange={(e) => { setValue(e.target.value); setError(null); }}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                                className="w-full px-3 py-2 pr-10 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">zł</span>
                        </div>
                        {showFree && (
                            <label className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={isFree}
                                    onChange={(e) => { setIsFree(e.target.checked); setError(null); }}
                                    className="accent-primary w-4 h-4"
                                />
                                Za darmo
                            </label>
                        )}
                    </div>
                    {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
                </div>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-sm font-medium transition-colors"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    , document.body);
}
