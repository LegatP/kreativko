"use client";

import { ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

interface BaseDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  headerLeft?: ReactNode;
  size?: ModalSize;
}

/**
 * Base modal component for design-related modals.
 * Provides consistent styling and structure for SelectDesignModal, EditDesignModal, etc.
 */
export default function BaseDesignModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  headerLeft,
  size = "xl",
}: BaseDesignModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      placement="auto"
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-row items-center gap-3 pt-6">
          {headerLeft && (
            <div className="flex-shrink-0 absolute">{headerLeft}</div>
          )}
          <div className="flex-1 text-center min-w-full">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-default-500 font-normal text-sm mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerLeft && <div className="w-8" />}
        </ModalHeader>
        <ModalBody className="px-6 pb-8 pt-4">{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
}
