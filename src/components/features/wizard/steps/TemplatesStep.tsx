"use client";

import { useMemo } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useProductsByCategoryOnce } from "@/db/products";
import { useConfigContext } from "@/components/contexts/ConfigContext";
import { getCategoryIcon } from "@/utils/category-icons";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface TemplatesStepProps {
  selectedCategory?: string; // Category ID or undefined for all products
  onCategorySelect: (categoryId: string) => void;
  onProductSelect?: (productId: string) => void;
}

export default function TemplatesStep({
  selectedCategory,
  onCategorySelect,
  onProductSelect,
}: TemplatesStepProps) {
  // Get categories from config context (configured in admin dashboard)
  const { wizardCategories, wizardCategoriesLoading } = useConfigContext();

  // Use existing hook for fetching products
  const categoryToFetch = useMemo(
    () => (selectedCategory === "all" ? undefined : selectedCategory),
    [selectedCategory]
  );
  const [products, productsLoading] = useProductsByCategoryOnce(categoryToFetch);

  // Loading state for categories (when no category is selected yet)
  if (!selectedCategory && wizardCategoriesLoading) {
    return <LoadingSpinner />;
  }

  // Show products if category is selected
  if (selectedCategory) {
    if (productsLoading || !products) {
      return <LoadingSpinner />;
    }

    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-default-500">
            Ni najdenih motivov v tej kategoriji.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {products.map((product, index) => {
          // Get first design image if available
          const designImage = product.designs?.[0]?.url;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="aspect-square"
            >
              <Card
                isPressable
                onPress={() => onProductSelect?.(product.id)}
                className="border-2 border-transparent hover:border-primary transition-colors h-full w-full"
              >
                <CardBody className="p-0 h-full">
                  <div className="w-full h-full bg-gradient-to-br from-default-100 to-default-200 rounded-lg relative overflow-hidden">
                    {designImage && (
                      <Image
                        src={designImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Show categories from config (configured in admin dashboard)
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {wizardCategories.map((category, index) => {
          const Icon = getCategoryIcon(category.slug);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full w-full"
            >
              <Card
                isPressable
                onPress={() => onCategorySelect(category.id)}
                className="border-2 border-transparent hover:border-primary transition-colors h-full w-full"
              >
                <CardBody className="flex flex-col items-center text-center gap-2 p-4 h-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                    <Icon size={24} weight="duotone" />
                  </div>
                  <div className="w-full flex-1 flex flex-col">
                    <h4 className="font-semibold text-foreground text-sm">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-xs text-default-500 mt-0.5 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Show all products button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end -mb-3"
      >
        <Button
          variant="light"
          color="primary"
          onPress={() => onCategorySelect("all")}
          endContent={<ArrowRightIcon size={16} weight="bold" />}
        >
          Prikaži vse motive
        </Button>
      </motion.div>
    </div>
  );
}
