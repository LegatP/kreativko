"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface ProductCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  name: string;
  onNameChange: (value: string) => void;
  slug: string;
  loading: boolean;
  loadingData?: boolean;
  submitButtonText: string;
  isValid: boolean;
}

export default function ProductCategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  name,
  onNameChange,
  slug,
  loading,
  loadingData = false,
  submitButtonText,
  isValid,
}: ProductCategoryFormModalProps) {
  if (loadingData) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="top-center"
        size="lg"
        scrollBehavior="inside"
        classNames={{
          body: "py-6",
          backdrop: "bg-black/50 backdrop-opacity-40",
          base: "border-gray-200 bg-white text-gray-900",
          header: "border-b-[1px] border-gray-200",
          footer: "border-t-[1px] border-gray-200",
          closeButton: "hover:bg-gray-100 active:bg-gray-200",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody>
            <LoadingSpinner />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="top-center"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        body: "py-6",
        backdrop: "bg-black/50 backdrop-opacity-40",
        base: "border-gray-200 bg-white text-gray-900",
        header: "border-b-[1px] border-gray-200",
        footer: "border-t-[1px] border-gray-200",
        closeButton: "hover:bg-gray-100 active:bg-gray-200",
      }}
    >
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              autoFocus
              label="Ime kategorije"
              placeholder="Vnesite ime kategorije"
              value={name}
              onValueChange={onNameChange}
              required
            />
            <Input
              label="Slug"
              value={slug}
              description="URL-friendly identifikator (avtomatsko generirano)"
              isReadOnly
              variant="bordered"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Prekliči
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              isDisabled={!isValid}
            >
              {submitButtonText}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
