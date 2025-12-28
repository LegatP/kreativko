"use client";

import { ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import LoadingSpinner from "./LoadingSpinner";

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

const ADMIN_MODAL_CLASSNAMES = {
  body: "py-6",
  backdrop: "bg-black/50 backdrop-opacity-40",
  base: "border-gray-200 bg-white text-gray-900",
  header: "border-b-[1px] border-gray-200",
  footer: "border-t-[1px] border-gray-200",
  closeButton: "hover:bg-gray-100 active:bg-gray-200",
};

interface BaseAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  isLoading?: boolean;
  // Standard footer props (used if footer is not provided)
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitLoading?: boolean;
  isSubmitDisabled?: boolean;
}

/**
 * Base modal component for admin dashboard modals.
 * Provides consistent styling with scrollable body and fixed header/footer.
 */
export default function BaseAdminModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "2xl",
  isLoading = false,
  onSubmit,
  submitLabel = "Shrani",
  cancelLabel = "Prekliči",
  isSubmitLoading = false,
  isSubmitDisabled = false,
}: BaseAdminModalProps) {
  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        size={size}
        classNames={ADMIN_MODAL_CLASSNAMES}
      >
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <LoadingSpinner />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const defaultFooter = onSubmit ? (
    <>
      <Button color="danger" variant="flat" onPress={onClose}>
        {cancelLabel}
      </Button>
      <Button
        color="primary"
        isLoading={isSubmitLoading}
        isDisabled={isSubmitDisabled}
        onPress={onSubmit}
      >
        {submitLabel}
      </Button>
    </>
  ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="top-center"
      size={size}
      scrollBehavior="inside"
      classNames={ADMIN_MODAL_CLASSNAMES}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody className="gap-4 max-h-[60vh] overflow-y-auto">
              {children}
            </ModalBody>
            {(footer || defaultFooter) && (
              <ModalFooter>
                {footer ||
                  (onSubmit && (
                    <>
                      <Button color="danger" variant="flat" onPress={onCloseModal}>
                        {cancelLabel}
                      </Button>
                      <Button
                        color="primary"
                        isLoading={isSubmitLoading}
                        isDisabled={isSubmitDisabled}
                        onPress={onSubmit}
                      >
                        {submitLabel}
                      </Button>
                    </>
                  ))}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
