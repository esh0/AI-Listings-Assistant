import React from "react";
import Image from "next/image";
import type { Platform, Condition, PriceType, ToneStyle } from "@/lib/types";
import { PLATFORM_NAMES, CONDITION_NAMES, TONE_STYLE_NAMES } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImageAnalysis {
  isValid: boolean;
  quality?: string;
  suggestions?: string;
}

interface AdResultMetaProps {
  platform: Platform;
  productName?: string;
  condition: Condition;
  priceType: PriceType;
  userPrice?: number | string;
  delivery: string;
  selectedTone: ToneStyle;
  images: ImageAnalysis[];
  imagePreviews: string[];
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

      {/* Image Analysis Card - Only show if there are images */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analiza zdjęć</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={imagePreviews[index]}
                    alt={`Zdjęcie ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>

                {/* Analysis content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Status badge */}
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

                  {/* Quality text */}
                  {image.quality && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {image.quality}
                    </p>
                  )}

                  {/* Suggestions text */}
                  {image.suggestions && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-medium">Sugestie:</span>{" "}
                      {image.suggestions}
                    </p>
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
