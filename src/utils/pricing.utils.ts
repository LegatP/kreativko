/**
 * Pricing utility functions
 */

import {
  GarmentPricing,
  PrintPosition,
  PriceBreakdown,
} from "@/types/pricing.types";

/**
 * Calculate item price based on garment pricing and design positions
 */
export function calculateItemPrice(
  pricing: GarmentPricing,
  designUrls: Partial<Record<PrintPosition, string>>
): number {
  const numPositions = Object.values(designUrls).filter(Boolean).length;
  return pricing.basePrice + numPositions * pricing.printPositionPrice;
}

/**
 * Get full price breakdown for an item
 */
export function getPriceBreakdown(
  pricing: GarmentPricing,
  designUrls: Partial<Record<PrintPosition, string>>
): PriceBreakdown {
  const numPositions = Object.values(designUrls).filter(Boolean).length;
  return {
    basePrice: pricing.basePrice,
    printPositionPrice: pricing.printPositionPrice,
    numberOfPrintPositions: numPositions,
    totalPerItem: pricing.basePrice + numPositions * pricing.printPositionPrice,
  };
}
