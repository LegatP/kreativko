import { useDisclosure } from "@heroui/react";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";

export const BASE_PRODUCT_PRICE = 19.99; // Example base price per item
export const BASE_SHIPPING_COST = 4.9; // Example base shipping cost
// TODO: move to types file
interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderItem {
  productId: string;
  name: string;
  designUrl: string;
  color: string;
  quantities: Record<string, number>;
}
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
    designUrl: "",
    color: "",
    quantities: {},
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

  const productsAmount = useMemo(() => {
    return totalQuantity * BASE_PRODUCT_PRICE;
  }, [totalQuantity]);

  const isWithShipping = useMemo(() => {
    return productsAmount <= 50.0;
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
