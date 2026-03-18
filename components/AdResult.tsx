"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GenerateAdResponse, ToneStyle, Platform, ProductCondition, PriceType } from "@/lib/types";
import { AdResultMain } from "@/components/AdResultMain";
import { AdResultMeta } from "@/components/AdResultMeta";

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
    onEdit: () => void;
    editedTitle: string;
    editedDescription: string;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
}

export function AdResult({ result, imagePreviews, platform, productName, condition, priceType, userPrice, delivery, selectedTone, onEdit, editedTitle, editedDescription, onTitleChange, onDescriptionChange }: AdResultProps) {
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
        <div
            className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-6"
            role="region"
            aria-label="Wygenerowane ogłoszenie"
        >
            {/* Left Column - Main Results */}
            <AdResultMain
                title={displayContent.title!}
                description={displayContent.description!}
                editedTitle={editedTitle}
                editedDescription={editedDescription}
                onTitleChange={onTitleChange}
                onDescriptionChange={onDescriptionChange}
                platform={platform}
            />

            {/* Right Column - Metadata */}
            <AdResultMeta
                platform={platform}
                productName={productName}
                condition={condition}
                priceType={priceType}
                userPrice={userPrice}
                delivery={delivery}
                selectedTone={selectedTone}
                images={result.images || []}
                imagePreviews={imagePreviews}
                price={result.price || undefined}
                isFree={result.isFree || false}
                onEdit={onEdit}
            />
        </div>
    );
}