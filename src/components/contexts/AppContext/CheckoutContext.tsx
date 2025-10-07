import { useDisclosure } from "@heroui/react";
import React, { createContext, useContext, ReactNode } from "react";

interface CheckoutContextType {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <CheckoutContext.Provider
      value={{
        isOpen,
        onOpen,
        onOpenChange,
        onClose,
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
