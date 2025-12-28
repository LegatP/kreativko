"use client";

import { useMemo } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import {
  BalloonIcon,
  TextAaIcon,
  HeartIcon,
  ConfettiIcon,
  SunIcon,
  UsersThreeIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useProductsByCategoryOnce } from "@/db/products";
import { useCategoriesOnce } from "@/db/product-categories";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Stagger animation helper for grid items
const getStaggerProps = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * 0.05 },
});

// Hardcoded categories for Slovenian t-shirt market
// These use slugs for display, but we fetch the actual Firestore IDs for filtering
const CATEGORIES = [
  {
    slug: "majice-za-rojstni-dan",
    name: "Rojstni dan",
    description: "Motivi za obletnice in praznovanja",
    icon: BalloonIcon,
  },
  {
    slug: "motivi-z-napisi",
    name: "Napisi",
    description: "Motivi z napisom po želji",
    icon: TextAaIcon,
  },
  {
    slug: "za-pare",
    name: "Za pare",
    description: "Motivi za pare in zaljubljene",
    icon: HeartIcon,
  },
  {
    slug: "smešni-motivi",
    name: "Smešni motivi",
    description: "Za vse ljubitelje smeha in zabave",
    icon: ConfettiIcon,
  },
  {
    slug: "za-vsak-dan",
    name: "Za vsak dan",
    description: "Motivi za vsakdanjo uporabo",
    icon: SunIcon,
  },
  {
    slug: "družinski",
    name: "Družinski",
    description: "Motivi za družinske člane",
    icon: UsersThreeIcon,
  },
];

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
  // Fetch categories to map slug -> Firestore ID
  const [categories] = useCategoriesOnce();

  // Build slug to ID mapping from fetched categories
  const slugToIdMap = useMemo(() => {
    if (!categories) return {};
    const mapping: Record<string, string> = {};
    categories.forEach((cat) => {
      mapping[cat.slug] = cat.id;
    });
    return mapping;
  }, [categories]);

  // Use existing hook for fetching products
  const categoryToFetch = useMemo(
    () => (selectedCategory === "all" ? undefined : selectedCategory),
    [selectedCategory]
  );
  const [products, loading] = useProductsByCategoryOnce(categoryToFetch);

  // Show products if category is selected
  if (selectedCategory) {
    if (loading || !products) {
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

  // Helper to get Firestore ID from slug, fallback to slug if not found
  const getCategoryId = (slug: string) => slugToIdMap[slug] || slug;

  // Show hardcoded categories
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                isPressable
                onPress={() => onCategorySelect(getCategoryId(category.slug))}
                className="border-2 border-transparent hover:border-primary transition-colors"
              >
                <CardBody className="flex flex-col items-center text-center gap-2 p-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                    <Icon size={24} weight="duotone" />
                  </div>
                  <div className="w-full">
                    <h4 className="font-semibold text-foreground text-sm">
                      {category.name}
                    </h4>
                    <p className="text-xs text-default-500 mt-0.5 h-8 line-clamp-2">
                      {category.description}
                    </p>
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
