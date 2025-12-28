"use client";

import React, { useState } from "react";
import { createProductCategory } from "@/db/product-categories";
import { generateSlug } from "@/utils/slug.utils";
import ProductCategoryFormModal from "./ProductCategoryFormModal";

interface CreateProductCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateProductCategoryForm({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductCategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const slug = generateSlug(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setLoading(true);
    try {
      await createProductCategory({
        name: name.trim(),
        slug: slug,
        description: description.trim() || undefined,
      });

      // Reset form
      setName("");
      setDescription("");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating product category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <ProductCategoryFormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Ustvari novo kategorijo izdelkov"
      name={name}
      onNameChange={handleNameChange}
      description={description}
      onDescriptionChange={handleDescriptionChange}
      slug={slug}
      loading={loading}
      submitButtonText="Ustvari"
      isValid={!!(name.trim() && slug.trim())}
    />
  );
}
