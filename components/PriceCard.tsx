import React from "react";
import { CardWrapper } from "@/components/ui/card-wrapper";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

interface PriceCardProps {
  price?: {
    min: number;
    max: number;
    reason: string;
  };
  isFree: boolean;
}

export const PriceCard = React.memo(function PriceCard({
  price,
  isFree,
}: PriceCardProps) {
  return (
    <CardWrapper title="Sugerowana cena" icon={Gift}>
      {isFree ? (
        // Free version with green styling
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <Gift className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">Za darmo</p>
            <p className="text-sm text-gray-500">
              Przedmiot oddawany bezpłatnie
            </p>
          </div>
        </div>
      ) : price ? (
        // AI suggested price with pastel orange badges
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-600 border-orange-200 text-lg font-semibold px-4 py-2 hover:scale-105 transition-transform"
            >
              {price.min} zł
            </Badge>
            <span className="text-gray-400">-</span>
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-600 border-orange-200 text-lg font-semibold px-4 py-2 hover:scale-105 transition-transform"
            >
              {price.max} zł
            </Badge>
          </div>
          {price.reason && (
            <p className="text-sm text-gray-500">{price.reason}</p>
          )}
        </div>
      ) : (
        // Fallback when no price data available
        <p className="text-sm text-gray-500">
          Brak sugerowanej ceny dla tego ogłoszenia.
        </p>
      )}
    </CardWrapper>
  );
});
