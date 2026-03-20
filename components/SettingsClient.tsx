"use client";

import { useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle, Trash2, User, CreditCard, Crown, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const PLAN_LABELS: Record<string, string> = {
    FREE: "Free",
    STARTER: "Starter",
    RESELER: "Reseler",
};

const PLAN_DESCRIPTIONS: Record<string, string> = {
    FREE: "5 kredytów / miesiąc · 3 zdjęcia",
    STARTER: "30 kredytów / miesiąc · 5 zdjęć",
    RESELER: "80 kredytów / miesiąc · 8 zdjęć · style premium",
};

interface SettingsClientProps {
    name: string | null | undefined;
    email: string | null | undefined;
    plan: "FREE" | "STARTER" | "RESELER";
}

export function SettingsClient({ name, email, plan }: SettingsClientProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isPortalLoading, setIsPortalLoading] = useState(false);
    const isPaid = plan !== "FREE";

    const handlePortal = useCallback(async () => {
        setIsPortalLoading(true);
        try {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch {
            toast.error("Nie udało się otworzyć panelu subskrypcji. Spróbuj ponownie.");
        } finally {
            setIsPortalLoading(false);
        }
    }, []);

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const res = await fetch("/api/user/delete", { method: "DELETE" });
            if (!res.ok) throw new Error("Błąd serwera");
            await signOut({ callbackUrl: "/" });
        } catch {
            setDeleteError("Nie udało się usunąć konta. Spróbuj ponownie lub skontaktuj się z pomocą techniczną.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Konto */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground shrink-0" />
                        <h2 className="text-base font-semibold">Informacje o koncie</h2>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                        <span className="text-muted-foreground">Imię i nazwisko</span>
                        <span className="font-medium">{name || "—"}</span>
                        <span className="text-muted-foreground">Adres e-mail</span>
                        <span className="font-medium">{email || "—"}</span>
                        <span className="text-muted-foreground">Logowanie</span>
                        <span className="font-medium">Google</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Dane konta są zsynchronizowane z Google i nie można ich zmienić w aplikacji.
                    </p>
                </div>
            </div>

            {/* Subskrypcja */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                        <h2 className="text-base font-semibold">Subskrypcja</h2>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            {plan === "RESELER" && <Crown className="h-4 w-4 text-violet-500" />}
                            <span className="font-semibold text-sm">{PLAN_LABELS[plan]}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{PLAN_DESCRIPTIONS[plan]}</span>
                    </div>
                    {isPaid ? (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Możesz zmienić plan, metodę płatności lub anulować subskrypcję w panelu Stripe.
                            </p>
                            <button
                                onClick={handlePortal}
                                disabled={isPortalLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <ExternalLink className="h-4 w-4" />
                                {isPortalLoading ? "Przekierowuję…" : "Zarządzaj subskrypcją"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Jesteś na planie bezpłatnym. Przejdź na wyższy plan, aby uzyskać więcej kredytów i funkcji.
                            </p>
                            <a
                                href="/dashboard/pricing"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
                            >
                                Zmień plan →
                            </a>
                        </div>
                    )}
                </div>
            </div>

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
                    {deleteError && (
                        <p className="text-sm text-destructive mb-3">{deleteError}</p>
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
