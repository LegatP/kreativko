export {
  CheckoutContextProvider,
  useCheckoutContext,
  BASE_SHIPPING_COST,
  type DesignUrls,
} from "./CheckoutContext";

// Re-export pricing utilities
export { garment } from "@/config/garment";
export { SHIPPING } from "@/config/shipping";
export { calculateItemPrice, getPriceBreakdown } from "@/utils/pricing.utils";
export type {
  GarmentType,
  PriceBreakdown,
  PrintPosition,
} from "@/types/pricing.types";
