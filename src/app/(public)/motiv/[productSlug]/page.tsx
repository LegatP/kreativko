"use client";

import { notFound, useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { useCheckoutContext } from "@/components/contexts/CheckoutContext";
import { garmet } from "@/products";
import { useProductBySlug } from "@/db/products";
import ProductPageLayout from "@/components/layout/ProductPageLayout";
import CanvasModel from "@/components/canvas";
import PreviewToolbar from "@/components/canvas/PreviewToolbar";
import { useCanvasControls } from "@/components/canvas/useCanvasControls";
import { Product as ProductType } from "@/types/product.types";
import ProductCustomization from "@/components/ProductConfigurator/ProductCustomization";
import {
  trackProductView,
  trackDesignSelected,
} from "@/lib/firebase/analytics";
import { Design } from "@/components/common/DesignGallery/DesignGallery";
import DesignGallery from "@/components/common/DesignGallery";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { EditDesignModal } from "@/components/features/product/DesignEditor";
import { PaintBrushIcon } from "@phosphor-icons/react";
import Image from "next/image";

export default function Page({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const searchParams = useSearchParams();
  const shirtColor = searchParams.get("barva")
    ? `#${searchParams.get("barva")}`
    : garmet.colors[0].hex;
  const { productSlug } = use(params);
  const sizes = garmet.sizes;
  const { createImage, isGenerating } = useImageGeneration();

  const {
    onOpen: openCheckout,
    productsAmount,
    item,
    setItem,
  } = useCheckoutContext();

  const [products, loading, error] = useProductBySlug(productSlug);

  // Get the first product from the results (should only be one with matching slug)
  const product = products?.[0] || null;

  const [generatedDesigns, setGeneratedDesigns] = useState<Design[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { view: shirtView, toggleView: toggleShirtView } = useCanvasControls();

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
      designUrls: { front: product.designs[0]?.url || "" },
      quantities,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const allDesigns = useMemo(() => {
    if (!product || !product.designs || product.designs.length === 0) return [];

    return [...generatedDesigns, ...product.designs];
  }, [generatedDesigns, product]);

  // Show error state if there's an error
  if (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }

  // Show loading state while fetching
  if (loading) {
    return null;
  }

  // Show not found if product doesn't exist
  if (!product) {
    return notFound();
  }

  const { quantities, color, designUrls } = item;
  const designUrl = designUrls.front || "";

  const handleDesignSelect = (imageUrl: string) => {
    trackDesignSelected(product.id, imageUrl);
    setItem((i) => ({
      ...i,
      designUrls: { ...i.designUrls, front: imageUrl },
    }));
  };

  const handleEditSubmit = async (prompt: string, images?: File[]) => {
    try {
      const result = await createImage(
        prompt,
        images?.map((f) => URL.createObjectURL(f))
      );
      if (result?.url) {
        const newDesign = {
          title: `Personaliziran motiv`,
          url: result.url,
        };
        setGeneratedDesigns((prev) => [newDesign, ...prev]);
        handleDesignSelect(result.url);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  return (
    <ProductPageLayout
      title={product.name}
      leftColumn={
        <div className="space-y-6">
          <Card>
            <CardBody className="py-5 px-6 space-y-4">
              <div className="mb-3">
                <h3 className="text-md font-semibold text-default-900">
                  MOTIV
                </h3>
                <p className="text-sm text-default-500">
                  Spremeni motiv po svojih željah ali naroči takega kot je.
                </p>
              </div>

              {/* Current design preview */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-default-100 to-default-200">
                {designUrl && (
                  <Image
                    src={designUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {/* Prilagodi motiv button */}
              <Button
                color="primary"
                variant="flat"
                fullWidth
                startContent={<PaintBrushIcon size={20} weight="duotone" />}
                onPress={() => setIsEditModalOpen(true)}
                className="mt-4"
              >
                Prilagodi motiv
              </Button>

              {/* Design gallery for selecting variants */}
              {(generatedDesigns.length > 0 || allDesigns.length > 1) && (
                <>
                  <Divider className="my-4" />
                  <p className="text-sm text-default-500 mb-3">
                    {generatedDesigns.length > 0
                      ? "Ustvarjeni motivi:"
                      : "Izberi drug motiv:"}
                  </p>
                  <DesignGallery
                    designs={allDesigns}
                    selectedDesignUrls={designUrl}
                    onDesignSelect={handleDesignSelect}
                    withPlaceholder={isGenerating}
                  />
                </>
              )}
            </CardBody>
          </Card>

          {/* Edit Design Modal */}
          <EditDesignModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            designUrl={designUrl}
            designName={product.name}
            promptSuggestions={product.promptSuggestions}
            onSubmit={handleEditSubmit}
            isLoading={isGenerating}
            title="Prilagodi motiv"
            subtitle="Opiši kaj želiš prilagoditi ali klini na enega izmed predlogov spodaj."
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
        <div className="w-full max-w-full flex flex-col gap-2 sm:gap-4 md:gap-6 lg:relative pb-2 sm:pb-0">
          <div className="aspect-square w-full -mb-12 sm:mb-0">
            <CanvasModel
              product={ProductType.Shirt}
              color={color}
              frontPatternUrl={designUrl}
              view={shirtView}
            />
          </div>
          <PreviewToolbar onRotate={toggleShirtView} />
        </div>
      }
    />
  );
}
