"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  hasConsentDecision,
  hasAnalyticsConsent,
  setAnalyticsConsent,
  initGA4,
} from "@/lib/analytics";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsentDecision()) {
      // First visit — show the banner
      setVisible(true);
    } else if (hasAnalyticsConsent()) {
      // Returning visitor who already accepted — re-initialise GA4
      initGA4();
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setVisible(false);
  };

  const handleReject = () => {
    setAnalyticsConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Informacja o plikach cookie"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-border bg-card shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-sm text-muted-foreground min-w-0">
          Używamy plików cookie do analizy ruchu (Google Analytics), aby lepiej rozumieć, jak korzystasz z Serwisu i ulepszać nasz produkt.{" "}
          <Link
            href="/polityka-prywatnosci"
            className="underline text-foreground hover:text-primary transition-colors"
          >
            Polityka prywatności
          </Link>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Tylko niezbędne
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}
