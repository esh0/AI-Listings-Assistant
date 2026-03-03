import { get, set, del } from "idb-keyval";

// IndexedDB key for pending ad data
const PENDING_AD_KEY = "marketplace-assistant:pending-ad";

// Type for pending ad stored in IndexedDB
export interface PendingAd {
  title: string;
  description: string;
  priceMin?: number;
  priceMax?: number;
  priceReasoning?: string;
  images: Array<{
    url: string; // base64 data URL
    quality: string;
    suggestions: string;
  }>;
  parameters: {
    platform: string;
    tone: string;
    condition: string;
    delivery: string[];
    productName?: string;
    notes?: string;
    priceType: string;
    userPrice?: number;
  };
  timestamp: number;
}

/**
 * Save pending ad to IndexedDB (for soft-wall flow)
 * Used when user generates ad without being logged in
 */
export async function savePendingAd(adData: PendingAd): Promise<void> {
  await set(PENDING_AD_KEY, adData);
}

/**
 * Get pending ad from IndexedDB
 * Returns null if no pending ad exists
 */
export async function getPendingAd(): Promise<PendingAd | null> {
  const data = await get<PendingAd>(PENDING_AD_KEY);
  return data || null;
}

/**
 * Clear pending ad from IndexedDB
 * Called after successfully saving ad to database
 */
export async function clearPendingAd(): Promise<void> {
  await del(PENDING_AD_KEY);
}
