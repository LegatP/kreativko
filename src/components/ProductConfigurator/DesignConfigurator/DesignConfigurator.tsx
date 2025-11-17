"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { DesignStyle } from "@/types/product.types";
import {
  ImagesIcon,
  NotePencilIcon,
  PaintBrushIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { insertVariablesIntoPrompt } from "@/utils/prompts.utils";
import DesignGallery from "../DesignGallery";
import { th, u } from "framer-motion/client";
import { Product } from "@/products";

interface Design {
  title: string;
  imageUrl: string;
}

interface DesignGalleryProps {
  product: Product;
  selectedDesignUrl: string;
  onDesignSelect: (imageUrl: string) => void;
}

export default function DesignConfigurator({
  product,
  selectedDesignUrl,
  onDesignSelect,
}: DesignGalleryProps) {
  const [variables, setVariables] = useState<{
    [key: string | number]: string;
  }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [allDesigns, setAllDesigns] = useState(product.designs);
  const [mode, setMode] = useState<"select" | "edit" | "variables">(
    "variables"
  );
  const [editPrompt, setEditPrompt] = useState("");

  const { generateImage } = useImageGeneration();

  const handleChipClick = (variable: string, value: string) => {
    setVariables((prev) => ({ ...prev, [variable]: value }));
  };

  const isInputValid = () => {
    // TODO: currently all variables are required, change later if needed by adding "required" field to variable definition
    return product.variables.every((variable) => {
      const value = variables[variable.key];
      if (!value || !value.trim()) {
        return false;
      }
      return true;
    });
  };

  const handleGenerateMotif = async () => {
    const isValid = isInputValid();
    if (!isValid) return;

    setIsGenerating(true);

    // TODO: cleanup!! edit promt, isGenerating
    // TODO: add switch to take into account t shirt color - add to prompt to keep same colors scheme

    try {
      let result = undefined;
      if (mode === "variables") {
        const finalPrompt = insertVariablesIntoPrompt(
          product.editPrompt || product.prompt,
          {
            variablePrimary,
            variableSecondary,
          }
        );
        // console.log(
        //   "Final prompt for generation:",
        //   finalPrompt,
        //   product.editPrompt,
        //   variablePrimary
        // );
        // throw new Error("Test error");
        result = await generateImage(
          finalPrompt,
          DesignStyle.Colorful,
          "edit",
          selectedDesignUrl
        );
      } else if (mode === "edit") {
        result = await generateImage(
          editPrompt,
          DesignStyle.Colorful,
          "edit",
          selectedDesignUrl
        );
        // const result = await
      }
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
            <h3 className="text-xl font-semibold text-default-900">Motiv</h3>
            <p className="text-sm text-default-700">
              Prilagodi motiv, tako da izpolneš polja ali pa ga spremeni, tako
              da opišeš želene spremembe.
            </p>
          </div>

          <DesignGallery
            designs={allDesigns}
            selectedDesignUrl={selectedDesignUrl}
            onDesignSelect={onDesignSelect}
            withPlaceholder={isGenerating}
          />

          <Divider className="my-4" />

          <Tabs
            variant="underlined"
            fullWidth
            classNames={{ base: "mb-0", panel: "mb-4" }}
            selectedKey={mode}
            onSelectionChange={(key) =>
              setMode(key as "select" | "edit" | "variables")
            }
          >
            <Tab
              key="variables"
              title={
                <div className="flex items-center space-x-2">
                  <SlidersHorizontalIcon className="w-5 h-5" />
                  <span>Prilagodi</span>
                </div>
              }
              className="pl-0"
            >
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
            </Tab>
            <Tab
              key="edit"
              title={
                <div className="flex items-center space-x-2">
                  <NotePencilIcon className="w-5 h-5" />
                  <span>Spremeni</span>
                </div>
              }
            >
              <Textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                minRows={8}
                maxRows={12}
                autoFocus
                variant="bordered"
                color="primary"
              />
            </Tab>
            <Tab
              key="select"
              title={
                <div className="flex items-center space-x-2">
                  <ImagesIcon className="w-5 h-5" />
                  <span>Galerija</span>
                </div>
              }
            >
              <span>TODO</span>
            </Tab>
          </Tabs>

          {mode !== "select" && (
            <Button
              startContent={
                <PaintBrushIcon className="w-5 h-5" weight="fill" />
              }
              variant="solid"
              color="primary"
              fullWidth
              onPress={handleGenerateMotif}
              isDisabled={!isInputValid() || isGenerating}
              isLoading={isGenerating}
              className="text-white"
            >
              {isGenerating ? "Ustvarjam motiv..." : "Ustvari motiv"}
            </Button>
          )}
        </CardBody>
      </Card>
    </>
  );
}
