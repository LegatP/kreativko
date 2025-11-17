"use client";

import { useState } from "react";
import { addToast, closeToast } from "@heroui/react";
import {
  createShirtPattern,
  CreateShirtPatternResponse,
  editShirtPattern,
} from "@/actions/openai";
import { uploadFile } from "@/lib/firebase/storage";
import { createAsset } from "@/db/assets";
import { createAiReponse } from "@/db/ai-reponses";
import { DesignStyle } from "@/types/product.types";

interface UseImageGenerationProps {
  onSuccess?: (imageUrl: string, assetId?: string) => void;
  onError?: (error: Error) => void;
}

export const useImageGeneration = ({
  onSuccess,
  onError,
}: UseImageGenerationProps = {}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async (
    prompt: string,
    // designStyle: DesignStyle = DesignStyle.Colorful,
    model: "create" | "edit" = "create",
    selectedDesignUrl?: string
  ) => {
    if (!prompt.trim() || isGenerating) {
      return;
    }

    setIsGenerating(true);

    const toastId = addToast({
      title: "Ustvarjamo tvoj motiv.",
      color: "default",
      description: "To lahko traja nekaj časa. Ne zapiraj brskalnika.",
      isClosing: true,
      promise: new Promise(() => {}),
      hideCloseButton: true,
    });

    try {
      let response: CreateShirtPatternResponse | undefined;
      if (model === "create") {
        throw new Error("DesignStyle should be implemented/refined.");
      } else if (model === "edit") {
        console.log("Creating variations for prompt:", prompt);
        if (!selectedDesignUrl) {
          throw new Error("No existing design URL provided for editing.");
        }
        response = await editShirtPattern({
          prompt,
          existingDesignUrl: selectedDesignUrl,
        });
      } else {
        throw new Error("Invalid model type specified.");
        // const response = await createShirtPattern(prompt, designStyle);
      }

      if (!response?.b64_json) {
        throw new Error("No image generated");
      }

      const url = await uploadFile(response.b64_json);
      const asset = await createAsset({ url, type: "image/png" });

      if (toastId) {
        closeToast(toastId);
      }

      // Save AI response for analytics/history
      await createAiReponse({
        ...response,
        imageUrl: url,
      });

      addToast({
        title: "Motiv uspešno ustvarjen!",
        color: "success",
        description: "Tvoj personaliziran motiv je pripravljen.",
      });

      onSuccess?.(url, asset?.id);

      return { url, assetId: asset?.id };
    } catch (error) {
      console.error("Error generating image:", error);

      if (toastId) {
        closeToast(toastId);
      }

      addToast({
        title: "Napaka pri generiranju motiva.",
        color: "danger",
      });

      const errorInstance =
        error instanceof Error ? error : new Error("Unknown error");
      onError?.(errorInstance);

      throw errorInstance;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateImage,
    isGenerating,
  };
};
