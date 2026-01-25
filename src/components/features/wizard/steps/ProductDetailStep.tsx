"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useProductOnce } from "@/db/products";
import DesignEditor from "@/components/features/product/DesignEditor";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface ProductDetailStepProps {
  productId: string;
  onCustomize: (prompt?: string, images?: File[], templateUrl?: string) => void;
  onContinue: (designUrl: string) => void;
  isSubmitting?: boolean;
}

export default function ProductDetailStep({
  productId,
  onCustomize,
  onContinue,
  isSubmitting = false,
}: ProductDetailStepProps) {
  const [product, loading] = useProductOnce(productId);

  const handleSubmit = (
    prompt: string,
    images?: File[],
    templateUrl?: string,
  ) => {
    onCustomize(prompt, images, templateUrl);
  };

  const handleContinue = () => {
    const designUrl = product?.designs?.[0]?.url;
    if (designUrl) {
      onContinue(designUrl);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-default-500">Motiv ni bil najden.</p>
      </div>
    );
  }

  const designImage = product.designs?.[0]?.url;

  return (
    <div className="flex flex-col gap-6">
      <DesignEditor
        designUrl={designImage || ""}
        designName={product.name}
        promptSuggestions={product.promptSuggestions}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />

      {/* Continue button - medium, right-aligned, shadow variant */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end pt-4"
      >
        <Button
          color="primary"
          variant="bordered"
          size="md"
          onPress={handleContinue}
          isDisabled={isSubmitting}
        >
          Nadaljuj brez sprememb
        </Button>
      </motion.div>
    </div>
  );
}
