"use client";

import { useCallback, useImperativeHandle } from "react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { forwardRef } from "react";
import ProductSelectionCard from "@/components/features/product/ProductSelection/ProductSelectionCard";
import PromptForm from "@/components/common/PromptForm";
import DesignGallery from "@/components/common/DesignGallery";
import { DesignSession, updateDesignSession } from "@/db/design-sessions";

interface ProductDesignCreationProps {
  designSession: DesignSession;
  selectedDesignUrl?: string;
  onDesignSelect: (imageUrl: string) => void;
  initialPrompt?: string;
}

export interface ProductDesignCreationRef {
  generateDesign: (
    prompt: string,
    selectedAssets?: { url: string }[]
  ) => Promise<void>;
}

const ProductDesignCreation = forwardRef<
  ProductDesignCreationRef,
  ProductDesignCreationProps
>(
  (
    { onDesignSelect, selectedDesignUrl, designSession, initialPrompt },
    ref
  ) => {
    const { createdDesigns } = designSession;
    const { createImage, isGenerating } = useImageGeneration();

    const generateDesign = useCallback(
      async (prompt: string, selectedAssets?: { url: string }[]) => {
        const result = await createImage(
          prompt,
          selectedAssets?.map((asset) => asset.url)
        );

        if (!result) return;

        const { url } = result;

        await updateDesignSession(designSession.id, {
          ...designSession,
          createdDesigns: [...createdDesigns, { title: prompt, url }],
        });
        onDesignSelect(url);
      },
      [createImage, onDesignSelect, designSession, createdDesigns]
    );

    useImperativeHandle(ref, () => ({
      generateDesign,
    }));

    console.log("render ", selectedDesignUrl);

    return (
      <ProductSelectionCard
        title={
          isGenerating || createdDesigns.length > 0
            ? "Izberi motiv za majico"
            : ""
        }
        // subtitle="Opiši željen motiv, dodaj slike in ustvari svoj unikatni motiv."
      >
        <DesignGallery
          designs={createdDesigns}
          selectedDesignUrls={selectedDesignUrl}
          onDesignSelect={onDesignSelect}
          withPlaceholder={isGenerating}
        />
        <h3 className="text-xl font-semibold text-default-900">
          Ustvari nov motiv
        </h3>
        <PromptForm
          onSubmit={generateDesign}
          isLoading={isGenerating}
          initialPrompt={initialPrompt}
          initialFiles={designSession.uploadedAssets}
          initialSelectedDesigns={designSession.uploadedAssets}
        />
      </ProductSelectionCard>
    );
  }
);

ProductDesignCreation.displayName = "ProductDesignCreation";

export default ProductDesignCreation;
