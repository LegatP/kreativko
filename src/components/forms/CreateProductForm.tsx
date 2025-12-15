"use client";

import React, { useState, useEffect } from "react";
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
import { createProduct, ProductVariable, ProductDesign } from "@/db/products";
import { ProductCategory } from "@/db/product-categories";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { collection, query, getDocs } from "firebase/firestore";
import db from "@/lib/firebase/firestore";
import { generateSlug } from "@/utils/slug.utils";

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
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    defaultShirtColor: "#F0F1F6",
    prompt: "",
    promptType: "edit" as "create" | "edit",
  });

  const [variables, setVariables] = useState<ProductVariable[]>([]);
  const [designs, setDesigns] = useState<ProductDesign[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryCollection = collection(db, "product_categories");
        const categorySnapshot = await getDocs(query(categoryCollection));
        const categoryList = categorySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as ProductCategory[];
        setCategories(categoryList);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const addVariable = () => {
    setVariables((prev) => [
      ...prev,
      {
        key: `variable_${prev.length + 1}`,
        title: "",
        type: "string",
        placeholder: "",
        suggestions: [],
      },
    ]);
  };

  const updateVariable = (
    index: number,
    field: keyof ProductVariable,
    value: string | string[] | undefined
  ) => {
    setVariables((prev) =>
      prev.map((variable, i) =>
        i === index ? { ...variable, [field]: value } : variable
      )
    );
  };

  const removeVariable = (index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  };

  const addDesign = () => {
    setDesigns((prev) => [...prev, { title: "", url: "" }]);
  };

  const updateDesign = (
    index: number,
    field: keyof ProductDesign,
    value: string
  ) => {
    setDesigns((prev) =>
      prev.map((design, i) =>
        i === index ? { ...design, [field]: value } : design
      )
    );
  };

  const removeDesign = (index: number) => {
    setDesigns((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.slug.trim() ||
      !formData.prompt.trim()
    )
      return;

    setLoading(true);
    try {
      await createProduct({
        slug: formData.slug.trim(),
        name: formData.name.trim(),
        defaultShirtColor: formData.defaultShirtColor,
        variables: variables.filter((v) => v.key.trim() && v.title.trim()),
        prompt: formData.prompt.trim(),
        promptType: formData.promptType,
        designs: designs.filter((d) => d.title.trim() && d.url.trim()),
        categoryIds:
          selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      });

      // Reset form
      setFormData({
        slug: "",
        name: "",
        defaultShirtColor: "#F0F1F6",
        prompt: "",
        promptType: "create",
      });
      setVariables([]);
      setDesigns([]);
      setSelectedCategoryIds([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      slug: "",
      name: "",
      defaultShirtColor: "#F0F1F6",
      prompt: "",
      promptType: "create",
    });
    setVariables([]);
    setDesigns([]);
    setSelectedCategoryIds([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="top-center"
      size="4xl"
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
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            Ustvari nov izdelek
          </ModalHeader>
          <ModalBody className="gap-4 max-h-[60vh] overflow-y-auto">
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

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Privzeta barva majice"
                type="color"
                value={formData.defaultShirtColor}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, defaultShirtColor: value }))
                }
                required
              />
            </div>

            <Textarea
              label="AI Prompt"
              placeholder="Opis za generiranje slike"
              value={formData.prompt}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, prompt: value }))
              }
              required
              minRows={3}
            />

            <Select
              label="Tip prompta"
              selectedKeys={[formData.promptType]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as "create" | "edit";
                setFormData((prev) => ({ ...prev, promptType: value }));
              }}
            >
              <SelectItem key="create">Create</SelectItem>
              <SelectItem key="edit">Edit</SelectItem>
            </Select>

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

            {/* Variables Section */}
            <Card className="w-full min-h-[350px]">
              <CardHeader className="flex justify-between items-center pb-3">
                <h4 className="text-medium font-medium">Spremenljivke</h4>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<PlusIcon size={16} />}
                  onPress={addVariable}
                >
                  Dodaj spremenljivko
                </Button>
              </CardHeader>
              <Divider />
              <CardBody className="pt-0">
                {variables.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">Ni spremenljivk</p>
                ) : (
                  <div className="space-y-3">
                    {variables.map((variable, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg border-default-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="text-sm font-medium">
                            Spremenljivka {index + 1}
                          </h5>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            isIconOnly
                            onPress={() => removeVariable(index)}
                          >
                            <TrashIcon size={16} />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Input
                            size="sm"
                            label="Ključ"
                            value={variable.key}
                            onValueChange={(value) =>
                              updateVariable(index, "key", value)
                            }
                          />
                          <Input
                            size="sm"
                            label="Naslov"
                            value={variable.title}
                            onValueChange={(value) =>
                              updateVariable(index, "title", value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Select
                            size="sm"
                            label="Tip"
                            selectedKeys={[variable.type || "string"]}
                            onSelectionChange={(keys) => {
                              const value = Array.from(keys)[0] as
                                | "string"
                                | "number";
                              updateVariable(index, "type", value);
                            }}
                          >
                            <SelectItem key="string">String</SelectItem>
                            <SelectItem key="number">Number</SelectItem>
                          </Select>
                          <Input
                            size="sm"
                            label="Placeholder"
                            value={variable.placeholder}
                            onValueChange={(value) =>
                              updateVariable(index, "placeholder", value)
                            }
                          />
                        </div>
                        <Input
                          size="sm"
                          label="Predlogi (ločeni z vejico)"
                          value={variable.suggestions?.join(", ") + "," || ""}
                          onValueChange={(value) =>
                            updateVariable(
                              index,
                              "suggestions",
                              value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            )
                          }
                        />
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
                {designs.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">Ni dizajnov</p>
                ) : (
                  <div className="space-y-3">
                    {designs.map((design, index) => (
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
                            onPress={() => removeDesign(index)}
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
              isDisabled={
                !formData.name.trim() ||
                !formData.slug.trim() ||
                !formData.prompt.trim()
              }
            >
              Ustvari
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
