"use client";

import { AdCard } from "@/components/AdCard";
import { Button } from "@/components/ui/button";
import { AdStatus, Platform } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { PLATFORM_NAMES } from "@/lib/types";
import { ArrowUpDown, Filter, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    { value: "draft", label: "Wersje robocze", countKey: "drafts" as const },
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
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    const currentPlatform = searchParams.get("platform") || "all";
    const currentSort = searchParams.get("sort") || "createdAt-desc";

    const updateParams = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "all") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        router.push(`/dashboard/ads?${params.toString()}`);
    }, [searchParams, router]);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            updateParams({ search: searchQuery || null });
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchQuery, updateParams]);

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
        updateParams({ page: newPage.toString() });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleView = (id: string) => {
        router.push(`/dashboard/ads/${id}`);
    };

    const handleEdit = (id: string) => {
        alert("Funkcja edycji zostanie dodana w przyszłości");
    };

    const handleDelete = async (id: string) => {
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
        }
    };

    const handleMarkAsPublished = async (id: string) => {
        const confirmed = confirm("Czy oznaczyć to ogłoszenie jako opublikowane?");
        if (!confirmed) return;

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
        }
    };

    const activeFiltersCount = [
        currentFilter !== "all" ? 1 : 0,
        currentPlatform !== "all" ? 1 : 0,
        searchQuery ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
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

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {STATUS_FILTERS.map((filter) => (
                        <Button
                            key={filter.value}
                            variant={currentFilter === filter.value ? "default" : "outline"}
                            onClick={() => handleStatusChange(filter.value)}
                            className={
                                currentFilter === filter.value
                                    ? "bg-primary hover:bg-primary/90"
                                    : ""
                            }
                        >
                            {filter.label}
                            <span className="ml-2 opacity-70">({counts[filter.countKey]})</span>
                        </Button>
                    ))}
                </div>

                {/* Toggle Filters Button */}
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="ml-auto"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtry
                    {activeFiltersCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Additional Filters (collapsible) */}
            {showFilters && (
                <div className="bg-muted rounded-lg p-4 space-y-4 border">
                    {/* Platform Filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Platforma:</label>
                        <div className="flex flex-wrap gap-2">
                            {PLATFORM_FILTERS.map((filter) => (
                                <Button
                                    key={filter.value}
                                    size="sm"
                                    variant={currentPlatform === filter.value ? "default" : "outline"}
                                    onClick={() => handlePlatformChange(filter.value)}
                                    className={
                                        currentPlatform === filter.value
                                            ? "bg-primary hover:bg-primary/90"
                                            : ""
                                    }
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            <ArrowUpDown className="h-4 w-4 inline mr-1" />
                            Sortowanie:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {SORT_OPTIONS.map((option) => (
                                <Button
                                    key={option.value}
                                    size="sm"
                                    variant={currentSort === option.value ? "default" : "outline"}
                                    onClick={() => handleSortChange(option.value)}
                                    className={
                                        currentSort === option.value
                                            ? "bg-primary hover:bg-primary/90"
                                            : ""
                                    }
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                handleStatusChange("all");
                                handlePlatformChange("all");
                                handleClearSearch();
                            }}
                            className="w-full"
                        >
                            Wyczyść filtry
                        </Button>
                    )}
                </div>
            )}

            {/* Results Info */}
            <div className="text-sm text-muted-foreground">
                Znaleziono: <span className="font-medium">{totalFilteredCount}</span> ogłoszeń
                {totalPages > 1 && (
                    <span className="ml-2">
                        (strona {currentPage} z {totalPages})
                    </span>
                )}
            </div>

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
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((pageNum) => {
                                        // Show first page, last page, current page, and pages around current
                                        return (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            Math.abs(pageNum - currentPage) <= 1
                                        );
                                    })
                                    .map((pageNum, index, array) => {
                                        // Add ellipsis if there's a gap
                                        const prevPageNum = array[index - 1];
                                        const showEllipsis = prevPageNum && pageNum - prevPageNum > 1;

                                        return (
                                            <div key={pageNum} className="flex items-center gap-1">
                                                {showEllipsis && (
                                                    <span className="px-2 text-muted-foreground">…</span>
                                                )}
                                                <Button
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={
                                                        currentPage === pageNum
                                                            ? "bg-orange-500 hover:bg-orange-600 min-w-[40px]"
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
        </div>
    );
}
