"use client";

import ProductCard from "@/components/common/ProductCard";
import { garment } from "@/config/garment";
import { useParams } from "next/navigation";
import { useProductsByCategoryOnce } from "@/db/products";
import { useCategoryBySlug } from "@/db/product-categories";

// Display price assumes 1 print position (minimum)
const displayPrice =
  garment.pricing.basePrice + garment.pricing.printPositionPrice;

export default function Page() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  const [categories, categoryLoading, categoryError] =
    useCategoryBySlug(categorySlug);
  const category = categories?.[0];

  const [products, productsLoading, productsError] =
    useProductsByCategoryOnce(category?.id);

  const loading = categoryLoading || productsLoading;
  const error =
    categoryError ||
    productsError ||
    (categories && categories.length === 0 ? "Category not found" : null);

  if (loading || error) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <section
        className="bg-primary-50 py-4 lg:py-8"
        style={{
          backgroundImage: "url('/assets/bg-transparent.png')",
        }}
      >
        <div className="container mx-auto sm:text-center max-w-7xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 lg:mb-4 w-full px-4">
            {category?.name || ""}
          </h1>
          <p className="text-xl md:text-2xl font-bold text-primary-900 w-full px-4">
            Izberi motiv. Prilagodi po svojih željah. Naroči.
          </p>
        </div>
      </section>
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 max-w-6xl mx-auto my-4 md:my-8 gap-2 md:gap-4">
        {products &&
          products.length > 0 &&
          products.map((item, index) => (
            <ProductCard
              key={item.id || index}
              title={item.name}
              price={displayPrice}
              imageUrl={item.designs[0]?.url || ""}
              slug={item.slug}
            />
          ))}
      </section>
    </div>
  );
}
