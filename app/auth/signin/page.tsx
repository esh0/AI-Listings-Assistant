"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function getSafeCallbackUrl(raw: string | null): string {
    if (!raw) return "/dashboard";
    if (raw.startsWith("/") && !raw.startsWith("//")) {
        return raw;
    }
    return "/dashboard";
}

function SignInForm() {
    const searchParams = useSearchParams();
    const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        await signIn("google", { callbackUrl });
    };

    const handleFacebookSignIn = async () => {
        await signIn("facebook", { callbackUrl });
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailLoading(true);
        try {
            await signIn("resend", { email, callbackUrl, redirect: false });
            setEmailSent(true);
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <Card className="max-w-md w-full p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                    <ShoppingBag className="h-12 w-12 text-primary" aria-hidden="true" />
                </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Marketplace <span className="font-serif italic text-primary">AI</span>
                </h1>
                <p className="text-muted-foreground">
                    Zaloguj się, aby zarządzać swoimi ogłoszeniami
                </p>
            </div>

            {/* OAuth buttons */}
            <div className="space-y-3">
                <Button
                    onClick={handleGoogleSignIn}
                    className="w-full h-12 bg-card hover:bg-muted text-foreground border border-input"
                >
                    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Kontynuuj z Google
                </Button>

                <Button
                    onClick={handleFacebookSignIn}
                    className="w-full h-12 bg-card hover:bg-muted text-foreground border border-input"
                >
                    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Kontynuuj z Facebook
                </Button>
            </div>

            {/* Separator */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">lub</span>
                </div>
            </div>

            {/* Email magic link */}
            {emailSent ? (
                <div className="text-center space-y-2 py-4">
                    <p className="font-medium text-foreground">Sprawdź skrzynkę pocztową</p>
                    <p className="text-sm text-muted-foreground">
                        Wysłaliśmy link do: <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Link jest ważny 24 godziny. Nie widzisz wiadomości? Sprawdź folder spam.
                    </p>
                    <button
                        type="button"
                        onClick={() => { setEmailSent(false); setEmail(""); }}
                        className="text-sm text-primary hover:underline mt-2 focus:outline-none focus:ring-2 focus:ring-ring rounded"
                    >
                        Podaj inny adres email
                    </button>
                </div>
            ) : (
                <form onSubmit={handleEmailSignIn} className="space-y-3">
                    <input
                        type="email"
                        required
                        autoComplete="email"
                        aria-label="Adres email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="twoj@email.pl"
                        className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button
                        type="submit"
                        disabled={emailLoading}
                        className="w-full h-12 bg-card hover:bg-muted text-foreground border border-input"
                    >
                        {emailLoading ? "Wysyłanie..." : "Wyślij link logowania"}
                    </Button>
                </form>
            )}

            {/* Privacy */}
            <p className="text-xs text-muted-foreground text-center mt-6">
                Logując się, akceptujesz naszą politykę prywatności.
                <br />
                Nie wysyłamy spamu i nie udostępniamy Twoich danych.
            </p>

            {/* Back to home */}
            <div className="text-center mt-8">
                <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-primary"
                >
                    ← Wróć do strony głównej
                </Link>
            </div>
        </Card>
    );
}

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <Suspense fallback={<div>Ładowanie…</div>}>
                <SignInForm />
            </Suspense>
        </div>
    );
}
