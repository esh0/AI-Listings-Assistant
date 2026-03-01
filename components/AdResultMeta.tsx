import React from "react";
import Image from "next/image";
import type { Platform, ProductCondition, PriceType, ToneStyle } from "@/lib/types";
import { PLATFORM_NAMES, CONDITION_NAMES, TONE_STYLE_NAMES } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}) => {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parametry generowania</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platforma:</span>
            <span className="font-medium">{PLATFORM_NAMES[platform]}</span>
          </div>

          {productName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nazwa:</span>
              <span className="font-medium">{productName}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Stan:</span>
            <span className="font-medium">{CONDITION_NAMES[condition]}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Cena:</span>
            <span className="font-medium">{getPriceDisplay()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Dostawa:</span>
            <span className="font-medium text-right">{delivery}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Styl:</span>
            <span className="font-medium">{TONE_STYLE_NAMES[selectedTone]}</span>
          </div>
        </CardContent>
      </Card>

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
              <div key={index} className="flex gap-3">
                {/* Thumbnail with badge */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={imagePreviews[index]}
                    alt={`Zdjęcie ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  {/* Status badge - top-right corner */}
                  <div className="absolute top-1 right-1">
                    {image.isValid ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        OK
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
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
    </div>
  );
};
