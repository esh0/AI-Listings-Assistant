"use client";

import { useState, useEffect, useRef } from "react";
import { CircleDollarSign, X } from "lucide-react";

interface SoldPriceDialogProps {
    open: boolean;
    onConfirm: (price: number) => void;
    onCancel: () => void;
}

export function SoldPriceDialog({ open, onConfirm, onCancel }: SoldPriceDialogProps) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setValue("");
            setError(null);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onCancel]);

    const handleSubmit = () => {
        const price = parseFloat(value.replace(",", "."));
        if (!value.trim()) { setError("Podaj cenę sprzedaży"); return; }
        if (isNaN(price) || price <= 0) { setError("Podaj prawidłową kwotę (np. 150 lub 149,99)"); return; }
        onConfirm(price);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-card rounded-xl border border-border shadow-xl max-w-sm w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10 shrink-0">
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold">Oznacz jako sprzedane</h3>
                    <button
                        onClick={onCancel}
                        className="ml-auto p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                        aria-label="Zamknij"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Podaj cenę sprzedaży w złotych.</p>
                <div className="mb-4">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            inputMode="decimal"
                            placeholder="np. 150 lub 149,99"
                            value={value}
                            onChange={(e) => { setValue(e.target.value); setError(null); }}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                            className="w-full px-3 py-2 pr-10 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">zł</span>
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
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors"
                    >
                        <CircleDollarSign className="h-4 w-4" />
                        Potwierdź sprzedaż
                    </button>
                </div>
            </div>
        </div>
    );
}
