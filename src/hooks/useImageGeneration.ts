"use client";

import { useState } from "react";
import { addToast, closeToast } from "@heroui/react";
import {
  createDesign,
  CreateDesignResponse,
  editDesign,
  generateResponse,
} from "@/actions/openai";
import { uploadFile } from "@/lib/firebase/storage";
import { createAiReponse } from "@/db/ai-reponses";
import auth from "@/lib/firebase/auth";

export type GenerationMode = "create" | "edit" | "response";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const createImage = async (
    prompt: string,
    referenceImageUrls?: string[],
    mode?: GenerationMode
  ) => {
    const effectiveMode =
      mode ?? (referenceImageUrls?.length ? "response" : "create");

    switch (effectiveMode) {
      case "create":
        return generateImage(() => createDesign(prompt));
      case "edit":
        return generateImage(() =>
          editDesign({
            prompt,
            existingDesignUrl: referenceImageUrls![0],
          })
        );
      case "response":
        return generateImage(() =>
          generateResponse(prompt, referenceImageUrls)
        );
    }
  };

  const generateImage = async (
    serverAction: () => Promise<CreateDesignResponse | undefined>
  ) => {
    if (isGenerating) return;

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
      const response = await serverAction();

      console.log("Image generation response:", response);
      if (!response?.b64_json) {
        throw new Error("No image generated");
      }

      const url = await uploadFile(response.b64_json);
      console.log("Uploaded image URL:", url);

      // Save AI response for analytics/history without b64_json. No need to await.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { b64_json: _b64, ...rest } = response;
      createAiReponse({
        userId: auth.currentUser?.uid || "anonymous",
        ...rest,
        imageUrl: url,
      });

      addToast({
        title: "Motiv uspešno ustvarjen!",
        color: "success",
        description: "Tvoj personaliziran motiv je pripravljen.",
      });

      return { url, prompt: response.prompt };
    } catch (error) {
      console.error("Error generating image:", error);

      addToast({
        title: "Napaka pri generiranju motiva.",
        color: "danger",
      });

      const errorInstance =
        error instanceof Error ? error : new Error("Unknown error");

      throw errorInstance;
    } finally {
      if (toastId) closeToast(toastId);
      setIsGenerating(false);
    }
  };

  return {
    createImage,
    isGenerating,
  };
};
