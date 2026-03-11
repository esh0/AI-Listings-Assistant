"use client";

import { AdCard } from "@/components/AdCard";
import { Button } from "@/components/ui/button";
import { AdStatus, Platform } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { PLATFORM_NAMES } from "@/lib/types";
import { ArrowUpDown, Check, ChevronDown, Search, X, ChevronLeft, ChevronRight, Download, SlidersHorizontal, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
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
];

const PLATFORM_FILTERS = [
    { value: "all", label: "Wszystkie platformy" },
    { value: "olx", label: PLATFORM_NAMES.olx },
    { value: "allegro_lokalnie", label: PLATFORM_NAMES.allegro_lokalnie },
    { value: "facebook_marketplace", label: PLATFORM_NAMES.facebook_marketplace },
    { value: "vinted", label: PLATFORM_NAMES.vinted },
];

const SORT_OPTIONS = [
    { value: "createdAt-desc", label: "Najnowsze" },
    { value: "createdAt-asc", label: "Najstarsze" },
    { value: "updatedAt-desc", label: "Ostatnio edytowane" },
    { value: "updatedAt-asc", label: "Dawno edytowane" },
    { value: "title-asc", label: "Tytuł A-Z" },
    { value: "title-desc", label: "Tytuł Z-A" },
];

