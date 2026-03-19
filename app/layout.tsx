import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { auth } from "@/auth";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://marketplace-ai.pl"),
    title: "AI Generator Ogłoszeń Sprzedażowych | OLX, Allegro, Vinted",
    description:
        "Automatycznie generuj profesjonalne ogłoszenia sprzedażowe na OLX, Allegro Lokalnie, Facebook Marketplace i Vinted. Wykorzystaj AI do analizy zdjęć i tworzenia opisów.",
    keywords: [
        "generator ogłoszeń",
        "OLX",
        "Allegro Lokalnie",
        "Facebook Marketplace",
        "Vinted",
        "AI",
        "sprzedaż online",
        "ogłoszenia",
    ],
    authors: [{ name: "Marketplace Assistant" }],
    openGraph: {
        title: "AI Generator Ogłoszeń Sprzedażowych",
        description:
            "Automatycznie generuj profesjonalne ogłoszenia sprzedażowe z pomocą AI",
        type: "website",
        locale: "pl_PL",
        images: [
            {
                url: "/og-image.svg",
                width: 1200,
                height: 630,
                alt: "Marketplace AI — Generator ogłoszeń",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Generator Ogłoszeń Sprzedażowych",
        description:
            "Automatycznie generuj profesjonalne ogłoszenia sprzedażowe z pomocą AI",
        images: ["/og-image.svg"],
    },
    icons: {
        icon: "/favicon.svg",
        shortcut: "/favicon.svg",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <html lang="pl" suppressHydrationWarning className="[color-scheme:light] dark:[color-scheme:dark]">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#0a0d14" media="(prefers-color-scheme: dark)" />
            </head>
            <body className="antialiased">
                <AuthProvider session={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Analytics />
                    </ThemeProvider>
                    <CookieBanner />
                </AuthProvider>
            </body>
        </html>
    );
}