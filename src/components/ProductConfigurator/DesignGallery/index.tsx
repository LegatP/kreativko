"use client";

import { Button, Card, CardBody, Chip, Divider, Input } from "@heroui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { DesignStyle } from "@/types/product.types";
import { PaintBrushIcon } from "@phosphor-icons/react";
import DesignCard from "@/components/UI/DesignCard";
import { insertVariablesIntoPrompt } from "@/utils/prompts.utils";

interface Design {
  title: string;
  imageUrl: string;
}

interface DesignGalleryProps {
  product: {
    name: string;
    description: string;
    variables: {
      primary: {
        title: string;
        placeholder: string;
        suggestions: string[];
      };
      secondary?:
        | {
            title: string;
            placeholder: string;
            suggestions: string[];
          }
        | undefined;
    };
    designs: Design[];
    prompt: string;
  };
  selectedDesignUrl: string;
  onDesignSelect: (imageUrl: string) => void;
}

export default function DesignGallery({
  product,
  selectedDesignUrl,
  onDesignSelect,
}: DesignGalleryProps) {
  const [variablePrimary, setVariablePrimary] = useState(
    product.variables.primary.suggestions?.[0] || ""
  );
  const [variableSecondary, setVariableSecondary] = useState(
    product.variables.secondary?.suggestions?.[0] || ""
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [allDesigns, setAllDesigns] = useState(product.designs);

  const { generateImage } = useImageGeneration();

  const handleChipClick = (field: string, value: string) => {
    if (field === "primary") {
      setVariablePrimary(value);
    } else if (field === "secondary") {
      setVariableSecondary(value);
    }
  };

  const handleGenerateMotif = async () => {
    const isValid = Boolean(
      variablePrimary?.trim() && variableSecondary?.trim()
    );
    if (!isValid) return;

    setIsGenerating(true);

    try {
      //   const prompt = `You are generating a T-Shirt design. The design consists of a character performing an action or doing activity based on the profession (should also include simple objects that represent that profession or activity). The design cosists of four non-perfect circles, each one representing ${variablePrimary} in a different position. The positions should vary but match ${variableSecondary}. The circles should be a bit deformed and not perfect circles. ${variablePrimary} should be a simplistic cartoon-like character. The character should have stick-like arms and legs.`;
      const prompt = insertVariablesIntoPrompt(product.prompt, {
        variablePrimary,
        variableSecondary,
      });

      const result = await generateImage(prompt, DesignStyle.Colorful);
      if (result?.url) {
        const newDesign = {
          title: `Personaliziran motiv.`,
          imageUrl: result.url,
        };
        setAllDesigns((prev) => [newDesign, ...prev]);
        onDesignSelect(result.url); // Auto-select the generated design
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isInputValid = () => {
    const hasPrimary = Boolean(product.variables.primary);
    const hasSecondary = Boolean(product.variables.secondary);

    const primaryValid = !hasPrimary || Boolean(variablePrimary?.trim());
    const secondaryValid = !hasSecondary || Boolean(variableSecondary?.trim());

    return primaryValid && secondaryValid;
  };

  return (
    <>
      <Card>
        <CardBody className="py-5 px-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-default-900">
              Personaliziraj
            </h3>
            <p className="text-medium text-default-700">
              Izberi motiv iz galerije ali ustvari svojega.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="aspect-square animate-pulse bg-default-100 shadow-md">
                  <CardBody className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </CardBody>
                </Card>
              </motion.div>
            )}

            {allDesigns.map((design, index) => (
              <DesignCard
                key={design.imageUrl + index}
                title={design.title}
                isSelected={selectedDesignUrl === design.imageUrl}
                designUrl={design.imageUrl}
                handleDesignSelect={onDesignSelect}
              />
            ))}
          </div>

          <Divider className="my-4" />

          {product.variables.primary && (
            <div>
              <Input
                label={product.variables.primary.title}
                variant="underlined"
                placeholder={product.variables.primary.placeholder}
                value={variablePrimary}
                onChange={(e) => setVariablePrimary(e.target.value)}
              />
              <div className="flex flex-row flex-wrap mt-2">
                {product.variables.primary.suggestions.map(
                  (item, chipIndex) => (
                    <Chip
                      key={chipIndex}
                      size="sm"
                      className="m-1 cursor-pointer transition-colors hover:bg-primary hover:text-white"
                      onClick={() => handleChipClick("primary", item)}
                      color="primary"
                      variant="flat"
                    >
                      {item}
                    </Chip>
                  )
                )}
              </div>
            </div>
          )}

          {product.variables.secondary && (
            <div>
              <Input
                label={product.variables.secondary.title}
                variant="underlined"
                placeholder={product.variables.secondary.placeholder}
                value={variableSecondary}
                onChange={(e) => setVariableSecondary(e.target.value)}
              />
              <div className="flex flex-row flex-wrap mt-2">
                {product.variables.secondary.suggestions.map(
                  (item, chipIndex) => (
                    <Chip
                      key={chipIndex}
                      size="sm"
                      className="m-1 cursor-pointer transition-colors hover:bg-primary hover:text-white"
                      onClick={() => handleChipClick("secondary", item)}
                      color="primary"
                      variant="flat"
                    >
                      {item}
                    </Chip>
                  )
                )}
              </div>
            </div>
          )}

          <Button
            startContent={<PaintBrushIcon className="w-5 h-5" weight="fill" />}
            variant="ghost"
            color="primary"
            fullWidth
            onPress={handleGenerateMotif}
            isDisabled={!isInputValid() || isGenerating}
            isLoading={isGenerating}
          >
            {isGenerating ? "Ustvarjam motiv..." : "Ustvari motiv"}
          </Button>
        </CardBody>
      </Card>
    </>
  );
}
