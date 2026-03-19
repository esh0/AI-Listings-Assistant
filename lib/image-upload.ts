import { supabase } from "@/lib/supabase";
import sharp from "sharp";

/**
 * Upload single image from base64 with resize to thumbnail
 * @param base64Image - Base64 data URL
 * @param userId - User ID for scoping the storage path
 * @param maxWidth - Maximum width for thumbnail (default 800px)
 * @returns Public URL of uploaded thumbnail
 */
export async function uploadImageFromBase64(
  base64Image: string,
  userId: string,
  maxWidth: number = 800
): Promise<string> {
  // Extract base64 data and mime type
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid base64 image format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, "base64");

  // Server-side size validation (client-side can be bypassed)
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error("Plik jest zbyt duży. Maksymalny rozmiar to 10MB.");
  }

  // Resize image to thumbnail using sharp
  const resizedBuffer = await sharp(buffer)
    .resize(maxWidth, null, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 }) // Convert to JPEG for smaller file size
    .toBuffer();

  // Create unique file path with timestamp
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const filePath = `${userId}/thumb-${timestamp}-${random}.jpg`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("ad-images")
    .upload(filePath, resizedBuffer, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL for the uploaded image
  const {
    data: { publicUrl },
  } = supabase.storage.from("ad-images").getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Upload images to Supabase Storage
 * @param userId - User ID for scoping the storage path
 * @param adId - Ad ID for organizing images
 * @param images - Array of base64 data URLs
 * @returns Array of public URLs for uploaded images
 */
export async function uploadImagesToStorage(
  userId: string,
  adId: string,
  images: string[]
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (let i = 0; i < images.length; i++) {
    const base64Image = images[i];

    // Extract base64 data and mime type
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error(`Invalid base64 image format at index ${i}`);
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Determine file extension from mime type
    const extension = mimeType.split("/")[1] || "jpg";

    // Create unique file path: {userId}/{adId}/image-{index}.{ext}
    const filePath = `${userId}/${adId}/image-${i}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("ad-images")
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      throw new Error(`Failed to upload image ${i}: ${error.message}`);
    }

    // Get public URL for the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("ad-images").getPublicUrl(data.path);

    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
}

/**
 * Delete images from Supabase Storage
 * @param userId - User ID for scoping the storage path
 * @param adId - Ad ID to delete images for
 */
export async function deleteAdImages(
  userId: string,
  adId: string
): Promise<void> {
  // List all files in the ad folder
  const { data: files, error: listError } = await supabase.storage
    .from("ad-images")
    .list(`${userId}/${adId}`);

  if (listError) {
    throw new Error(`Failed to list images: ${listError.message}`);
  }

  if (!files || files.length === 0) {
    return; // No images to delete
  }

  // Delete all files in the folder
  const filePaths = files.map((file) => `${userId}/${adId}/${file.name}`);

  const { error: deleteError } = await supabase.storage
    .from("ad-images")
    .remove(filePaths);

  if (deleteError) {
    throw new Error(`Failed to delete images: ${deleteError.message}`);
  }
}
