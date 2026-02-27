import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix to get pure base64
            const base64 = result.split(",")[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Compress and resize image before upload
 * Reduces payload size dramatically while maintaining quality
 */
export async function compressImage(
    file: File,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85
): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
        }

        img.onload = () => {
            // Calculate new dimensions maintaining aspect ratio
            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to blob conversion failed'));
                        return;
                    }

                    // Create new file from blob
                    const compressedFile = new File(
                        [blob],
                        file.name,
                        {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        }
                    );

                    resolve(compressedFile);
                },
                'image/jpeg',
                quality
            );

            // Clean up
            URL.revokeObjectURL(img.src);
        };

        img.onerror = () => {
            reject(new Error('Image loading failed'));
            URL.revokeObjectURL(img.src);
        };

        // Load image
        img.src = URL.createObjectURL(file);
    });
}

export function getImageMimeType(
    filename: string
): "image/jpeg" | "image/png" | "image/webp" {
    const ext = filename.toLowerCase().split(".").pop();
    switch (ext) {
        case "png":
            return "image/png";
        case "webp":
            return "image/webp";
        default:
            return "image/jpeg";
    }
}