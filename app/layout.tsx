import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin", "latin-ext"],
    variable: "--font-sans",
    display: "swap",
    preload: true,
    fallback: ['system-ui', 'arial'],
});

const instrumentSerif = Instrument_Serif({
    weight: "400",
    subsets: ["latin", "latin-ext"],
    variable: "--font-serif",
    display: "swap",
    preload: true,
    fallback: ['Georgia', 'serif'],
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
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
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Generator Ogłoszeń Sprzedażowych",
        description:
            "Automatycznie generuj profesjonalne ogłoszenia sprzedażowe z pomocą AI",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl" suppressHydrationWarning className="[color-scheme:light] dark:[color-scheme:dark]">
            <head>
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#0a0d14" media="(prefers-color-scheme: dark)" />
            </head>
            <body className={`${spaceGrotesk.variable} ${instrumentSerif.variable} font-sans antialiased`}>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}