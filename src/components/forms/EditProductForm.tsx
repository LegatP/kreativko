"use client";

import ProductFormBase from "./ProductFormBase";

interface EditProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productId?: string;
}

export default function EditProductForm({
  isOpen,
  onClose,
  onSuccess,
  productId,
}: EditProductFormProps) {
  return (
    <ProductFormBase
      mode="edit"
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
      productId={productId}
    />
  );
}
