"use client";

import { createContext, useContext, ReactNode } from "react";
import { useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import CreateDesignModal from "@/components/features/wizard/CreateDesignModal";
import ROUTES from "@/utils/routes.utils";

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
  const { isOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const router = useRouter();

  const handleSessionCreated = (sessionId: string) => {
    const route = ROUTES.createDesign(sessionId);
    // Close modal first, then navigate after modal animation completes
    closeModal();
    // Wait for modal to fully close before navigating
    // HeroUI modal animation is ~300ms
    setTimeout(() => {
      router.push(route);
    }, 350);
  };

  return (
    <CreateDesignContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <CreateDesignModal
        isOpen={isOpen}
        onClose={closeModal}
        onSessionCreated={handleSessionCreated}
      />
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
