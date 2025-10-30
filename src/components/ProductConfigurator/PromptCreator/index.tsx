"use client";

import { Button, Card, CardBody, Textarea } from "@heroui/react";
import { useState } from "react";
import { PaintBrushIcon } from "@phosphor-icons/react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { DesignStyle } from "@/types/product.types";

interface PromptCreatorProps {
  onDesignGenerated: (imageUrl: string) => void;
}

export default function PromptCreator({
  onDesignGenerated,
}: PromptCreatorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateImage } = useImageGeneration();

  const handleGenerateMotif = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const result = await generateImage(prompt, DesignStyle.Colorful);
      if (result?.url) {
        onDesignGenerated(result.url);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardBody className="py-5 px-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-default-900">
            Ustvari motiv
          </h3>
          <p className="text-medium text-default-700">
            Opiši motiv, ki si ga želiš ustvariti.
          </p>
        </div>

        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          minRows={8}
          maxRows={12}
          autoFocus
          variant="bordered"
          color="primary"
        />

        <Button
          startContent={<PaintBrushIcon className="w-5 h-5" weight="fill" />}
          variant="ghost"
          color="primary"
          fullWidth
          onPress={handleGenerateMotif}
          isDisabled={!prompt.trim() || isGenerating}
          isLoading={isGenerating}
        >
          {isGenerating ? "Ustvarjam motiv..." : "Ustvari motiv"}
        </Button>
      </CardBody>
    </Card>
  );
}
