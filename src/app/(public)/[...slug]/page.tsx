"use client";

import { notFound } from "next/navigation";
import { use, useEffect } from "react";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";
import products, { productConfig } from "@/products";
import ProductPageLayout from "@/components/layout/ProductPageLayout";
import CanvasModel from "@/components/canvas";
import { Product } from "@/types/product.types";
import ProductCustomization from "@/components/ProductConfigurator/ProductCustomization";
import {
  trackProductView,
  trackDesignSelected,
} from "@/lib/firebase/analytics";
import DesignConfigurator from "@/components/ProductConfigurator/DesignConfigurator";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params);
  const sizes = productConfig.sizes;

  const {
    onOpen: openCheckout,
    productsAmount,
    item,
    setItem,
  } = useCheckoutContext();

  // Validate slug exists
  if (!slug || slug.length < 1) {
    notFound();
  }

  // Get product slug from URL (first part of slug)
  const productSlug = slug[0];

  // Get product from products.ts
  const product = Object.values(products).find((p) => p.slug === productSlug);

  // Scroll to top on product change
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [productSlug]);

  useEffect(() => {
    if (!product) return;

    // Track product view
    trackProductView(product.id, product.name);

    // Initialize quantities for all sizes
    const quantities = Object.fromEntries(sizes.map((size) => [size, 0]));
    setItem({
      productId: product.id,
      name: product.name,
      color: "#FFFFFF",
      designUrl: product.designs[0]?.imageUrl || "",
      quantities,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) {
    notFound();
  }

  const { quantities, color, designUrl } = item;

  const handleDesignSelect = (imageUrl: string) => {
    trackDesignSelected(product.id, imageUrl);
    setItem((i) => ({ ...i, designUrl: imageUrl }));
  };

  return (
    <ProductPageLayout
      title={product.name}
      description={product.description}
      leftColumn={
        <DesignConfigurator
          product={product}
          selectedDesignUrl={designUrl}
          onDesignSelect={handleDesignSelect}
        />
      }
      centerColumn={
        <div className="w-full max-w-full overflow-hidden">
          <div className="aspect-square w-full mx-auto">
            <CanvasModel
              product={Product.Shirt}
              color={color}
              frontPatternUrl={designUrl}
            />
          </div>
        </div>
      }
      rightColumn={
        <ProductCustomization
          name={product.name}
          quantities={quantities}
          onColorChange={(c) => setItem({ ...item, color: c })}
          onSizeChange={(size, value) =>
            setItem({
              ...item,
              quantities: { ...quantities, [size]: value },
            })
          }
          productsAmount={productsAmount}
          onCheckout={openCheckout}
          productId={product.id}
          color={color}
        />
      }
    />
  );
}
