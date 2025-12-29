/**
 * Pricing-related type definitions
 */

export type PrintPosition = "front" | "back";

export type GarmentType = "shirt" | "hoodie" | "umbrella";

export interface GarmentPricing {
  basePrice: number;
  printPositionPrice: number;
}

export interface GarmentColor {
  name: string;
  hex: string;
}

export interface GarmentConfig {
  type: GarmentType;
  pricing: GarmentPricing;
  colors: GarmentColor[];
  sizes: string[];
  printPositions: PrintPosition[];
}

export interface ShippingConfig {
  baseCost: number;
  freeShippingThreshold: number;
}

export interface PriceBreakdown {
  basePrice: number;
  printPositionPrice: number;
  numberOfPrintPositions: number;
  totalPerItem: number;
}
