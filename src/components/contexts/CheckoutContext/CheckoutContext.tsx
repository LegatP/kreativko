import { useDisclosure } from "@heroui/react";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";
import { PrintPosition, PriceBreakdown } from "@/types/pricing.types";
import { garment } from "@/config/garment";
import { SHIPPING } from "@/config/shipping";
import { getPriceBreakdown } from "@/utils/pricing.utils";
import { OrderItem, ShippingInfo } from "@/db/orders/types";

export const BASE_SHIPPING_COST = SHIPPING.baseCost;

export type DesignUrls = Partial<Record<PrintPosition, string>>;

interface CheckoutContextType {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  shippingInfo: ShippingInfo;
  setShippingInfo: (info: ShippingInfo) => void;
  item: OrderItem;
  setItem: React.Dispatch<React.SetStateAction<OrderItem>>;
  totalAmount: number;
  productsAmount: number;
  totalQuantity: number;
  isWithShipping: boolean;
  priceBreakdown: PriceBreakdown;
  pricePerItem: number;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [item, setItem] = useState<OrderItem>({
    productId: "",
    name: "",
    designUrls: {},
    color: "",
    quantities: {},
    pricing: {
      garmentType: garment.type,
      basePrice: garment.pricing.basePrice,
      printPositionPrice: garment.pricing.printPositionPrice,
      numberOfPrintPositions: 0,
      pricePerItem: garment.pricing.basePrice,
    },
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Slovenija",
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const totalQuantity = useMemo(() => {
    return item
      ? Object.values(item.quantities).reduce((acc, qty) => acc + qty, 0)
      : 0;
  }, [item]);

  // Calculate price breakdown based on selected designs
  const priceBreakdown = useMemo(() => {
    return getPriceBreakdown(garment.pricing, item.designUrls);
  }, [item.designUrls]);

  const pricePerItem = priceBreakdown.totalPerItem;

  const productsAmount = useMemo(() => {
    return totalQuantity * pricePerItem;
  }, [totalQuantity, pricePerItem]);

  const isWithShipping = useMemo(() => {
    return productsAmount < SHIPPING.freeShippingThreshold;
  }, [productsAmount]);

  const totalAmount = useMemo(() => {
    const shippingCost = isWithShipping ? BASE_SHIPPING_COST : 0;
    return productsAmount + shippingCost;
  }, [productsAmount, isWithShipping]);

  return (
    <CheckoutContext.Provider
      value={{
        isOpen,
        onOpen,
        onOpenChange,
        onClose,
        shippingInfo,
        setShippingInfo,
        item,
        setItem,
        totalAmount,
        productsAmount,
        totalQuantity,
        isWithShipping,
        priceBreakdown,
        pricePerItem,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error(
      "useCheckoutContext must be used within a CheckoutContextProvider"
    );
  }
  return context;
};
