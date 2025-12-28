"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  description?: string;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Potrdi brisanje",
  itemName,
  description,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const defaultDescription = itemName
    ? `Ali ste prepričani, da želite izbrisati "${itemName}"? Te akcije ni mogoče razveljaviti.`
    : "Ali ste prepričani, da želite nadaljevati? Te akcije ni mogoče razveljaviti.";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      classNames={{
        backdrop: "bg-black/50 backdrop-opacity-40",
        base: "border-gray-200 bg-white text-gray-900",
        header: "border-b-[1px] border-gray-200",
        footer: "border-t-[1px] border-gray-200",
      }}
    >
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p className="text-gray-600">{description || defaultDescription}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            Prekliči
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isLoading}
          >
            Izbriši
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
