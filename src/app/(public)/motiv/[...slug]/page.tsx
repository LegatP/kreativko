"use client";

import { notFound, useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";
import products, { garmet } from "@/products";
import ProductPageLayout from "@/components/layout/ProductPageLayout";
import CanvasModel from "@/components/canvas";
import { Product } from "@/types/product.types";
import ProductCustomization from "@/components/ProductConfigurator/ProductCustomization";
import {
  trackProductView,
  trackDesignSelected,
} from "@/lib/firebase/analytics";
import DesignConfigurator from "@/components/ProductConfigurator/DesignConfigurator";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { Design } from "@/components/common/DesignGallery/DesignGallery";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const searchParams = useSearchParams();
  const shirtColor = searchParams.get("barva")
    ? `#${searchParams.get("barva")}`
    : garmet.colors[0].hex;
  const { slug } = use(params);
  const sizes = garmet.sizes;
  const { createImage, isGenerating } = useImageGeneration();

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
  const [generatedDesigns, setGeneratedDesigns] = useState<Design[]>([]);

  useEffect(() => {
    if (!product) return;

    // Track product view
    trackProductView(product.id, product.name);

    // Initialize quantities for all sizes
    const quantities = Object.fromEntries(sizes.map((size) => [size, 0]));
    setItem({
      productId: product.id,
      name: product.name,
      color: shirtColor,
      designUrl: product.designs[0]?.url || "",
      quantities,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const featuredDesigns = useMemo(() => {
    if (!product) return [];

    return [...generatedDesigns, product.designs[0]].slice(0, 3);
  }, [generatedDesigns, product]);

  if (!product) {
    return notFound();
  }

  const { quantities, color, designUrl } = item;

  const handleDesignSelect = (imageUrl: string) => {
    trackDesignSelected(product.id, imageUrl);
    setItem((i) => ({ ...i, designUrl: imageUrl }));
  };

  const handleSubmit = async (
    prompt: string,
    promptType: "edit" | "create"
  ) => {
    console.log("Submitting prompt:", prompt, "Type:", promptType);
    // TODO: variables should consider original design while edit should take the current design
    try {
      let result = undefined;
      if (promptType === "create") {
        // TODO: gandle generating product prompts
        throw new Error("Create is not implemented yet.");
      } else if (promptType === "edit") {
        result = await createImage(prompt, [designUrl]);
      }
      if (result?.url) {
        const newDesign = {
          title: `Personaliziran motiv.`,
          url: result.url,
        };
        setGeneratedDesigns((prev) => [newDesign, ...prev]);
        handleDesignSelect(result.url); // Auto-select the generated design
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  return (
    <ProductPageLayout
      title={product.name}
      // description={product.description}
      leftColumn={
        <div className="space-y-6">
          <DesignConfigurator
            // @ts-expect-error - product type mismatch
            product={product}
            selectedDesignUrl={designUrl}
            onDesignSelect={handleDesignSelect}
            onSubmit={handleSubmit}
            isLoading={isGenerating}
            featuredDesigns={featuredDesigns}
            allDesigns={[...generatedDesigns, ...product.designs]}
          />
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
            isCheckoutDisabled={!designUrl || productsAmount === 0}
          />
        </div>
      }
      rightColumn={
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
    />
  );
}
