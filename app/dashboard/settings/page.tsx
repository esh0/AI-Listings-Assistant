"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function SettingsPage() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            const res = await fetch("/api/user/delete", { method: "DELETE" });
            if (!res.ok) throw new Error("Błąd serwera");
            await signOut({ callbackUrl: "/" });
        } catch {
            setError("Nie udało się usunąć konta. Spróbuj ponownie lub skontaktuj się z pomocą techniczną.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Ustawienia konta</h1>

            {/* Strefa niebezpieczna */}
            <div className="rounded-xl border border-destructive/30 bg-card overflow-hidden">
                <div className="p-5 border-b border-destructive/20 bg-destructive/5">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                        <h2 className="text-base font-semibold text-destructive">Strefa niebezpieczna</h2>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="font-medium mb-2">Usuń konto</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Usunięcie konta jest nieodwracalne. Zostaną usunięte wszystkie Twoje ogłoszenia, zdjęcia, szablony i historia aktywności. Aktywna subskrypcja zostanie anulowana.
                    </p>
                    {error && (
                        <p className="text-sm text-destructive mb-3">{error}</p>
                    )}
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-medium transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Usuń konto
                    </button>
                </div>
            </div>

            {/* Modal potwierdzenia */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-card rounded-xl border border-border shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full bg-destructive/10">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <h3 className="text-lg font-semibold">Usuń konto?</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Ta operacja jest nieodwracalna. Wszystkie dane zostaną trwale usunięte: ogłoszenia, zdjęcia, szablony, historia aktywności i aktywna subskrypcja.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isDeleting ? "Usuwanie…" : "Tak, usuń konto"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
