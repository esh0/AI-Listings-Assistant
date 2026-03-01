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
      <CardWrapper
        title="Tytuł ogłoszenia"
        icon={Tag}
        headerAction={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyTitle}
            className={cn(
              "gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md transition-all duration-200",
              "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-orange-950 dark:hover:text-orange-400",
              copiedTitle && "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
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
        }
      >
        <p className="text-base leading-relaxed">{title}</p>
      </CardWrapper>

      {/* Description Card */}
      <CardWrapper
        title="Opis ogłoszenia"
        icon={FileText}
        headerAction={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyDescription}
            className={cn(
              "gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md transition-all duration-200",
              "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-orange-950 dark:hover:text-orange-400",
              copiedDescription && "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
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
        }
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </CardWrapper>
    </div>
  );
});
