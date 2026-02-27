"use client";

import React, { useState } from "react";
import {
    Copy,
    Check,
    AlertCircle,
    CheckCircle,
    Image as ImageIcon,
    DollarSign,
    FileText,
    Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatPrice } from "@/lib/utils";
import type { GenerateAdResponse, ToneStyle, Platform, ProductCondition, PriceType } from "@/lib/types";
import { TONE_STYLE_NAMES, PLATFORM_NAMES, CONDITION_NAMES } from "@/lib/types";

interface AdResultProps {
    result: GenerateAdResponse;
    imagePreviews?: string[]; // Array of preview URLs in order by index
    // Generation parameters
    platform: Platform;
    productName?: string;
    condition: ProductCondition;
    priceType: PriceType;
    userPrice?: string;
    delivery: string;
    selectedTone: ToneStyle;
}

export function AdResult({ result, imagePreviews, platform, productName, condition, priceType, userPrice, delivery, selectedTone }: AdResultProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    if (!result.isValid) {
        return (
            <Alert variant="destructive" role="alert" aria-live="assertive">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Błąd generowania</AlertTitle>
                <AlertDescription>
                    {result.error ||
                        "Wystąpił nieoczekiwany błąd. Spróbuj ponownie."}
                </AlertDescription>
            </Alert>
        );
    }

    const displayContent = { title: result.title, description: result.description };

    return (
        <div className="space-y-8 animate-slide-up" role="region" aria-label="Wygenerowane ogłoszenie">
            {/* Generation Parameters Summary */}
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Parametry generowania
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Platforma:</span>
                        <Badge variant="secondary">{PLATFORM_NAMES[platform]}</Badge>
                    </div>
                    {productName && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Nazwa produktu:</span>
                            <span className="font-medium">{productName}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Stan:</span>
                        <span className="font-medium">{CONDITION_NAMES[condition]}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Cena:</span>
                        <span className="font-medium">
                            {priceType === "free" && "Za darmo"}
                            {priceType === "user_provided" && `${userPrice} zł`}
                            {priceType === "ai_suggest" && "Zasugerowana przez AI"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Dostawa:</span>
                        <span className="font-medium">{delivery}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Styl:</span>
                        <Badge variant="outline">
                            {TONE_STYLE_NAMES[selectedTone]}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Title Section */}
            {displayContent.title && (
                <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-md transition-all hover:bg-muted/40">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                            Tytuł
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                copyToClipboard(displayContent.title!, "title")
                            }
                            aria-label="Kopiuj tytuł do schowka"
                            className="transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            {copiedField === "title" ? (
                                <>
                                    <Check className="h-4 w-4" aria-hidden="true" />
                                    Skopiowano
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" aria-hidden="true" />
                                    Kopiuj
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-lg font-semibold leading-relaxed tracking-tight">
                        {displayContent.title}
                    </p>
                </div>
            )}

            {/* Description Section */}
            {displayContent.description && (
                <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-md transition-all hover:bg-muted/40">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                            Opis
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                copyToClipboard(
                                    displayContent.description!,
                                    "description"
                                )
                            }
                            aria-label="Kopiuj opis do schowka"
                            className="transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            {copiedField === "description" ? (
                                <>
                                    <Check className="h-4 w-4" aria-hidden="true" />
                                    Skopiowano
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" aria-hidden="true" />
                                    Kopiuj
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-base leading-relaxed whitespace-pre-wrap [text-wrap:balance]">
                        {displayContent.description}
                    </p>
                </div>
            )}

            {/* Price Section - Compact inline */}
            {result.isFree ? (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Cena</h3>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🎁</span>
                            <div>
                                <p className="font-semibold text-green-700 dark:text-green-400">
                                    Za darmo
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-500">
                                    Oddajesz produkt bezpłatnie
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : result.price ? (
                <div className="flex flex-wrap items-center gap-4 p-6 bg-primary/5 border border-primary/20 rounded-md transition-all hover:border-primary/30">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Cena
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="default" className="text-base font-bold px-3 py-1.5 transition-transform hover:scale-105">
                            {formatPrice(result.price.min)}
                        </Badge>
                        <span className="text-muted-foreground font-medium">—</span>
                        <Badge variant="default" className="text-base font-bold px-3 py-1.5 transition-transform hover:scale-105">
                            {formatPrice(result.price.max)}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex-1 min-w-[200px] leading-relaxed">
                        {result.price.reason}
                    </p>
                </div>
            ) : null}

            {/* Image Analysis Section */}
            {result.images && result.images.length > 0 && (
                <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle as="h3" className="text-base font-semibold flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                            Analiza zdjęć ({result.images.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {result.images.map((img, index) => {
                                // Use index to get preview URL from array
                                const previewUrl = imagePreviews?.[index];
                                return (
                                    <div
                                        key={index}
                                        className="flex gap-3 p-3 rounded-lg bg-muted/30 transition-all hover:bg-muted/40"
                                    >
                                        {/* Thumbnail */}
                                        <div className="flex-shrink-0">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt={`Zdjęcie ${index + 1}`}
                                                    className="w-16 h-16 object-cover rounded-md border transition-transform hover:scale-105"
                                                    width={64}
                                                    height={64}
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-muted rounded-md border flex items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info - removed "Zdjęcie X" label */}
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center justify-end">
                                                {img.isValid ? (
                                                    <Badge variant="success" className="flex-shrink-0 transition-transform hover:scale-105">
                                                        <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                                                        OK
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="warning" className="flex-shrink-0 transition-transform hover:scale-105">
                                                        <AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                                                        Popraw
                                                    </Badge>
                                                )}
                                            </div>

                                            {img.quality && (
                                                <p className="text-xs text-muted-foreground break-words leading-relaxed">
                                                    <span className="font-semibold">Jakość:</span> {img.quality}
                                                </p>
                                            )}

                                            {img.suggestions && (
                                                <p className="text-xs text-muted-foreground break-words leading-relaxed">
                                                    <span className="font-semibold">Sugestie:</span> {img.suggestions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Copy All Button - prominent */}
            {displayContent.title && displayContent.description && (
                <Button
                    size="lg"
                    className="w-full sm:w-auto sm:min-w-[300px] text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() =>
                        copyToClipboard(
                            `${displayContent.title}\n\n${displayContent.description}`,
                            "all"
                        )
                    }
                    aria-label="Kopiuj tytuł i opis do schowka"
                >
                    {copiedField === "all" ? (
                        <>
                            <Check className="h-5 w-5 mr-2" aria-hidden="true" />
                            Skopiowano wszystko
                        </>
                    ) : (
                        <>
                            <Copy className="h-5 w-5 mr-2" aria-hidden="true" />
                            Kopiuj tytuł i opis
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}