/**
 * Garment configuration including pricing.
 * All prices are in cents (e.g., 1500 = 15.00 EUR).
 */

import { GarmentConfig } from "@/types/pricing.types";

export const garment: GarmentConfig = {
  type: "shirt",
  pricing: {
    basePrice: 1500,
    printPositionPrice: 490,
  },
  colors: [
    { name: "Bela", hex: "#F0F1F6" },
    { name: "Črna", hex: "#111017" },
    { name: "Siva", hex: "#9EA1A6" },
    { name: "Mango rumena", hex: "#E29D1C" },
    { name: "Žajbljevo zelena", hex: "#81ABA3" },
    { name: "Svetlo modra", hex: "#0162AD" },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  printPositions: ["front", "back"],
};

// Future garments can be added here:
// export const hoodie: GarmentConfig = { ... }
// export const umbrella: GarmentConfig = { ... }
