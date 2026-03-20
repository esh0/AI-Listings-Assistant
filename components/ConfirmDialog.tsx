"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "destructive" | "default";
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Potwierdź",
    cancelLabel = "Anuluj",
    variant = "default",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (open) cancelRef.current?.focus();
    }, [open]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onCancel]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-card rounded-xl border border-border shadow-xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                        "p-2 rounded-full shrink-0",
                        variant === "destructive" ? "bg-destructive/10" : "bg-primary/10"
                    )}>
                        {variant === "destructive"
                            ? <AlertTriangle className="h-5 w-5 text-destructive" />
                            : <AlertTriangle className="h-5 w-5 text-primary" />
                        }
                    </div>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <button
                        onClick={onCancel}
                        className="ml-auto p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                        aria-label="Zamknij"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{description}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        ref={cancelRef}
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-sm font-medium transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            variant === "destructive"
                                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        )}
                    >
                        {variant === "destructive" && <Trash2 className="h-4 w-4" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    , document.body);
}
