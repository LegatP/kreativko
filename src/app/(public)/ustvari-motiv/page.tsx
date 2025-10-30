"use client";

import { useEffect } from "react";
import { Product } from "@/types/product.types";
import CanvasModel from "@/components/canvas";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";
import products from "@/products";
import ProductPageLayout from "@/components/layout/ProductPageLayout";
import PromptCreator from "@/components/ProductConfigurator/PromptCreator";
import ProductCustomization from "@/components/ProductConfigurator/ProductCustomization";

export default function Page() {
  const product = products["sadez-zelenjava"];

  const {
    onOpen: openCheckout,
    productsAmount,
    item,
    setItem,
  } = useCheckoutContext();

  const { quantities, color, designUrl } = item;

  useEffect(() => {
    // Initialize product configuration
    const quantities = Object.fromEntries(
      product.sizes.map((size) => [size, 0])
    );
    setItem({
      productId: product.id,
      name: product.name,
      color: "#FFFFFF",
      designUrl:
        "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760025709663_ai_generated.png?alt=media&token=5382d01a-7d47-434a-b01f-74cd7bf6ecc4",
      quantities,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDesignGenerated = (imageUrl: string) => {
    setItem({ ...item, designUrl: imageUrl });
  };

  return (
    <ProductPageLayout
      title="Ustvari svoj motiv"
      description="Opiši motiv, izberi barvo in velikost ter naroči svojo unikatno majico."
      leftColumn={<PromptCreator onDesignGenerated={handleDesignGenerated} />}
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
          product={product}
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
        />
      }
    />
  );
}
