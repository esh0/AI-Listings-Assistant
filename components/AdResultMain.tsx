"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Check, Tag, FileText, Pencil } from "lucide-react";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/types";

// Platform-specific character limits based on lib/rules/*.md
const PLATFORM_LIMITS = {
  olx: { title: 70, description: 1500 },
  allegro_lokalnie: { title: 75, description: 1500 },
  facebook_marketplace: { title: 60, description: 1000 },
  vinted: { title: 100, description: 750 },
} as const;

interface AdResultMainProps {
  title: string;
  description: string;
  editedTitle: string;
  editedDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  platform: Platform;
}

export const AdResultMain = React.memo(function AdResultMain({
  title,
  description,
  editedTitle,
  editedDescription,
  onTitleChange,
  onDescriptionChange,
  platform,
}: AdResultMainProps) {
  // Get platform-specific limits
  const titleLimit = PLATFORM_LIMITS[platform].title;
  const descriptionLimit = PLATFORM_LIMITS[platform].description;
  const titleWarningThreshold = Math.floor(titleLimit * 0.9);
  const descWarningThreshold = Math.floor(descriptionLimit * 0.9);
  // Copy state
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);

  // Edit mode state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Refs for auto-focus
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  // Title edit handlers
  const handleEditTitle = useCallback(() => {
    setIsEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  }, []);

  const handleCancelEditTitle = useCallback(() => {
    setIsEditingTitle(false);
  }, []);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEditTitle();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCancelEditTitle();
    }
  }, [handleCancelEditTitle]);

  const handleCopyTitle = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedTitle);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } catch (error) {
      console.error("Nie udało się skopiować tytułu:", error);
    }
  }, [editedTitle]);

  const handleCopyDescription = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedDescription);
      setCopiedDescription(true);
      setTimeout(() => setCopiedDescription(false), 2000);
    } catch (error) {
      console.error("Nie udało się skopiować opisu:", error);
    }
  }, [editedDescription]);

  // Description edit handlers
  const handleEditDescription = useCallback(() => {
    setIsEditingDescription(true);
    setTimeout(() => descInputRef.current?.focus(), 0);
  }, []);

  const handleCancelEditDescription = useCallback(() => {
    setIsEditingDescription(false);
  }, []);

  const handleDescriptionKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEditDescription();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCancelEditDescription();
    }
  }, [handleCancelEditDescription]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = descInputRef.current;
    if (textarea && isEditingDescription) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [editedDescription, isEditingDescription]);

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <CardWrapper
        title="Tytuł ogłoszenia"
        icon={Tag}
        headerAction={
          <div className="flex items-center gap-2">
            {/* Edit/Cancel button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={isEditingTitle ? handleCancelEditTitle : handleEditTitle}
              className={cn(
                "gap-2 px-3 py-1.5 rounded-md transition-all duration-200",
                isEditingTitle
                  ? "bg-success/10 text-success hover:bg-success/20"
                  : "bg-muted hover:bg-primary/10 hover:text-primary"
              )}
              title={isEditingTitle ? "Zatwierdź zmiany" : "Edytuj"}
            >
              {isEditingTitle ? (
                <Check className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>

            {/* Copy button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyTitle}
              className={cn(
                "gap-2 bg-muted px-3 py-1.5 rounded-md transition-all duration-200",
                "hover:bg-primary/10 hover:text-primary",
                copiedTitle && "bg-success/10 text-success"
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
          </div>
        }
      >
        {isEditingTitle ? (
          <div>
            <Input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="Wprowadź tytuł…"
              maxLength={titleLimit}
              className={cn(
                "text-base",
                editedTitle.trim().length === 0 && "border-destructive focus:border-destructive focus:ring-destructive"
              )}
              aria-label="Edytuj tytuł ogłoszenia"
            />
            {editedTitle.trim().length === 0 && (
              <p className="text-xs text-destructive mt-1">Pole nie może być puste</p>
            )}
            <p className={cn(
              "text-xs mt-1",
              editedTitle.length > titleWarningThreshold ? "text-destructive" : "text-muted-foreground"
            )}>
              {editedTitle.length} / {titleLimit} znaków
            </p>
          </div>
        ) : (
          <p className="text-base leading-relaxed">{editedTitle}</p>
        )}
      </CardWrapper>

      {/* Description Card */}
      <CardWrapper
        title="Opis ogłoszenia"
        icon={FileText}
        headerAction={
          <div className="flex items-center gap-2">
            {/* Edit/Cancel button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={isEditingDescription ? handleCancelEditDescription : handleEditDescription}
              className={cn(
                "gap-2 px-3 py-1.5 rounded-md transition-all duration-200",
                isEditingDescription
                  ? "bg-success/10 text-success hover:bg-success/20"
                  : "bg-muted hover:bg-primary/10 hover:text-primary"
              )}
              title={isEditingDescription ? "Zatwierdź zmiany" : "Edytuj"}
            >
              {isEditingDescription ? (
                <Check className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>

            {/* Copy button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyDescription}
              className={cn(
                "gap-2 bg-muted px-3 py-1.5 rounded-md transition-all duration-200",
                "hover:bg-primary/10 hover:text-primary",
                copiedDescription && "bg-success/10 text-success"
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
          </div>
        }
      >
        {isEditingDescription ? (
          <div>
            <Textarea
              ref={descInputRef}
              value={editedDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              placeholder="Wprowadź opis…"
              maxLength={descriptionLimit}
              rows={12}
              className={cn(
                "text-base resize-y",
                editedDescription.trim().length === 0 && "border-destructive focus:border-destructive focus:ring-destructive"
              )}
              aria-label="Edytuj opis ogłoszenia"
            />
            {editedDescription.trim().length === 0 && (
              <p className="text-xs text-destructive mt-1">Pole nie może być puste</p>
            )}
            <p className={cn(
              "text-xs mt-1",
              editedDescription.length > descWarningThreshold ? "text-destructive" : "text-muted-foreground"
            )}>
              {editedDescription.length} / {descriptionLimit} znaków
            </p>
          </div>
        ) : (
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {editedDescription}
          </p>
        )}
      </CardWrapper>
    </div>
  );
});
