"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pencil, Settings, Maximize2, X } from "lucide-react";
import type { Platform, ProductCondition, PriceType, ToneStyle } from "@/lib/types";
import { PLATFORM_NAMES, CONDITION_NAMES, TONE_STYLE_NAMES } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { PriceCard } from "@/components/PriceCard";

interface ImageAnalysis {
  isValid: boolean;
  quality?: string;
  suggestions?: string;
}

interface AdResultMetaProps {
  platform: Platform;
  productName?: string;
  condition: ProductCondition;
  priceType: PriceType;
  userPrice?: number | string;
  delivery: string;
  selectedTone: ToneStyle;
  images: ImageAnalysis[];
  imagePreviews?: string[];
  price?: {
    min: number;
    max: number;
    reason: string;
  };
  isFree: boolean;
  onEdit: () => void;
}

export const AdResultMeta: React.FC<AdResultMetaProps> = ({
  platform,
  productName,
  condition,
  priceType,
  userPrice,
  delivery,
  selectedTone,
  images,
  imagePreviews,
  price,
  isFree,
  onEdit,
}) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Format price type for display
  const getPriceDisplay = () => {
    if (priceType === "free") {
      return "Za darmo";
    } else if (priceType === "user_provided" && userPrice) {
      return `${userPrice} zł`;
    } else {
      return "AI zasugerowała";
    }
  };

  return (
    <div className="space-y-6">
      {/* Parameters Card */}
      <CardWrapper
        title="Parametry ogłoszenia"
        icon={Settings}
        headerAction={
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            aria-label="Popraw parametry"
            className="gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-orange-950 dark:hover:text-orange-400"
          >
            <Pencil className="h-4 w-4" />
            Popraw
          </Button>
        }
      >
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-500">Platforma:</span>
            <span className="font-medium text-foreground">{PLATFORM_NAMES[platform]}</span>
          </div>

          {productName && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-500">Nazwa:</span>
              <span className="font-medium text-foreground">{productName}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-500">Stan:</span>
            <span className="font-medium text-foreground">{CONDITION_NAMES[condition]}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-500">Cena:</span>
            <span className="font-medium text-foreground">{getPriceDisplay()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-500">Dostawa:</span>
            <span className="font-medium text-foreground text-right">{delivery}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-500">Styl:</span>
            <span className="font-medium text-foreground">{TONE_STYLE_NAMES[selectedTone]}</span>
          </div>
        </div>
      </CardWrapper>

      {/* Price Card - conditional rendering */}
      {(priceType === "ai_suggest" || isFree) && (
        <PriceCard price={price} isFree={isFree} />
      )}

      {/* Image Analysis Card - Only show if there are images */}
      {images.length > 0 && imagePreviews && imagePreviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analiza zdjęć</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="flex gap-4">
                {/* Thumbnail with badge and zoom button */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted group">
                  <Image
                    src={imagePreviews[index]}
                    alt={`Zdjęcie ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />

                  {/* Zoom button - top-right corner */}
                  <button
                    onClick={() => setLightboxImage(imagePreviews[index])}
                    className="absolute top-1 right-1 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Powiększ zdjęcie"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </button>

                  {/* Status badge - bottom-right corner */}
                  <div className="absolute bottom-1 right-1">
                    {image.isValid ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50/80 text-green-600 border-green-200/80 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800"
                      >
                        OK
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800"
                      >
                        Uwaga
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Analysis content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Suggestions text - formatted like Parametry */}
                  {image.suggestions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sugestie:</span>
                      <span className="font-medium text-right">{image.suggestions}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-all"
            aria-label="Zamknij podgląd"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Podgląd zdjęcia"
              fill
              className="object-contain"
              sizes="100vw"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
