"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import {
  createProduct,
  updateProduct,
  getProduct,
  ProductDesign,
  PromptSuggestion,
  PromptSuggestionVariable,
} from "@/db/products";
import { useCategoriesOnce } from "@/db/product-categories";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { generateSlug } from "@/utils/slug.utils";
import { useArrayField } from "@/hooks/useArrayField";

interface ProductFormData {
  slug: string;
  name: string;
}

const INITIAL_FORM_DATA: ProductFormData = {
  slug: "",
  name: "",
};

const MODAL_CLASSNAMES = {
  body: "py-6",
  backdrop: "bg-black/50 backdrop-opacity-40",
  base: "border-gray-200 bg-white text-gray-900",
  header: "border-b-[1px] border-gray-200",
  footer: "border-t-[1px] border-gray-200",
  closeButton: "hover:bg-gray-100 active:bg-gray-200",
};

interface ProductFormBaseProps {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productId?: string;
}

export default function ProductFormBase({
  mode,
  isOpen,
  onClose,
  onSuccess,
  productId,
}: ProductFormBaseProps) {
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [categories = [], categoriesLoading] = useCategoriesOnce();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Use useArrayField for prompt suggestions and designs
  const promptSuggestions = useArrayField<PromptSuggestion>([]);
  const designs = useArrayField<ProductDesign>([]);

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Uredi izdelek" : "Ustvari nov izdelek";
  const submitLabel = isEditMode ? "Posodobi" : "Ustvari";

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    promptSuggestions.reset([]);
    designs.reset([]);
    setSelectedCategoryIds([]);
  }, [promptSuggestions, designs]);

  // Load product data (for edit mode)
  useEffect(() => {
    const loadProduct = async () => {
      if (!isOpen) return;

      if (isEditMode && productId) {
        setLoadingProduct(true);
        try {
          const product = await getProduct(productId);
          if (product) {
            setFormData({
              slug: product.slug,
              name: product.name,
            });
            promptSuggestions.reset(product.promptSuggestions || []);
            designs.reset(product.designs || []);
            setSelectedCategoryIds(product.categoryIds || []);
          }
        } catch (error) {
          console.error("Error loading product:", error);
        } finally {
          setLoadingProduct(false);
        }
      } else {
        // Reset form for create mode
        resetForm();
      }
    };

    loadProduct();
  }, [isOpen, productId, isEditMode]);

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  // Prompt Suggestions functions
  const addPromptSuggestion = () => {
    promptSuggestions.add({ prompt: "", variables: [] });
  };

  const updatePromptSuggestion = (index: number, prompt: string) => {
    promptSuggestions.update(index, { prompt });
  };

  const addVariableToSuggestion = (suggestionIndex: number) => {
    const suggestion = promptSuggestions.items[suggestionIndex];
    promptSuggestions.update(suggestionIndex, {
      variables: [
        ...suggestion.variables,
        {
          key: `var_${suggestion.variables.length + 1}`,
          label: "",
          placeholder: "",
          defaultValue: "",
        },
      ],
    });
  };

  const updateVariableInSuggestion = (
    suggestionIndex: number,
    variableIndex: number,
    field: keyof PromptSuggestionVariable,
    value: string
  ) => {
    const suggestion = promptSuggestions.items[suggestionIndex];
    promptSuggestions.update(suggestionIndex, {
      variables: suggestion.variables.map((variable, vi) =>
        vi === variableIndex ? { ...variable, [field]: value } : variable
      ),
    });
  };

  const removeVariableFromSuggestion = (
    suggestionIndex: number,
    variableIndex: number
  ) => {
    const suggestion = promptSuggestions.items[suggestionIndex];
    promptSuggestions.update(suggestionIndex, {
      variables: suggestion.variables.filter((_, vi) => vi !== variableIndex),
    });
  };

  // Design functions
  const addDesign = () => {
    designs.add({ title: "", url: "" });
  };

  const updateDesign = (
    index: number,
    field: keyof ProductDesign,
    value: string
  ) => {
    designs.update(index, { [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = formData.name.trim();
    if (!isValid) return;
    if (isEditMode && !productId) return;

    setLoading(true);
    try {
      const productData = {
        slug: formData.slug.trim(),
        name: formData.name.trim(),
        promptSuggestions: promptSuggestions.items.filter((s) =>
          s.prompt.trim()
        ),
        designs: isEditMode
          ? designs.items.filter((d) => d.url.trim())
          : designs.items.filter((d) => d.title.trim() && d.url.trim()),
        categoryIds:
          selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      };

      if (isEditMode && productId) {
        await updateProduct(productId, productData);
      } else {
        await createProduct(productData);
        resetForm();
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} product:`,
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!isEditMode) {
      resetForm();
    }
    onClose();
  };

  if (loadingProduct || categoriesLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        placement="top-center"
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalBody className="py-8 text-center">Nalagam podatke...</ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const isSubmitDisabled = !formData.name.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="top-center"
      size="4xl"
      scrollBehavior="inside"
      classNames={MODAL_CLASSNAMES}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody className="gap-4 max-h-[60vh] overflow-y-auto">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4">
              <Input
                autoFocus
                label="Ime izdelka"
                placeholder="Vnesite ime izdelka"
                value={formData.name}
                onValueChange={handleNameChange}
                required
              />
              <Input
                label="Slug"
                value={formData.slug}
                description="URL-friendly identifikator (avtomatsko generirano)"
                isReadOnly
                variant="bordered"
              />
            </div>

            {/* Categories Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Kategorije (opcijsko)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategoryIds.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return category ? (
                    <Chip
                      key={categoryId}
                      color="primary"
                      variant="flat"
                      onClose={() => {
                        setSelectedCategoryIds((prev) =>
                          prev.filter((id) => id !== categoryId)
                        );
                      }}
                    >
                      {category.name}
                    </Chip>
                  ) : null;
                })}
              </div>
              <Select
                placeholder="Izberi kategorije"
                selectedKeys={selectedCategoryIds}
                onSelectionChange={(keys) => {
                  setSelectedCategoryIds(Array.from(keys) as string[]);
                }}
                selectionMode="multiple"
              >
                {categories.map((category) => (
                  <SelectItem key={category.id}>{category.name}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Prompt Suggestions Section */}
            <Card className="w-full min-h-[350px]">
              <CardHeader className="flex justify-between items-center pb-3">
                <div>
                  <h4 className="text-medium font-medium">Predlogi promptov</h4>
                  <p className="text-xs text-gray-500">
                    Uporabi {"{{variable}}"} za spremenljivke v promptu
                  </p>
                </div>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<PlusIcon size={16} />}
                  onPress={addPromptSuggestion}
                >
                  Dodaj predlog
                </Button>
              </CardHeader>
              <Divider />
              <CardBody className="pt-0">
                {promptSuggestions.items.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">Ni predlogov</p>
                ) : (
                  <div className="space-y-4">
                    {promptSuggestions.items.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg border-default-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="text-sm font-medium">
                            Predlog {index + 1}
                          </h5>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            isIconOnly
                            onPress={() => promptSuggestions.remove(index)}
                          >
                            <TrashIcon size={16} />
                          </Button>
                        </div>
                        <Textarea
                          size="sm"
                          label="Prompt"
                          placeholder="Ustvari motiv za {{ime}} ki praznuje {{starost}} let"
                          value={suggestion.prompt}
                          onValueChange={(value) =>
                            updatePromptSuggestion(index, value)
                          }
                          minRows={2}
                          className="mb-3"
                        />

                        {/* Variables for this suggestion */}
                        <div className="ml-4 border-l-2 border-default-200 pl-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-600">
                              Spremenljivke
                            </span>
                            <Button
                              size="sm"
                              variant="light"
                              startContent={<PlusIcon size={12} />}
                              onPress={() => addVariableToSuggestion(index)}
                              className="h-6 text-xs"
                            >
                              Dodaj
                            </Button>
                          </div>
                          {suggestion.variables.length === 0 ? (
                            <p className="text-xs text-gray-400">
                              Ni spremenljivk
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {suggestion.variables.map((variable, vi) => (
                                <div
                                  key={vi}
                                  className="flex gap-2 items-start"
                                >
                                  <Input
                                    size="sm"
                                    label="Ključ"
                                    placeholder="ime"
                                    value={variable.key}
                                    onValueChange={(value) =>
                                      updateVariableInSuggestion(
                                        index,
                                        vi,
                                        "key",
                                        value
                                      )
                                    }
                                    className="flex-1"
                                  />
                                  <Input
                                    size="sm"
                                    label="Oznaka"
                                    placeholder="Ime"
                                    value={variable.label}
                                    onValueChange={(value) =>
                                      updateVariableInSuggestion(
                                        index,
                                        vi,
                                        "label",
                                        value
                                      )
                                    }
                                    className="flex-1"
                                  />
                                  <Input
                                    size="sm"
                                    label="Placeholder"
                                    placeholder="Vnesi ime..."
                                    value={variable.placeholder}
                                    onValueChange={(value) =>
                                      updateVariableInSuggestion(
                                        index,
                                        vi,
                                        "placeholder",
                                        value
                                      )
                                    }
                                    className="flex-1"
                                  />
                                  <Input
                                    size="sm"
                                    label="Privzeta vrednost"
                                    placeholder="Marko"
                                    value={variable.defaultValue}
                                    onValueChange={(value) =>
                                      updateVariableInSuggestion(
                                        index,
                                        vi,
                                        "defaultValue",
                                        value
                                      )
                                    }
                                    className="flex-1"
                                  />
                                  <Button
                                    size="sm"
                                    color="danger"
                                    variant="light"
                                    isIconOnly
                                    onPress={() =>
                                      removeVariableFromSuggestion(index, vi)
                                    }
                                    className="mt-6"
                                  >
                                    <TrashIcon size={14} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Designs Section */}
            <Card className="w-full min-h-[200px]">
              <CardHeader className="flex justify-between items-center pb-3">
                <h4 className="text-medium font-medium">Dizajni</h4>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<PlusIcon size={16} />}
                  onPress={addDesign}
                >
                  Dodaj dizajn
                </Button>
              </CardHeader>
              <Divider />
              <CardBody className="pt-0">
                {designs.items.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">Ni dizajnov</p>
                ) : (
                  <div className="space-y-3">
                    {designs.items.map((design, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg border-default-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="text-sm font-medium">
                            Dizajn {index + 1}
                          </h5>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            isIconOnly
                            onPress={() => designs.remove(index)}
                          >
                            <TrashIcon size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <Input
                            size="sm"
                            label="Naslov"
                            value={design.title}
                            onValueChange={(value) =>
                              updateDesign(index, "title", value)
                            }
                          />
                          <Input
                            size="sm"
                            label="URL"
                            value={design.url}
                            onValueChange={(value) =>
                              updateDesign(index, "url", value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={handleClose}>
              Prekliči
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              isDisabled={isSubmitDisabled}
            >
              {submitLabel}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
