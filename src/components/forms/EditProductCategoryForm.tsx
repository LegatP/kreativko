"use client";

import React, { useState, useEffect } from "react";
import {
  updateProductCategory,
  getProductCategory,
} from "@/db/product-categories";
import { generateSlug } from "@/utils/slug.utils";
import ProductCategoryFormModal from "./ProductCategoryFormModal";

interface EditProductCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categoryId?: string;
}

export default function EditProductCategoryForm({
  isOpen,
  onClose,
  onSuccess,
  categoryId,
}: EditProductCategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const slug = generateSlug(name);

  // Load category data when modal opens
  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId || !isOpen) return;

      setLoadingData(true);
      try {
        const category = await getProductCategory(categoryId);
        if (category) {
          setName(category.name);
          setDescription(category.description || "");
        }
      } catch (error) {
        console.error("Error loading category:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadCategory();
  }, [categoryId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !categoryId) return;

    setLoading(true);
    try {
      await updateProductCategory(categoryId, {
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
      console.error("Error updating product category:", error);
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
      title="Uredi kategorijo izdelkov"
      name={name}
      onNameChange={handleNameChange}
      description={description}
      onDescriptionChange={handleDescriptionChange}
      slug={slug}
      loading={loading}
      loadingData={loadingData}
      submitButtonText="Posodobi"
      isValid={!!(name.trim() && slug.trim())}
    />
  );
}
