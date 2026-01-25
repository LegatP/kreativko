"use client";

import { Button, Spinner } from "@heroui/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import ProductCard from "@/components/common/ProductCard";
import { useConfigContext } from "@/components/contexts/ConfigContext";
import { useProductsByCategoryOnce } from "@/db/products";
import { ProductCategory } from "@/db/product-categories";
import { garment } from "@/config/garment";
import { getCategoryIcon } from "@/utils/category-icons";
import ROUTES from "@/utils/routes.utils";

const displayPrice =
  garment.pricing.basePrice + garment.pricing.printPositionPrice;

const PRODUCTS_PER_CATEGORY = 4;

interface CategoryRowProps {
  category: ProductCategory;
  index: number;
}

const CategoryRow = ({ category, index }: CategoryRowProps) => {
  const [products, loading] = useProductsByCategoryOnce(category.id);
  const Icon = getCategoryIcon(category.slug);

  const displayProducts = products?.slice(0, PRODUCTS_PER_CATEGORY) || [];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 md:mb-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
              <Icon className="w-5 h-5 text-primary" weight="duotone" />
            </div>
          )}
          <h3 className="text-xl md:text-2xl font-bold text-primary-900">
            {category.name}
          </h3>
        </div>
        <Button
          as={Link}
          href={`/${category.slug}`}
          variant="light"
          color="primary"
          size="sm"
          className="self-start sm:self-auto"
          endContent={<ArrowRightIcon weight="bold" />}
        >
          Prikaži vse
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name}
            price={displayPrice}
            imageUrl={product.designs[0]?.url || ""}
            slug={product.slug}
          />
        ))}
      </div>
    </div>
  );
};

const CategoriesSection = () => {
  const { landingPageCategories, landingPageCategoriesLoading } =
    useConfigContext();

  if (landingPageCategoriesLoading) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4 flex justify-center">
          <Spinner color="primary" size="lg" />
        </div>
      </section>
    );
  }

  if (!landingPageCategories || landingPageCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:pt-14 md:pb-20 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary-900 mb-3">
          Prilagodi motiv
        </h2>
        <p className="text-center text-foreground mb-8 md:mb-12">
          Izberi motiv in ga prilagodi po svojih željah.
        </p>
        {landingPageCategories.map((category, index) => (
          <CategoryRow key={category.id} category={category} index={index} />
        ))}
        <div className="flex justify-center mt-8">
          <Button
            as={Link}
            href={ROUTES.shop}
            color="primary"
            variant="bordered"
            size="lg"
            endContent={<ArrowRightIcon weight="bold" />}
          >
            Pokaži vse
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
