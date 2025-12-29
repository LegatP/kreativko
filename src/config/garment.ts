/**
 * Garment configuration including pricing
 */

import { GarmentConfig } from "@/types/pricing.types";

export const garment: GarmentConfig = {
  type: "shirt",
  pricing: {
    basePrice: 15.0,
    printPositionPrice: 4.9,
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
