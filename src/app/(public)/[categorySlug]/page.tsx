"use client";

import ProductCard from "@/components/common/ProductCard";
import { BASE_PRODUCT_PRICE } from "@/components/contexts/AppContext/CheckoutContext";
import { useParams } from "next/navigation";
import { collection, query, where } from "firebase/firestore";
import db from "@/lib/firebase/firestore";
import { Product, productConverter } from "@/db/products";
import {
  ProductCategory,
  productCategoryConverter,
} from "@/db/product-categories";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useMemo } from "react";

export default function Page() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  // Query for category by slug
  const categoryQuery = useMemo(
    () =>
      categorySlug
        ? query(
            collection(db, "product_categories"),
            where("slug", "==", categorySlug)
          ).withConverter(productCategoryConverter)
        : null,
    [categorySlug]
  );

  const [categoryData, categoryLoading, categoryError] =
    useCollectionDataOnce(categoryQuery);

  const category = categoryData?.[0] as ProductCategory | undefined;

  // Query for products by category ID
  const productsQuery = useMemo(
    () =>
      category?.id
        ? query(
            collection(db, "products"),
            where("categoryIds", "array-contains", category.id)
          ).withConverter(productConverter)
        : null,
    [category?.id]
  );

  const [products, productsLoading, productsError] =
    useCollectionDataOnce(productsQuery);

  const loading = categoryLoading || productsLoading;
  const error =
    categoryError ||
    productsError ||
    (categoryData && categoryData.length === 0 ? "Category not found" : null);

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
              price={BASE_PRODUCT_PRICE}
              imageUrl={item.designs[0]?.url || ""}
              slug={item.slug}
            />
          ))}
      </section>
    </div>
  );
}
