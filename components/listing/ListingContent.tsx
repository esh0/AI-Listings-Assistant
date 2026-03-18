"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Copy, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLATFORM_NAMES, PLATFORM_META, type Platform } from "@/lib/types";
import type { AdStatus } from "@prisma/client";

const STATUS_MAP: Record<AdStatus, { label: string; className: string }> = {
    DRAFT: { label: "Robocze", className: "bg-muted text-muted-foreground" },
    PUBLISHED: { label: "Opublikowane", className: "bg-primary/10 text-primary" },
    SOLD: { label: "Sprzedane", className: "bg-success/10 text-success" },
    ARCHIVED: { label: "Wycofane", className: "bg-muted text-muted-foreground" },
};

// Platform-specific limits (title + description)
const PLATFORM_LIMITS: Record<Platform, { title: number; description: number }> = {
    olx: { title: 70, description: 9000 },
    allegro_lokalnie: { title: 75, description: 16000 },
    facebook_marketplace: { title: 60, description: 5000 },
    vinted: { title: 100, description: 5000 },
};

interface ListingContentProps {
    id: string;
    platform: Platform;
    status: AdStatus;
    createdAt: Date;
    title: string;
    description: string;
    editing: boolean;
    firstImage?: string;
    onTitleChange: (v: string) => void;
    onDescriptionChange: (v: string) => void;
    isGuest?: boolean;
}

export function ListingContent({
    platform,
    status,
    createdAt,
    title,
    description,
    editing,
    firstImage,
    onTitleChange,
    onDescriptionChange,
    isGuest = false,
}: ListingContentProps) {
    const [copiedTitle, setCopiedTitle] = useState(false);
    const [copiedDesc, setCopiedDesc] = useState(false);
    const copyTitleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const copyDescTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const descRef = useRef<HTMLTextAreaElement>(null);

    const limits = PLATFORM_LIMITS[platform] ?? { title: 70, description: 5000 };
    const titleLimit = limits.title;
    const descLimit = limits.description;

    const titlePercent = Math.min((title.length / titleLimit) * 100, 100);
    const descPercent = Math.min((description.length / descLimit) * 100, 100);

    const statusInfo = STATUS_MAP[status];
    const platformMeta = PLATFORM_META[platform];

    useEffect(() => {
        return () => {
            clearTimeout(copyTitleTimer.current);
            clearTimeout(copyDescTimer.current);
        };
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        const el = descRef.current;
        if (el && editing) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    }, [description, editing]);

    const handleCopyTitle = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(title);
            setCopiedTitle(true);
            clearTimeout(copyTitleTimer.current);
            copyTitleTimer.current = setTimeout(() => setCopiedTitle(false), 2000);
        } catch {}
    }, [title]);

    const handleCopyDesc = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(description);
            setCopiedDesc(true);
            clearTimeout(copyDescTimer.current);
            copyDescTimer.current = setTimeout(() => setCopiedDesc(false), 2000);
        } catch {}
    }, [description]);

    return (
        <div className="lg:col-span-3 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4">
                {/* Header: first image thumbnail + badges + date */}
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        {firstImage ? (
                            <img
                                src={firstImage}
                                alt=""
                                className="w-full h-full object-cover"
                                width={56}
                                height={56}
                            />
                        ) : (
                            <span className={cn("block w-5 h-5 rounded-full opacity-50", platformMeta?.color.replace("text-", "bg-"))} />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                {PLATFORM_NAMES[platform]}
                            </span>
                            {!isGuest && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-md text-xs font-medium",
                                    statusInfo.className
                                )}>
                                    {statusInfo.label}
                                </span>
                            )}
                        </div>
                        {!isGuest && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(createdAt).toLocaleDateString("pl-PL")}
                            </p>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted-foreground uppercase tracking-wider">
                            Tytuł
                        </label>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCopyTitle}>
                            {copiedTitle ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                            {copiedTitle ? "Skopiowano" : "Kopiuj tytuł"}
                        </Button>
                    </div>
                    {editing ? (
                        <>
                            <input
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                                maxLength={titleLimit}
                                className="w-full bg-transparent text-base sm:text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-2 py-1 border border-border"
                            />
                            <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
                                <span className={titlePercent > 90 ? "text-destructive" : ""}>
                                    {title.length} / {titleLimit} znaków
                                </span>
                                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            titlePercent > 90 ? "bg-destructive" : titlePercent > 70 ? "bg-warning" : "bg-success"
                                        )}
                                        style={{ width: `${titlePercent}%` }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-base sm:text-lg font-semibold break-words">{title}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted-foreground uppercase tracking-wider">
                            Opis
                        </label>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCopyDesc}>
                            {copiedDesc ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                            {copiedDesc ? "Skopiowano" : "Kopiuj opis"}
                        </Button>
                    </div>
                    {editing ? (
                        <>
                            <textarea
                                ref={descRef}
                                value={description}
                                onChange={(e) => onDescriptionChange(e.target.value)}
                                maxLength={descLimit}
                                rows={12}
                                className="w-full bg-transparent text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary/30 rounded px-2 py-1 resize-none border border-border"
                            />
                            <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
                                <span className={descPercent > 90 ? "text-destructive" : ""}>
                                    {description.length} / {descLimit} znaków
                                </span>
                                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            descPercent > 90 ? "bg-destructive" : descPercent > 70 ? "bg-warning" : "bg-success"
                                        )}
                                        style={{ width: `${descPercent}%` }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground break-words">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
