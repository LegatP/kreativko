"use client";

import { useState } from "react";
import { addToast, closeToast } from "@heroui/react";
import { CreateShirtPatternResponse, generateResponse } from "@/actions/openai";
import { uploadFile } from "@/lib/firebase/storage";
import { createAiReponse } from "@/db/ai-reponses";
import { trackDesignGenerationError } from "@/lib/firebase/analytics";
import auth from "@/lib/firebase/auth";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const createImage = async (prompt: string, referenceImageUrls?: string[]) => {
    if (!referenceImageUrls || referenceImageUrls.length === 0) {
      // return await createShirtPattern(prompt, DesignStyle.Colorful);
    }
    return generateImage(async () =>
      generateResponse(prompt, referenceImageUrls)
    );
  };

  // const editImage = async (prompt: string, existingDesignUrl: string) => {
  // TODO: implement
  // };

  // const createImageWithResponses = async (prompt: string) => {
  //   // TODO: implement

  //   const responsesApi = async () => generateResponse(prompt);
  //   await generateImage(responsesApi);
  // };

  const generateImage = async (
    serverAction: () => Promise<CreateShirtPatternResponse>
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
      const response: CreateShirtPatternResponse | undefined =
        await serverAction();

      if (!response?.b64_json) {
        throw new Error("No image generated");
      }

      const url = await uploadFile(response.b64_json);
      // TODO: do i need to create asset here?
      // const asset = await createAsset({ url, type: "image/png" });

      if (toastId) {
        closeToast(toastId);
      }

      // Save AI response for analytics/history. No need to await.
      // TODO: a better way to handle b64_json?
      delete response.b64_json;
      createAiReponse({
        userId: auth.currentUser?.uid || "anonymous",
        ...response,
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

      if (toastId) {
        closeToast(toastId);
      }

      addToast({
        title: "Napaka pri generiranju motiva.",
        color: "danger",
      });

      const errorInstance =
        error instanceof Error ? error : new Error("Unknown error");
      trackDesignGenerationError(errorInstance.message);

      throw errorInstance;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    createImage,
    // editImage,
    // generateImageWithResponses,
    isGenerating,
  };
};
