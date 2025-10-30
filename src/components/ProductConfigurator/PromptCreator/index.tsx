"use client";

import { Button, Card, CardBody, Textarea } from "@heroui/react";
import { useState } from "react";
import { PaintBrushIcon } from "@phosphor-icons/react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { DesignStyle } from "@/types/product.types";
import {
  trackPromptEntered,
  trackDesignGenerationStart,
  trackDesignGenerationSuccess,
  trackDesignGenerationError,
} from "@/lib/firebase/analytics";
import auth from "@/lib/firebase/auth";

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

    // Track prompt entered
    trackPromptEntered(prompt, auth.currentUser?.uid);

    setIsGenerating(true);

    // Track generation start
    const startTime = Date.now();
    trackDesignGenerationStart(prompt, DesignStyle.Colorful);

    try {
      const result = await generateImage(prompt, DesignStyle.Colorful);
      if (result?.url) {
        const generationTime = Date.now() - startTime;
        trackDesignGenerationSuccess(
          prompt,
          DesignStyle.Colorful,
          generationTime
        );
        onDesignGenerated(result.url);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      trackDesignGenerationError(prompt, errorMessage);
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
