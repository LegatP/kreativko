"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useDisclosure } from "@heroui/react";
import CreateDesignModal from "@/components/features/wizard/CreateDesignModal";

interface CreateDesignContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CreateDesignContext = createContext<CreateDesignContextType | undefined>(
  undefined
);

export const CreateDesignContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openModal = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <CreateDesignContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <CreateDesignModal isOpen={isOpen} onClose={closeModal} />
    </CreateDesignContext.Provider>
  );
};

export const useCreateDesignContext = () => {
  const context = useContext(CreateDesignContext);
  if (!context) {
    throw new Error(
      "useCreateDesignContext must be used within a CreateDesignContextProvider"
    );
  }
  return context;
};
