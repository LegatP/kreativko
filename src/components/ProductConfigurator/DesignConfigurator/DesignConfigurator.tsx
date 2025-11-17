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
import { useMemo, useState, useCallback } from "react";
import {
  ImagesIcon,
  InfoIcon,
  NotePencilIcon,
  PaintBrushIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { insertVariablesIntoPrompt } from "@/utils/prompts.utils";
import DesignGallery from "../DesignGallery";
import { Product } from "@/products";
import { Design } from "../DesignGallery/DesignGallery";

interface DesignGalleryProps {
  product: Product;
  selectedDesignUrl: string;
  onDesignSelect: (imageUrl: string) => void;
  onSubmit: (prompt: string, promptType: "edit" | "create") => void;
  isLoading?: boolean;
  featuredDesigns: Design[];
  allDesigns: Design[];
}

export default function DesignConfigurator({
  product,
  selectedDesignUrl,
  onDesignSelect,
  onSubmit,
  isLoading,
  featuredDesigns,
  allDesigns,
}: DesignGalleryProps) {
  const [variables, setVariables] = useState<{
    [key: string | number]: string;
  }>({});
  const [mode, setMode] = useState<"select" | "edit" | "variables">(
    "variables"
  );
  const [editPrompt, setEditPrompt] = useState("");

  const handleChipClick = (variable: string, value: string) => {
    setVariables((prev) => ({ ...prev, [variable]: value }));
  };

  const isVariablesInputValid = useCallback(() => {
    // TODO: currently all variables are required, change later if needed by adding "required" field to variable definition
    return product.variables.every((variable) => {
      const value = variables[variable.key];
      if (!value || !value.trim()) {
        return false;
      }
      return true;
    });
  }, [product.variables, variables]);

  const onSubmitPrivate = async () => {
    let prompt = editPrompt;
    let promptType: typeof product.promptType = "edit";
    if (mode === "variables") {
      promptType = product.promptType;
      prompt = insertVariablesIntoPrompt(product.prompt, variables);
    }
    onSubmit(prompt, promptType);
  };

  function buttonText() {
    if (isLoading) {
      return "Ustvarjamo motiv...";
    }
    const prefix = mode === "variables" ? "Prilagodi" : "Spremeni";
    return `${prefix} motiv`;
  }

  const isButtonDisabled = useMemo(() => {
    return (
      (mode === "variables" ? !isVariablesInputValid() : !editPrompt.trim()) ||
      isLoading
    );
  }, [isLoading, editPrompt, mode, isVariablesInputValid]);

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
            designs={featuredDesigns}
            selectedDesignUrl={selectedDesignUrl}
            onDesignSelect={onDesignSelect}
            withPlaceholder={isLoading}
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
              {product.variables.map((variable, index) => {
                if (variable.type !== "number") {
                  // TODO: extend with other types and move to function
                  throw new Error("Only number type is supported currently.");
                }
                return (
                  <div key={index} className="mb-4">
                    <Input
                      label={variable.title}
                      variant="underlined"
                      placeholder={variable.placeholder}
                      value={variables[variable.key] || ""}
                      onChange={(e) =>
                        handleChipClick(variable.key, e.target.value)
                      }
                    />
                    <div className="flex flex-row flex-wrap mt-2">
                      {variable.suggestions?.map((item, chipIndex) => (
                        <Chip
                          key={chipIndex}
                          size="sm"
                          className="m-1 cursor-pointer transition-colors hover:bg-primary hover:text-white"
                          onClick={() => handleChipClick(variable.key, item)}
                          color="primary"
                          variant="flat"
                        >
                          {item}
                        </Chip>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-1 mt-2 text-default-600">
                <InfoIcon />
                {
                  // TODO: prvotni motiv should be link which selects the original design
                }
                <span className="text-xs">Prilagojen bo prvotni motiv.</span>
              </div>
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
              <div className="flex gap-1 mt-2 text-default-600">
                <InfoIcon />
                <span className="text-xs">
                  Spremembe bodo uveljavljene na trenutno izbranem motivu.
                </span>
              </div>
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
              <DesignGallery
                designs={allDesigns} // Just for demo purposes, show more designs
                selectedDesignUrl={selectedDesignUrl}
                onDesignSelect={onDesignSelect}
                withPlaceholder={isLoading}
                isSmallCards
              />
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
              onPress={onSubmitPrivate}
              isDisabled={isButtonDisabled}
              isLoading={isLoading}
              className="text-white"
            >
              {buttonText()}
            </Button>
          )}
        </CardBody>
      </Card>
    </>
  );
}
