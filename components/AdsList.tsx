"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdStatus, Platform } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { PLATFORM_NAMES } from "@/lib/types";
import {
    Search, X, Filter, ChevronLeft, ChevronRight,
    Download, Plus, CheckSquare, Square, MoreHorizontal,
    Eye, ShoppingCart, Ban, Trash2, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Ad {
    id: string;
    platform: Platform;
    title: string;
    description: string;
    status: AdStatus;
    priceMin?: number | null;
    priceMax?: number | null;
    soldPrice?: number | null;
    images: any;
    createdAt: Date;
    updatedAt: Date;
}

interface AdsListProps {
    ads: Ad[];
    counts: {
        all: number;
        drafts: number;
        published: number;
        sold: number;
        archived: number;
    };
    currentFilter: string;
    currentPage: number;
    totalPages: number;
    totalFilteredCount: number;
}

const STATUS_FILTERS = [
    { value: "all", label: "Wszystkie", countKey: "all" as const },
    { value: "draft", label: "Robocze", countKey: "drafts" as const },
    { value: "published", label: "Opublikowane", countKey: "published" as const },
    { value: "sold", label: "Sprzedane", countKey: "sold" as const },
    { value: "archived", label: "Wycofane", countKey: "archived" as const },
];

const PLATFORM_FILTERS = [
    { value: "all", label: "Wszystkie" },
    { value: "olx", label: "OLX" },
    { value: "allegro_lokalnie", label: "Allegro" },
    { value: "vinted", label: "Vinted" },
    { value: "facebook_marketplace", label: "Facebook" },
];

const STATUS_STYLES: Record<string, string> = {
    DRAFT:     "bg-muted text-muted-foreground",
    PUBLISHED: "bg-primary/10 text-primary",
    SOLD:      "bg-success/10 text-success",
    ARCHIVED:  "bg-destructive/10 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
    DRAFT:     "Robocze",
    PUBLISHED: "Opublikowane",
    SOLD:      "Sprzedane",
    ARCHIVED:  "Wycofane",
};

export function AdsList({ ads, counts, currentFilter, currentPage, totalPages, totalFilteredCount }: AdsListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const processingRef = useRef<Set<string>>(new Set());

    const currentPlatform = searchParams.get("platform") || "all";

    const updateParams = useCallback((updates: Record<string, string | null>, resetPage = true) => {
        const params = new URLSearchParams(searchParams.toString());
        if (resetPage && !("page" in updates)) params.delete("page");
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "all") params.delete(key);
            else params.set(key, value);
        });
        setSelectedIds(new Set());
        router.push(`/dashboard/ads?${params.toString()}`);
    }, [searchParams, router]);

    useEffect(() => {
        const timer = setTimeout(() => {
            updateParams({ search: searchQuery || null }, false);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, updateParams]);

    // Close dropdown menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handlePageChange = (newPage: number) => {
        updateParams({ page: newPage.toString() }, false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleToggleSelect = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const allSelected = ads.length > 0 && ads.every((ad) => selectedIds.has(ad.id));

    const handleToggleAll = () => {
        if (allSelected) setSelectedIds(new Set());
        else setSelectedIds(new Set(ads.map((ad) => ad.id)));
    };

    const handleExportSelected = useCallback(() => {
        const ids = Array.from(selectedIds).join(",");
        window.location.href = `/api/ads/export?ids=${ids}`;
    }, [selectedIds]);

    const handleDelete = async (id: string) => {
        if (!confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) return;
        if (processingRef.current.has(id)) return;
        processingRef.current.add(id);
        try {
            await fetch(`/api/ads/${id}`, { method: "DELETE" });
            router.refresh();
        } finally {
            processingRef.current.delete(id);
        }
    };

    const handleMarkAsPublished = async (id: string) => {
        if (!confirm("Oznaczyć jako opublikowane?")) return;
        if (processingRef.current.has(id)) return;
        processingRef.current.add(id);
        try {
            await fetch(`/api/ads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "PUBLISHED" }),
            });
            router.refresh();
        } finally {
            processingRef.current.delete(id);
        }
    };

    const handleMarkAsSold = async (id: string) => {
        const price = prompt("Podaj cenę sprzedaży (zł):");
        if (!price) return;
        const soldPrice = parseFloat(price);
        if (isNaN(soldPrice) || soldPrice <= 0) { alert("Nieprawidłowa cena"); return; }
        if (processingRef.current.has(id)) return;
        processingRef.current.add(id);
        try {
            await fetch(`/api/ads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "SOLD", soldPrice }),
            });
            router.refresh();
        } finally {
            processingRef.current.delete(id);
        }
    };

    const paginationPages = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);
    }, [totalPages, currentPage]);

    return (
        <div className="space-y-3">
            {/* Search + filter toggle */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Szukaj ogłoszeń…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        autoComplete="off"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFilters((v) => !v)}
                    className={cn("shrink-0 relative", (showFilters || currentFilter !== "all" || currentPlatform !== "all") && "border-primary text-primary")}
                >
                    <Filter className="h-4 w-4" />
                    {(currentFilter !== "all" || currentPlatform !== "all") && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
                    )}
                </Button>
            </div>

            {/* Filters — pill buttons */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-2"
                    >
                        {/* Status */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs text-muted-foreground mr-1">Status:</span>
                            {STATUS_FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => updateParams({ status: f.value === "all" ? null : f.value })}
                                    className={cn(
                                        "px-2.5 py-1 rounded-full text-xs transition-colors border",
                                        currentFilter === f.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                                    )}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        {/* Platforma */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs text-muted-foreground mr-1">Platforma:</span>
                            {PLATFORM_FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => updateParams({ platform: f.value === "all" ? null : f.value })}
                                    className={cn(
                                        "px-2.5 py-1 rounded-full text-xs transition-colors border",
                                        currentPlatform === f.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                                    )}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bulk actions bar */}
            <AnimatePresence>
                {selectedIds.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2 p-3 rounded-xl border border-primary/20 bg-primary/5"
                    >
                        <span className="text-sm font-medium flex-1">Zaznaczono: {selectedIds.size}</span>
                        <Button size="sm" variant="outline" onClick={handleExportSelected}>
                            <Download className="h-3.5 w-3.5 mr-1" /> CSV
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={async () => {
                                if (!confirm(`Usunąć ${selectedIds.size} ogłoszeń?`)) return;
                                for (const id of selectedIds) {
                                    await fetch(`/api/ads/${id}`, { method: "DELETE" });
                                }
                                setSelectedIds(new Set());
                                router.refresh();
                            }}
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Usuń
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Select all */}
            {ads.length > 0 && (
                <button
                    onClick={handleToggleAll}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    {allSelected
                        ? <CheckSquare className="h-3.5 w-3.5" />
                        : <Square className="h-3.5 w-3.5" />
                    }
                    {allSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
                    <span className="text-muted-foreground">({ads.length})</span>
                </button>
            )}

            {/* Listings */}
            {ads.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <p className="text-muted-foreground">
                        {currentFilter === "all" ? "Nie masz jeszcze żadnych ogłoszeń" : "Brak ogłoszeń spełniających kryteria"}
                    </p>
                </div>
            ) : (
                <div className="space-y-2" ref={menuRef}>
                    {ads.map((ad) => {
                        const isSelected = selectedIds.has(ad.id);
                        const images = Array.isArray(ad.images) ? ad.images : [];
                        const firstImage = images[0]?.url;
                        const statusStyle = STATUS_STYLES[ad.status] ?? "bg-muted text-muted-foreground";
                        const statusLabel = STATUS_LABELS[ad.status] ?? ad.status;
                        const platformLabel = PLATFORM_NAMES[ad.platform] ?? ad.platform;
                        const price = ad.soldPrice
                            ? `${ad.soldPrice} zł`
                            : ad.priceMin && ad.priceMax
                            ? `${ad.priceMin}–${ad.priceMax} zł`
                            : ad.priceMin
                            ? `${ad.priceMin} zł`
                            : null;
                        const date = new Date(ad.createdAt).toLocaleDateString("pl-PL");

                        return (
                            <div
                                key={ad.id}
                                className={cn(
                                    "rounded-xl border bg-card p-3 sm:p-4 flex items-center gap-3 hover:border-primary/30 transition-colors",
                                    isSelected ? "border-primary/40 bg-primary/5" : "border-border"
                                )}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleSelect(ad.id); }}
                                    className="shrink-0 text-muted-foreground hover:text-foreground"
                                >
                                    {isSelected
                                        ? <CheckSquare className="h-4 w-4 text-primary" />
                                        : <Square className="h-4 w-4" />
                                    }
                                </button>

                                {/* Thumbnail */}
                                <Link
                                    href={`/dashboard/ads/${ad.id}`}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted shrink-0 overflow-hidden"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                >
                                    {firstImage ? (
                                        <img src={firstImage} alt="" className="w-full h-full object-cover" width={48} height={48} loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                            —
                                        </div>
                                    )}
                                </Link>

                                {/* Content */}
                                <Link
                                    href={`/dashboard/ads/${ad.id}`}
                                    className="flex-1 min-w-0"
                                >
                                    <p className="font-medium text-sm truncate">{ad.title}</p>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                        <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", statusStyle)}>
                                            {statusLabel}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                                            {platformLabel}
                                        </span>
                                        {price && (
                                            <span className="text-[10px] text-muted-foreground">{price}</span>
                                        )}
                                        <span className="text-[10px] text-muted-foreground hidden sm:inline">{date}</span>
                                    </div>
                                </Link>

                                {/* Actions menu */}
                                <div className="relative shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === ad.id ? null : ad.id); }}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    {openMenuId === ad.id && (
                                        <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-card border border-border rounded-lg shadow-md py-1">
                                            <button
                                                onClick={() => { router.push(`/dashboard/ads/${ad.id}`); setOpenMenuId(null); }}
                                                className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-muted gap-2"
                                            >
                                                <Eye className="h-3.5 w-3.5" /> Podgląd
                                            </button>
                                            {ad.status === "DRAFT" && (
                                                <button
                                                    onClick={() => { handleMarkAsPublished(ad.id); setOpenMenuId(null); }}
                                                    className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-muted gap-2"
                                                >
                                                    <Check className="h-3.5 w-3.5" /> Opublikuj
                                                </button>
                                            )}
                                            {ad.status === "PUBLISHED" && (
                                                <>
                                                    <button
                                                        onClick={() => { handleMarkAsSold(ad.id); setOpenMenuId(null); }}
                                                        className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-muted gap-2"
                                                    >
                                                        <ShoppingCart className="h-3.5 w-3.5" /> Sprzedane
                                                    </button>
                                                    <button
                                                        onClick={() => { setOpenMenuId(null); }}
                                                        className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-muted gap-2"
                                                    >
                                                        <Ban className="h-3.5 w-3.5" /> Wycofaj
                                                    </button>
                                                </>
                                            )}
                                            <div className="border-t border-border my-1" />
                                            <button
                                                onClick={() => { handleDelete(ad.id); setOpenMenuId(null); }}
                                                className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-muted gap-2 text-destructive"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Usuń
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Poprzednia
                    </Button>
                    <div className="flex items-center gap-1">
                        {paginationPages.map((pageNum, index) => {
                            const prev = paginationPages[index - 1];
                            return (
                                <div key={pageNum} className="flex items-center gap-1">
                                    {prev && pageNum - prev > 1 && <span className="px-2 text-muted-foreground">…</span>}
                                    <Button
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNum)}
                                        className={cn("min-w-[40px]", currentPage === pageNum && "bg-primary hover:bg-primary/90")}
                                    >
                                        {pageNum}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Następna <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* FAB */}
            <Link
                href="/dashboard/new"
                className="fixed bottom-20 right-6 z-50 sm:bottom-20 sm:right-8 flex items-center gap-1.5 bg-gradient-primary text-primary-foreground font-semibold px-5 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity text-sm"
            >
                <Plus className="h-4 w-4" />
                Nowe ogłoszenie
            </Link>
        </div>
    );
}
