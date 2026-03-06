"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Check, Tag, FileText, Pencil, X } from "lucide-react";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AdResultMainProps {
  title: string;
  description: string;
  editedTitle: string;
  editedDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const AdResultMain = React.memo(function AdResultMain({
  title,
  description,
  editedTitle,
  editedDescription,
  onTitleChange,
  onDescriptionChange,
}: AdResultMainProps) {
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
                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950 dark:hover:text-orange-400"
              )}
              title={isEditingTitle ? "Anuluj edycję" : "Edytuj"}
            >
              {isEditingTitle ? (
                <X className="h-4 w-4" />
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
              maxLength={200}
              className={cn(
                "text-base",
                editedTitle.trim().length === 0 && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              aria-label="Edytuj tytuł ogłoszenia"
            />
            {editedTitle.trim().length === 0 && (
              <p className="text-xs text-red-600 mt-1">Pole nie może być puste</p>
            )}
            <p className={cn(
              "text-xs mt-1",
              editedTitle.length > 180 ? "text-red-600" : "text-gray-500 dark:text-gray-400"
            )}>
              {editedTitle.length} / 200 znaków
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
                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950 dark:hover:text-orange-400"
              )}
              title={isEditingDescription ? "Anuluj edycję" : "Edytuj"}
            >
              {isEditingDescription ? (
                <X className="h-4 w-4" />
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
              maxLength={5000}
              rows={12}
              className={cn(
                "text-base resize-y",
                editedDescription.trim().length === 0 && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              aria-label="Edytuj opis ogłoszenia"
            />
            {editedDescription.trim().length === 0 && (
              <p className="text-xs text-red-600 mt-1">Pole nie może być puste</p>
            )}
            <p className={cn(
              "text-xs mt-1",
              editedDescription.length > 4500 ? "text-red-600" : "text-gray-500 dark:text-gray-400"
            )}>
              {editedDescription.length} / 5000 znaków
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
