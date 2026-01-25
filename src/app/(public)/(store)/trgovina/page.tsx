"use client";

import { useMemo } from "react";
import { Spinner } from "@heroui/react";
import ProductCard from "@/components/common/ProductCard";
import CategorySidebar, {
  MobileCategoryChips,
} from "@/components/common/CategorySidebar";
import { useCategories } from "@/db/product-categories";
import { useProducts } from "@/db/products";
import { garment } from "@/config/garment";

const displayPrice =
  garment.pricing.basePrice + garment.pricing.printPositionPrice;

export default function StorePage() {
  const [categories, categoriesLoading] = useCategories();
  const [products, productsLoading] = useProducts();

  const loading = categoriesLoading || productsLoading;

  const productCounts = useMemo(() => {
    if (!products || !categories) return {};
    const counts: Record<string, number> = {};
    categories.forEach((category) => {
      counts[category.id] = products.filter((product) =>
        product.categoryIds?.includes(category.id)
      ).length;
    });
    return counts;
  }, [products, categories]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section
        className="bg-primary-50 py-6 lg:py-10"
        style={{
          backgroundImage: "url('/assets/bg-transparent.png')",
        }}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
            Trgovina
          </h1>
          <p className="text-default-500">
            Poišči motiv zase in ga prilagodi po svojih željah ali naroči takega
            koj je.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Mobile category chips */}
          {categories && categories.length > 0 && (
            <MobileCategoryChips categories={categories} />
          )}

          <div className="flex gap-8">
            {/* Category sidebar - LEFT side, desktop only */}
            {categories && categories.length > 0 && (
              <div className="hidden lg:block w-52 flex-shrink-0">
                <CategorySidebar
                  categories={categories}
                  productCounts={productCounts}
                />
              </div>
            )}

            {/* Products grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products?.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.name}
                    price={displayPrice}
                    imageUrl={product.designs[0]?.url || ""}
                    slug={product.slug}
                  />
                ))}
              </div>

              {/* Empty state */}
              {(!products || products.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-foreground">Ni izdelkov v trgovini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
