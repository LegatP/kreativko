"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createDesignSession, updateDesignSession } from "@/db/design-sessions";
import { useImageGeneration, type GenerationMode } from "@/hooks/useImageGeneration";
import { uploadFile } from "@/lib/firebase/storage";
import { arrayUnion } from "@/lib/firebase/firestore";
import auth from "@/lib/firebase/auth";
import ROUTES from "@/utils/routes.utils";

interface UseCreateDesignOptions {
  generationDelay?: number; // Delay before starting generation (default: 500ms)
  onBeforeRedirect?: () => void; // Called before redirect (for closing modal)
  onSessionCreated?: (sessionId: string) => void;
  onComplete?: () => void;
}

interface CreateDesignParams {
  prompt: string;
  images?: File[];
  existingImageUrl?: string;
  mode?: GenerationMode;
  sessionId?: string;
}

export function useCreateDesign(options: UseCreateDesignOptions = {}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createImage } = useImageGeneration();

  const createDesign = useCallback(
    async ({
      prompt,
      images,
      existingImageUrl,
      mode,
      sessionId,
    }: CreateDesignParams) => {
      if (isSubmitting || !prompt.trim()) return;

      setIsSubmitting(true);

      const isNewSession = !sessionId;

      // Close modal immediately for instant feedback
      if (isNewSession) {
        options.onBeforeRedirect?.();
      }

      try {
        // Upload images if provided (reuse existing URL if available)
        let uploadedAssets: { url: string }[] = [];
        if (images && images.length > 0) {
          uploadedAssets = await Promise.all(
            images.map(async (file, index) => {
              if (index === 0 && existingImageUrl) {
                return { url: existingImageUrl };
              }
              const url = await uploadFile(file);
              return { url };
            })
          );
        }

        // Determine image URLs for generation
        const imageUrls =
          mode === "edit" && existingImageUrl
            ? [existingImageUrl]
            : uploadedAssets.length > 0
            ? uploadedAssets.map((a) => a.url)
            : undefined;

        let finalSessionId = sessionId;

        // If no session, create one and redirect
        if (isNewSession) {
          const session = await createDesignSession({
            userId: auth.currentUser?.uid || "guest",
            uploadedAssets,
            createdDesigns: [],
          });
          finalSessionId = session.id;

          // Navigate to the new session
          router.replace(ROUTES.createDesign(finalSessionId));
          options.onSessionCreated?.(finalSessionId);
        } else {
          // Existing session - close modal
          options.onBeforeRedirect?.();
        }

        options.onComplete?.();
        setIsSubmitting(false);

        // Wait for navigation to complete before starting generation
        const generationDelay = options.generationDelay ?? 500;
        setTimeout(() => {
          createImage(prompt, imageUrls, mode).then(async (result) => {
            if (result?.url && finalSessionId) {
              await updateDesignSession(finalSessionId, {
                createdDesigns: arrayUnion({ title: prompt, url: result.url }),
                designUrls: { front: result.url },
              });
            }
          });
        }, generationDelay);
      } catch (error) {
        console.error("Failed to create design:", error);
        setIsSubmitting(false);
      }
    },
    [isSubmitting, router, createImage, options]
  );

  return {
    createDesign,
    isSubmitting,
  };
}
