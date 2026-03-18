"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, Plus, Image as ImageIcon } from "lucide-react";
import { cn, compressImage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { validateImageFile, MAX_IMAGES } from "@/lib/schemas";
import { formatFileSize } from "@/lib/utils";
import type { UploadedImage } from "@/lib/types";

interface UploadDropzoneProps {
    onImagesChange: (images: UploadedImage[]) => void;
    images: UploadedImage[];
    maxImages?: number;
}

export function UploadDropzone({ onImagesChange, images, maxImages }: UploadDropzoneProps) {
    const imageLimit = maxImages ?? MAX_IMAGES;
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            setError(null);
            setIsCompressing(true);

            const fileArray = Array.from(files);
            // Show pending skeletons for the files being processed (capped at remaining slots)
            const remainingSlots = imageLimit - images.length;
            setPendingCount(Math.min(fileArray.length, remainingSlots));
            const newImages: UploadedImage[] = [];

            try {
                for (const file of fileArray) {
                    // Check if we've reached the limit
                    if (images.length + newImages.length >= imageLimit) {
                        setError(`Maksymalnie ${imageLimit} zdjęć`);
                        break;
                    }

                    const validation = validateImageFile(file);
                    if (!validation.valid) {
                        setError(validation.error || "Nieprawidłowy plik");
                        continue;
                    }

                    // Check for duplicates
                    const isDuplicate = images.some(
                        (img) =>
                            img.filename === file.name && img.file.size === file.size
                    );
                    if (isDuplicate) {
                        continue;
                    }

                    try {
                        // Compress image before adding
                        const compressedFile = await compressImage(file);
                        const preview = URL.createObjectURL(compressedFile);

                        newImages.push({
                            file: compressedFile,
                            preview,
                            filename: file.name,
                        });
                    } catch (compressionError) {
                        console.error('Failed to compress image:', file.name, compressionError);
                        // Fall back to original file if compression fails
                        const preview = URL.createObjectURL(file);
                        newImages.push({
                            file: file,
                            preview,
                            filename: file.name,
                        });
                    }
                }

                if (newImages.length > 0) {
                    onImagesChange([...images, ...newImages]);
                }
            } catch (err) {
                console.error('Image upload error:', err);
                setError('Błąd przetwarzania zdjęć');
            } finally {
                setIsCompressing(false);
                setPendingCount(0);
            }
        },
        [images, onImagesChange, imageLimit]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(true);
        },
        []
    );

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
        },
        []
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                handleFiles(e.target.files);
            }
            // Reset input so same file can be selected again
            e.target.value = "";
        },
        [handleFiles]
    );

    const handleRemove = useCallback(
        (index: number) => {
            const imageToRemove = images[index];
            if (imageToRemove?.preview) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            const newImages = images.filter((_, i) => i !== index);
            onImagesChange(newImages);
            setError(null);
        },
        [images, onImagesChange]
    );

    const canAddMore = images.length < imageLimit;

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            {(images.length > 0 || pendingCount > 0) && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <div
                            key={`${image.filename}-${index}`}
                            className="relative group aspect-square rounded-lg border-2 border-border bg-muted overflow-hidden hover:border-primary transition-colors animate-tile-enter"
                        >
                            <img
                                src={image.preview}
                                alt={`Zdjęcie produktu ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                width={400}
                                height={400}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                                <span className="text-white text-sm font-semibold">
                                    #{index + 1}
                                </span>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleRemove(index)}
                                    className="transition-transform hover:scale-110 active:scale-95"
                                    aria-label={`Usuń zdjęcie ${index + 1}: ${image.filename}`}
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Pending skeleton slots during compression */}
                    {Array.from({ length: pendingCount }).map((_, i) => (
                        <div
                            key={`pending-${i}`}
                            className="relative aspect-square rounded-lg border-2 border-border bg-muted overflow-hidden flex items-center justify-center animate-pulse"
                        >
                            <ImageIcon className="h-6 w-6 text-muted-foreground/40" aria-hidden="true" />
                        </div>
                    ))}

                    {/* Add more button */}
                    {canAddMore && !isCompressing && (
                        <label
                            className={cn(
                                "aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group",
                                "border-border hover:border-primary hover:bg-primary/5 hover:scale-[1.02]",
                                "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                            )}
                        >
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleInputChange}
                                multiple
                                className="sr-only"
                                aria-label="Dodaj więcej zdjęć"
                                tabIndex={0}
                            />
                            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                            <span className="text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors font-medium">
                                Dodaj
                            </span>
                        </label>
                    )}
                </div>
            )}

            {/* Empty state / Initial dropzone */}
            {images.length === 0 && pendingCount === 0 && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        "relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-4 sm:p-8 transition-all cursor-pointer min-h-[140px] sm:min-h-[200px] group",
                        isDragging
                            ? "border-primary bg-primary/5 scale-[1.01]"
                            : "border-border hover:border-primary/50 hover:bg-muted/30",
                        error && "border-destructive"
                    )}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleInputChange}
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Wybierz zdjęcia produktu"
                        tabIndex={0}
                    />
                    <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
                        <div className={cn(
                            "rounded-full bg-muted p-4 transition-colors",
                            isDragging ? "bg-primary/10" : "group-hover:bg-primary/10"
                        )}>
                            <Upload className={cn(
                                "h-7 w-7 sm:h-10 sm:w-10 text-muted-foreground transition-colors",
                                isDragging ? "text-primary animate-float" : "group-hover:text-primary",
                                isCompressing && "animate-pulse"
                            )} aria-hidden="true" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-base sm:text-lg font-semibold transition-colors duration-150">
                                {isCompressing
                                    ? "Przetwarzanie…"
                                    : isDragging
                                    ? "Upuść zdjęcia"
                                    : "Przeciągnij zdjęcia tutaj"}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {isCompressing
                                    ? "Optymalizacja obrazów…"
                                    : isDragging
                                    ? "Puść, aby dodać"
                                    : "lub kliknij, aby wybrać pliki"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ImageIcon className="h-4 w-4" aria-hidden="true" />
                            <span>JPG, PNG, WEBP • automatyczna optymalizacja • do {imageLimit} zdjęć</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Info bar */}
            {images.length > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        {images.length} z {imageLimit} zdjęć
                    </span>
                    <span>
                        {formatFileSize(
                            images.reduce((acc, img) => acc + img.file.size, 0)
                        )}
                    </span>
                </div>
            )}

            {/* Error message */}
            {error && (
                <p className="text-sm text-destructive flex items-center gap-2" role="alert" aria-live="polite">
                    <X className="h-4 w-4" aria-hidden="true" />
                    {error}
                </p>
            )}
        </div>
    );
}