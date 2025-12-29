/**
 * Shipping configuration.
 * All prices are in cents (e.g., 490 = 4.90 EUR).
 */

import { ShippingConfig } from "@/types/pricing.types";

export const SHIPPING: ShippingConfig = {
  baseCost: 490,
  freeShippingThreshold: 5000,
};
