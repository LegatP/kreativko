"use client";

import { useMemo } from "react";
import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/common/ProductCard";
import CategorySidebar, {
  MobileCategoryChips,
} from "@/components/common/CategorySidebar";
import { garment } from "@/config/garment";
import { useProducts } from "@/db/products";
import { useCategories } from "@/db/product-categories";

const displayPrice =
  garment.pricing.basePrice + garment.pricing.printPositionPrice;

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  const [categories, categoriesLoading] = useCategories();
  const [products, productsLoading] = useProducts();

  const loading = categoriesLoading || productsLoading;

  // Find current category
  const category = useMemo(
    () => categories?.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  // Calculate product counts for sidebar
  const productCounts = useMemo(() => {
    if (!products || !categories) return {};
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = products.filter((product) =>
        product.categoryIds?.includes(cat.id)
      ).length;
    });
    return counts;
  }, [products, categories]);

  // Filter products for this category
  const categoryProducts = useMemo(() => {
    if (!products || !category) return [];
    return products.filter((product) =>
      product.categoryIds?.includes(category.id)
    );
  }, [products, category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground">Kategorija ni bila najdena.</p>
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
            {category.name}
          </h1>
          <p className="text-foreground">
            Izberi motiv. Prilagodi po svojih željah. Naroči.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Mobile category chips */}
          {categories && categories.length > 0 && (
            <MobileCategoryChips
              categories={categories}
              currentCategorySlug={categorySlug}
            />
          )}

          <div className="flex gap-8">
            {/* Category sidebar - LEFT side, desktop only */}
            {categories && categories.length > 0 && (
              <div className="hidden lg:block w-52 flex-shrink-0">
                <CategorySidebar
                  categories={categories}
                  currentCategorySlug={categorySlug}
                  productCounts={productCounts}
                />
              </div>
            )}

            {/* Products grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryProducts.map((product) => (
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
              {categoryProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-foreground">
                    Ni izdelkov v tej kategoriji.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
