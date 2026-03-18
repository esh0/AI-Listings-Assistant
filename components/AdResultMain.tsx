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

  // Shake state for char counters at limit
  const [shakeTitleCounter, setShakeTitleCounter] = useState(false);
  const [shakeDescCounter, setShakeDescCounter] = useState(false);
  const prevTitleLen = useRef(editedTitle.length);
  const prevDescLen = useRef(editedDescription.length);

  // Refs for auto-focus
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const copyTitleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copyDescTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(copyTitleTimerRef.current);
      clearTimeout(copyDescTimerRef.current);
    };
  }, []);

  // Shake title counter when limit hit
  useEffect(() => {
    if (editedTitle.length === titleLimit && prevTitleLen.current < titleLimit) {
      setShakeTitleCounter(true);
      const t = setTimeout(() => setShakeTitleCounter(false), 300);
      return () => clearTimeout(t);
    }
    prevTitleLen.current = editedTitle.length;
  }, [editedTitle.length, titleLimit]);

  // Shake desc counter when limit hit
  useEffect(() => {
    if (editedDescription.length === descriptionLimit && prevDescLen.current < descriptionLimit) {
      setShakeDescCounter(true);
      const t = setTimeout(() => setShakeDescCounter(false), 300);
      return () => clearTimeout(t);
    }
    prevDescLen.current = editedDescription.length;
  }, [editedDescription.length, descriptionLimit]);

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
      clearTimeout(copyTitleTimerRef.current);
      copyTitleTimerRef.current = setTimeout(() => setCopiedTitle(false), 2000);
    } catch (error) {
      console.error("Nie udało się skopiować tytułu:", error);
    }
  }, [editedTitle]);

  const handleCopyDescription = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedDescription);
      setCopiedDescription(true);
      clearTimeout(copyDescTimerRef.current);
      copyDescTimerRef.current = setTimeout(() => setCopiedDescription(false), 2000);
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
    <div className="space-y-8">
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
                "gap-2 px-3 py-1.5 rounded-md transition-colors duration-200",
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
                "gap-2 bg-muted px-3 py-1.5 rounded-md transition-colors duration-200",
                "hover:bg-primary/10 hover:text-primary",
                copiedTitle && "bg-success/10 text-success animate-copy-flash"
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
          <div className="animate-edit-enter">
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
              aria-describedby="title-error title-counter"
              aria-invalid={editedTitle.trim().length === 0}
            />
            {editedTitle.trim().length === 0 && (
              <p id="title-error" className="text-xs text-destructive mt-1">Pole nie może być puste</p>
            )}
            <p id="title-counter" className={cn(
              "text-xs mt-1",
              shakeTitleCounter && "animate-counter-shake",
              editedTitle.length > titleWarningThreshold ? "text-destructive" : "text-muted-foreground"
            )}>
              {editedTitle.length} / {titleLimit} znaków
            </p>
          </div>
        ) : (
          <p className="text-base leading-relaxed animate-edit-enter">{editedTitle}</p>
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
                "gap-2 px-3 py-1.5 rounded-md transition-colors duration-200",
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
                "gap-2 bg-muted px-3 py-1.5 rounded-md transition-colors duration-200",
                "hover:bg-primary/10 hover:text-primary",
                copiedDescription && "bg-success/10 text-success animate-copy-flash"
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
          <div className="animate-edit-enter">
            <Textarea
              ref={descInputRef}
              value={editedDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              placeholder="Wprowadź opis…"
              maxLength={descriptionLimit}
              rows={12}
              className={cn(
                "text-base resize-y max-h-[50vh] overflow-y-auto",
                editedDescription.trim().length === 0 && "border-destructive focus:border-destructive focus:ring-destructive"
              )}
              aria-label="Edytuj opis ogłoszenia"
              aria-describedby="desc-error desc-counter"
              aria-invalid={editedDescription.trim().length === 0}
            />
            {editedDescription.trim().length === 0 && (
              <p id="desc-error" className="text-xs text-destructive mt-1">Pole nie może być puste</p>
            )}
            <p id="desc-counter" className={cn(
              "text-xs mt-1",
              shakeDescCounter && "animate-counter-shake",
              editedDescription.length > descWarningThreshold ? "text-destructive" : "text-muted-foreground"
            )}>
              {editedDescription.length} / {descriptionLimit} znaków
            </p>
          </div>
        ) : (
          <p className="text-base leading-relaxed whitespace-pre-wrap animate-edit-enter">
            {editedDescription}
          </p>
        )}
      </CardWrapper>
    </div>
  );
});