export function AdsList({ ads, counts, currentFilter, currentPage, totalPages, totalFilteredCount }: AdsListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [statusOpen, setStatusOpen] = useState(false);
    const [platformOpen, setPlatformOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const processingRef = useRef<Set<string>>(new Set());
    const statusRef = useRef<HTMLDivElement>(null);
    const platformRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    const currentPlatform = searchParams.get("platform") || "all";
    const currentSort = searchParams.get("sort") || "createdAt-desc";

    const updateParams = useCallback((updates: Record<string, string | null>, resetPage = true) => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset to page 1 when filters change (unless explicitly updating page)
        if (resetPage && !("page" in updates)) {
            params.delete("page");
        }

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "all") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        setSelectedIds(new Set());
        router.push(`/dashboard/ads?${params.toString()}`);
    }, [searchParams, router]);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            updateParams({ search: searchQuery || null }, false);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchQuery, updateParams]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
            if (platformRef.current && !platformRef.current.contains(e.target as Node)) setPlatformOpen(false);
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Lock body scroll when mobile drawer open
    useEffect(() => {
        if (mobileFiltersOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileFiltersOpen]);

    const handleStatusChange = (status: string) => {
        updateParams({ status: status === "all" ? null : status });
    };

    const handlePlatformChange = (platform: string) => {
        updateParams({ platform: platform === "all" ? null : platform });
    };

    const handleSortChange = (sort: string) => {
        updateParams({ sort });
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handlePageChange = (newPage: number) => {
        updateParams({ page: newPage.toString() }, false);
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    const handleView = (id: string) => {
        router.push(`/dashboard/ads/${id}`);
    };

    const handleEdit = (id: string) => {
        alert("Funkcja edycji zostanie dodana w przyszłości");
    };

    const handleDelete = async (id: string) => {
        if (processingRef.current.has(id)) return;
        processingRef.current.add(id);
        setDeletingId(id);
        try {
            const response = await fetch(`/api/ads/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete ad");
            }

            router.refresh();
        } catch (error) {
            console.error("Failed to delete ad:", error);
            alert("Nie udało się usunąć ogłoszenia");
        } finally {
            setDeletingId(null);
            processingRef.current.delete(id);
        }
    };

    const handleMarkAsSold = async (id: string) => {
        const price = prompt("Podaj cenę sprzedaży (zł):");
        if (!price) return;

        const soldPrice = parseFloat(price);
        if (isNaN(soldPrice) || soldPrice <= 0) {
            alert("Nieprawidłowa cena");
            return;
        }

        if (processingRef.current.has(id)) return;
        processingRef.current.add(id);

        try {
            const response = await fetch(`/api/ads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "SOLD",
                    soldPrice,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to mark ad as sold");
            }

            router.refresh();
        } catch (error) {
            console.error("Failed to mark ad as sold:", error);
            alert("Nie udało się oznaczyć ogłoszenia jako sprzedane");
        } finally {
            processingRef.current.delete(id);
        }
    };

    const handleMarkAsPublished = async (id: string) => {
        const confirmed = confirm("Czy oznaczyć to ogłoszenie jako opublikowane?");
        if (!confirmed) return;

        if (processingRef.current.has(id)) return;
        processingRef.current.add(id);

        try {
            const response = await fetch(`/api/ads/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "PUBLISHED",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to mark ad as published");
            }

            router.refresh();
        } catch (error) {
            console.error("Failed to mark ad as published:", error);
            alert("Nie udało się oznaczyć ogłoszenia jako opublikowane");
        } finally {
            processingRef.current.delete(id);
        }
    };

    const handleToggleSelect = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        setSelectedIds(new Set(ads.map((ad) => ad.id)));
    }, [ads]);

    const handleClearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const handleExportSelected = useCallback(() => {
        const ids = Array.from(selectedIds).join(",");
        window.location.href = `/api/ads/export?ids=${ids}`;
    }, [selectedIds]);

    const statusLabel = STATUS_FILTERS.find(f => f.value === currentFilter)?.label ?? "Wszystkie";
    const platformLabel = PLATFORM_FILTERS.find(f => f.value === currentPlatform)?.label ?? "Platforma";
    const sortLabel = SORT_OPTIONS.find(o => o.value === currentSort)?.label ?? "Sortuj";

    const activeFilterCount = [
        currentFilter !== "all" ? 1 : 0,
        currentPlatform !== "all" ? 1 : 0,
        currentSort !== "createdAt-desc" ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const paginationPages = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((pageNum) =>
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1
            );
    }, [totalPages, currentPage]);

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    name="search"
                    placeholder="Szukaj po tytule lub treści…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="off"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Wyczyść wyszukiwanie"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Filter + Sort Bar */}
            {/* Desktop (sm+): inline dropdowns */}
            <div className="hidden sm:flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    {/* Status dropdown */}
                    <div className="relative" ref={statusRef}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setStatusOpen(v => !v); setPlatformOpen(false); setSortOpen(false); }}
                            className="gap-1.5"
                        >
                            {statusLabel}
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        {statusOpen && (
                            <div className="absolute left-0 top-full mt-1 z-50 min-w-[180px] bg-card border border-border rounded-md shadow-md py-1">
                                {STATUS_FILTERS.map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => { handleStatusChange(f.value); setStatusOpen(false); }}
                                        className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-muted gap-2"
                                    >
                                        <Check className={cn("h-3.5 w-3.5 shrink-0", currentFilter === f.value ? "text-primary" : "invisible")} />
                                        {f.label}
                                        <span className="ml-auto text-xs text-muted-foreground">{counts[f.countKey]}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Platform dropdown */}
                    <div className="relative" ref={platformRef}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setPlatformOpen(v => !v); setStatusOpen(false); setSortOpen(false); }}
                            className="gap-1.5"
                        >
                            {platformLabel}
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        {platformOpen && (
                            <div className="absolute left-0 top-full mt-1 z-50 min-w-[200px] bg-card border border-border rounded-md shadow-md py-1">
                                {PLATFORM_FILTERS.map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => { handlePlatformChange(f.value); setPlatformOpen(false); }}
                                        className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-muted gap-2"
                                    >
                                        <Check className={cn("h-3.5 w-3.5 shrink-0", currentPlatform === f.value ? "text-primary" : "invisible")} />
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort dropdown */}
                    <span className="ml-auto text-sm text-muted-foreground">
                        {totalFilteredCount} ogłoszeń
                    </span>
                    <div className="relative" ref={sortRef}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSortOpen(v => !v); setStatusOpen(false); setPlatformOpen(false); }}
                            className="gap-1.5"
                        >
                            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                            {sortLabel}
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        {sortOpen && (
                            <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-card border border-border rounded-md shadow-md py-1">
                                {SORT_OPTIONS.map(o => (
                                    <button
                                        key={o.value}
                                        onClick={() => { handleSortChange(o.value); setSortOpen(false); }}
                                        className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-muted gap-2"
                                    >
                                        <Check className={cn("h-3.5 w-3.5 shrink-0", currentSort === o.value ? "text-primary" : "invisible")} />
                                        {o.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Select All — desktop, aligned under ad count */}
                {ads.length > 0 && (
                    <div className="flex">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={selectedIds.size === ads.length ? handleClearSelection : handleSelectAll}
                            className="ml-auto text-muted-foreground hover:text-foreground h-auto py-0.5 text-xs -mr-2"
                        >
                            {selectedIds.size === ads.length ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Mobile (<sm): single button + count */}
            <div className="flex sm:hidden flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="gap-1.5"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Sortuj i filtruj
                        {activeFilterCount > 0 && (
                            <span className="ml-0.5 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 leading-none">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                    <span className="ml-auto text-sm text-muted-foreground">
                        {totalFilteredCount} ogłoszeń
                    </span>
                </div>
                {ads.length > 0 && (
                    <div className="flex">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={selectedIds.size === ads.length ? handleClearSelection : handleSelectAll}
                            className="ml-auto text-muted-foreground hover:text-foreground h-auto py-0.5 text-xs -mr-2"
                        >
                            {selectedIds.size === ads.length ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Mobile Drawer */}
            {/* Backdrop */}
            {mobileFiltersOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-hidden="true"
                />
            )}
            {/* Panel — always mounted for animation, slide in/out */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card border-r border-border z-50 flex flex-col sm:hidden transform transition-transform duration-300 overflow-y-auto",
                    mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="font-semibold text-foreground">Filtry i sortowanie</h2>
                            <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Status */}
                            <div>
                                <h3 className="text-sm font-medium text-foreground mb-2">Status</h3>
                                <div className="space-y-1">
                                    {STATUS_FILTERS.map(f => (
                                        <button
                                            key={f.value}
                                            onClick={() => { handleStatusChange(f.value); setMobileFiltersOpen(false); }}
                                            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-muted gap-2"
                                        >
                                            <Check className={cn("h-3.5 w-3.5 shrink-0", currentFilter === f.value ? "text-primary" : "invisible")} />
                                            {f.label}
                                            <span className="ml-auto text-xs text-muted-foreground">{counts[f.countKey]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Platforma */}
                            <div>
                                <h3 className="text-sm font-medium text-foreground mb-2">Platforma</h3>
                                <div className="space-y-1">
                                    {PLATFORM_FILTERS.map(f => (
                                        <button
                                            key={f.value}
                                            onClick={() => { handlePlatformChange(f.value); setMobileFiltersOpen(false); }}
                                            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-muted gap-2"
                                        >
                                            <Check className={cn("h-3.5 w-3.5 shrink-0", currentPlatform === f.value ? "text-primary" : "invisible")} />
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Sortowanie */}
                            <div>
                                <h3 className="text-sm font-medium text-foreground mb-2">Sortowanie</h3>
                                <div className="space-y-1">
                                    {SORT_OPTIONS.map(o => (
                                        <button
                                            key={o.value}
                                            onClick={() => { handleSortChange(o.value); setMobileFiltersOpen(false); }}
                                            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-muted gap-2"
                                        >
                                            <Check className={cn("h-3.5 w-3.5 shrink-0", currentSort === o.value ? "text-primary" : "invisible")} />
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
            </aside>

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <span className="text-sm font-medium text-foreground">
                        Zaznaczono: {selectedIds.size}
                    </span>
                    <Button size="sm" variant="outline" onClick={handleExportSelected}>
                        <Download className="h-4 w-4 mr-2" />
                        Eksportuj CSV
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleClearSelection}>
                        <X className="h-4 w-4 mr-1" />
                        Odznacz
                    </Button>
                </div>
            )}

            {/* Ads Grid */}
            {ads.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <p className="text-muted-foreground">
                        {currentFilter === "all" && currentPlatform === "all"
                            ? "Nie masz jeszcze żadnych ogłoszeń"
                            : "Brak ogłoszeń spełniających wybrane kryteria"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {ads.map((ad) => (
                            <AdCard
                                key={ad.id}
                                ad={ad}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onMarkAsSold={handleMarkAsSold}
                                onMarkAsPublished={handleMarkAsPublished}
                                showTooltips={true}
                                isSelected={selectedIds.has(ad.id)}
                                onToggleSelect={handleToggleSelect}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Poprzednia
                            </Button>

                            <div className="flex items-center gap-1">
                                {paginationPages.map((pageNum, index) => {
                                        const prevPageNum = paginationPages[index - 1];
                                        const showEllipsis = prevPageNum && pageNum - prevPageNum > 1;

                                        return (
                                            <div key={pageNum} className="flex items-center gap-1">
                                                {showEllipsis && (
                                                    <span className="px-2 text-muted-foreground" aria-hidden="true">…</span>
                                                )}
                                                <Button
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    aria-label={`Strona ${pageNum}`}
                                                    aria-current={currentPage === pageNum ? "page" : undefined}
                                                    className={
                                                        currentPage === pageNum
                                                            ? "bg-primary hover:bg-primary/90 min-w-[40px]"
                                                            : "min-w-[40px]"
                                                    }
                                                >
                                                    {pageNum}
                                                </Button>
                                            </div>
                                        );
                                    })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Następna
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* FAB — mobile only, hidden when filter drawer is open */}
            <Link
                href="/dashboard/new"
                className={cn(
                    "lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-3.5 rounded-full shadow-lg transition-all duration-300",
                    mobileFiltersOpen ? "opacity-0 pointer-events-none -z-10" : "opacity-100 z-40"
                )}
            >
                <Plus className="h-5 w-5" />
                Nowe ogłoszenie
            </Link>
        </div>
    );
}
