import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { auth } from "@/auth";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import Script from "next/script";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://www.marketplace-ai.pl"),
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
    alternates: {
        canonical: "https://www.marketplace-ai.pl",
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
                {/* Google tag — musi być przed gtag('config',...) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=AW-18063893093"
                    strategy="afterInteractive"
                />
                <Script id="gtag-init" strategy="afterInteractive">{`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('consent', 'default', {
                    analytics_storage: 'denied',
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    wait_for_update: 500
                  });
                  gtag('config', 'AW-18063893093');
                  gtag('config', 'G-NER153CSFW');
                `}</Script>
            </head>
            <body className="antialiased overflow-x-hidden">
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
                    <Toaster richColors position="top-right" />
                    <CookieBanner />
                </AuthProvider>
            </body>
        </html>
    );
}