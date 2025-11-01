"use client";

import { Button, Card, CardBody, Chip, Divider, Input } from "@heroui/react";
import { useState } from "react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { DesignStyle } from "@/types/product.types";
import { PaintBrushIcon } from "@phosphor-icons/react";
import { insertVariablesIntoPrompt } from "@/utils/prompts.utils";
import DesignGallery from "../DesignGallery";

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

export default function DesignConfigurator({
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

  const isInputValid = () => {
    const hasPrimary = Boolean(product.variables.primary);
    const hasSecondary = Boolean(product.variables.secondary);

    const primaryValid = !hasPrimary || Boolean(variablePrimary?.trim());
    const secondaryValid = !hasSecondary || Boolean(variableSecondary?.trim());

    return primaryValid && secondaryValid;
  };

  const handleGenerateMotif = async (prompt: string) => {
    const isValid = isInputValid();
    if (!isValid) return;

    setIsGenerating(true);

    try {
      const finalPrompt = insertVariablesIntoPrompt(prompt, {
        variablePrimary,
        variableSecondary,
      });

      const result = await generateImage(finalPrompt, DesignStyle.Colorful);
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

          <DesignGallery
            designs={allDesigns}
            selectedDesignUrl={selectedDesignUrl}
            onDesignSelect={onDesignSelect}
            withPlaceholder={isGenerating}
          />

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
            onPress={() => handleGenerateMotif(product.prompt)}
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
