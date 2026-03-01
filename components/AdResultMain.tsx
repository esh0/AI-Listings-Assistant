"use client";

import React, { useState, useCallback } from "react";
import { Copy, Check, Tag, FileText } from "lucide-react";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdResultMainProps {
  title: string;
  description: string;
}

export const AdResultMain = React.memo(function AdResultMain({
  title,
  description,
}: AdResultMainProps) {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);

  const handleCopyTitle = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } catch (error) {
      console.error("Nie udało się skopiować tytułu:", error);
    }
  }, [title]);

  const handleCopyDescription = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(description);
      setCopiedDescription(true);
      setTimeout(() => setCopiedDescription(false), 2000);
    } catch (error) {
      console.error("Nie udało się skopiować opisu:", error);
    }
  }, [description]);

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <CardWrapper title="Tytuł ogłoszenia" icon={Tag}>
        <div className="space-y-3 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyTitle}
            className={cn(
              "absolute top-0 right-0 gap-2 transition-all duration-200",
              copiedTitle && "text-green-600"
            )}
          >
            {copiedTitle ? (
              <>
                <Check className="h-4 w-4" />
                Skopiowano!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Kopiuj
              </>
            )}
          </Button>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Wygenerowany tytuł
          </p>
          <p className="text-lg font-semibold leading-relaxed pr-24">{title}</p>
        </div>
      </CardWrapper>

      {/* Description Card */}
      <CardWrapper title="Opis ogłoszenia" icon={FileText}>
        <div className="space-y-3 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyDescription}
            className={cn(
              "absolute top-0 right-0 gap-2 transition-all duration-200",
              copiedDescription && "text-green-600"
            )}
          >
            {copiedDescription ? (
              <>
                <Check className="h-4 w-4" />
                Skopiowano!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Kopiuj
              </>
            )}
          </Button>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Wygenerowany opis
          </p>
          <p className="text-base leading-relaxed whitespace-pre-wrap pr-24">
            {description}
          </p>
        </div>
      </CardWrapper>
    </div>
  );
});
