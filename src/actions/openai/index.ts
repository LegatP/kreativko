"use server";

import { PROMPTS } from "@/lib/prompts";
import {
  ImageAnalysisResponseSchema,
  type ImageAnalysisResponse,
} from "@/lib/prompts/schemas";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Wraps an async operation and returns the result with execution duration.
 */
async function withTiming<T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return { result, duration };
}

/**
 * Builds a standardized image response object.
 */
function buildImageResponse(params: {
  b64_json?: string;
  duration: number;
  prompt: string;
  finalPrompt: string;
  model: string;
  size: string;
  quality: string;
}): CreateDesignResponse {
  return {
    api: "openai",
    ...params,
  };
}

/**
 * Fetches an image from URL and converts it to a File object.
 */
async function fetchImageAsFile(
  url: string,
  filename: string = "image.png"
): Promise<File> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new File([buffer], filename, { type: "image/png" });
}

function getDigitalPrintPrompt(prompt: string): string {
  return `${PROMPTS.generation.dtfPrintSystem}\n\n
  Even thought the design description is provided below you MUST add randomness to the output by varying colors, shapes, and composition so that the design is unique.
  Don't overdo it with colors and details, keep it balanced for printing.
  
  Design description: ${prompt}`;
}

export interface CreateDesignResponse {
  api: string;
  b64_json?: string;
  duration: number;
  prompt: string;
  finalPrompt: string;
  model: string;
  size: string;
  quality: string;
}

const IMAGE_GENERATE_CONFIG = {
  model: "gpt-image-1.5",
  size: "1024x1024",
  quality: "high",
  background: "transparent",
  moderation: "low",
  n: 1,
  inputFidelity: "high",
} as const;

async function createDesign(
  prompt: string
): Promise<CreateDesignResponse | undefined> {
  const finalPrompt = getDigitalPrintPrompt(prompt);
  const { model, size, quality, moderation, background, n } =
    IMAGE_GENERATE_CONFIG;

  try {
    const { result: response, duration } = await withTiming(() =>
      client.images.generate({
        model,
        prompt: finalPrompt,
        size,
        n,
        background,
        quality,
        moderation,
      })
    );
    return buildImageResponse({
      b64_json: response?.data?.[0].b64_json || undefined,
      duration,
      prompt,
      finalPrompt,
      model,
      size,
      quality,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined;
  }
}

async function editDesign({
  prompt,
  existingDesignUrl,
}: {
  prompt: string;
  existingDesignUrl: string;
}): Promise<CreateDesignResponse | undefined> {
  const { model, size, quality, background, inputFidelity } =
    IMAGE_GENERATE_CONFIG;

  try {
    const { result: response, duration } = await withTiming(async () => {
      const imageFile = await fetchImageAsFile(existingDesignUrl);
      return client.images.edit({
        prompt,
        image: imageFile,
        n: 1,
        size,
        model,
        background,
        quality,
        input_fidelity: inputFidelity,
      });
    });

    return buildImageResponse({
      b64_json: response?.data?.[0].b64_json || undefined,
      duration,
      prompt: prompt,
      finalPrompt: prompt,
      model,
      size,
      quality,
    });
  } catch (error) {
    console.error("Error generating image variation:", error);
    return undefined;
  }
}

export async function generateResponse(
  prompt: string,
  imageUrls?: string[]
): Promise<CreateDesignResponse> {
  const { size, quality, background, inputFidelity, moderation } =
    IMAGE_GENERATE_CONFIG;
  const systemPrompt = PROMPTS.generation.dtfPrintSystem;
  const referenceImages = (imageUrls || []).map((url) => ({
    type: "input_image" as const,
    detail: "auto" as const,
    image_url: url,
  }));

  const { result: response, duration } = await withTiming(() =>
    client.responses.create({
      model: "gpt-4o",
      tool_choice: "required",
      tools: [
        {
          type: "image_generation",
          input_fidelity: inputFidelity,
          background,
          quality,
          size,
          // gpt-image-1.5 is not supported for responses api yet
          model: "gpt-image-1",
          moderation,
        },
      ],
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }, ...referenceImages],
        },
      ],
    })
  );

  return buildImageResponse({
    // @ts-expect-error – b64_json is missing in types
    b64_json: response?.output?.[0]?.result || undefined,
    prompt,
    model: "gpt-4o",
    size,
    quality,
    duration,
    finalPrompt: `System: ${systemPrompt}, User: ${prompt}`,
  });
}

const FALLBACK_SUGGESTIONS: string[] = [
  "Pretvori sliko v minimalistično silhueto z ostrimi geometrijskimi linijami in eno samo barvo.",
  "Preoblikuj v ilustracijo v slogu risanke z poudarjenimi obrisi in preprostimi barvnimi ploskvami.",
  "Ustvari abstrakcijo z razdrobljenimi oblikami in živahnimi kontrastnimi barvami.",
  "Dodaj retro vintage občutek z zbledelimi barvami in teksturo starega papirja.",
];

async function analyzeImageForSuggestions(
  imageUrl: string
): Promise<ImageAnalysisResponse> {
  try {
    if (!imageUrl.startsWith("https://")) {
      console.error("Invalid image URL format:", imageUrl.substring(0, 50));
      throw new Error("Invalid image URL - must be HTTPS");
    }

    const response = await client.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: PROMPTS.analysis.imageSuggestions,
        },
        {
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "auto",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "image_analysis",
          schema: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: { type: "string" },
                minItems: 4,
                maxItems: 4,
              },
            },
            required: ["suggestions"],
            additionalProperties: false,
          },
        },
      },
    });

    // Extract text content from response
    const outputMessage = response.output?.find(
      (item) => item.type === "message"
    );
    const textContent = (
      outputMessage as { content?: Array<{ type: string; text?: string }> }
    )?.content?.find((c) => c.type === "output_text");
    const jsonText = textContent?.text;

    if (!jsonText) {
      throw new Error("No text content in response");
    }

    // Parse and validate with Zod (structured output guarantees valid JSON)
    const parsed = ImageAnalysisResponseSchema.parse(JSON.parse(jsonText));
    return parsed;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return { suggestions: FALLBACK_SUGGESTIONS };
  }
}

export { createDesign, editDesign, analyzeImageForSuggestions };
