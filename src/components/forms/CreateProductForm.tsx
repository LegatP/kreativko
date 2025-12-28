"use client";

import ProductFormBase from "./ProductFormBase";

interface CreateProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateProductForm({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductFormProps) {
  return (
    <ProductFormBase
      mode="create"
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}
