"use server";

import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { DesignStyle } from "@/types/product.types";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

function getScreenPrintingPromot(prompt: string): string {
  return `You are a designer creating images specifically for screen printing. The image must follow these rules:

  1. It should be easy to trace in Adobe Illustrator. Avoid any thin lines or overly intricate details.  
  2. The design should use **only one color**, unless the description explicitly specifies multiple colors and which color should be used where.  
  3. The image should not contain any text, unless the design description explicitly says text is needed.  
  4. The background must be transparent.  
  5. The image should clearly represent the user’s design description in a bold, simple, and clean style suitable for screen printing.

  Design description: ${prompt}
  `;
}

function getDigitalPrintPromot(prompt: string): string {
  return `You are a designer creating images specifically for DTF printing (Direct-to-Film). The image must follow these rules:

    1. The design must be suitable for printing – avoid very thin lines or overly intricate details.  
    2. The image should not contain any text, unless the design description explicitly requires it.  
    3. The design must clearly represent the user's description, suitable for DTF printing.
    4. The background must be transparent if it does not contain elements that cover the entire canvas.
    
    Design description: ${prompt}
    `;
}
// 2. If the design description specifies multiple colors, the colors should be clearly defined and visually harmonious.

// Create a screen-print-ready image based on the following design description (in Slovenian). The image must follow these rules: it should be easy to trace in Adobe Illustrator with no thin lines or overly intricate details; use only one color unless the description explicitly specifies multiple colors and their placement; do not include any text unless the description explicitly says so; the background must be transparent; and the design should be bold, simple, and clean, suitable for screen printing.

// Design description: "Slogovni orel z razprtim krili"

export interface CreateShirtPatternResponse {
  api: string;
  b64_json?: string;
  duration: number;
  prompt: string;
  finalPrompt: string;
  model: string;
  size: string;
  quality: string;
}

async function createShirtPattern(
  prompt: string,
  designStyle: DesignStyle
): Promise<CreateShirtPatternResponse | undefined> {
  const { user } = await getAuthenticatedAppForUser();

  const finalPrompt =
    designStyle === DesignStyle.Monotone
      ? getScreenPrintingPromot(prompt)
      : getDigitalPrintPromot(prompt);

  try {
    if (!user) {
      throw new Error("User not authenticated");
    }
    const model = "gpt-image-1";
    const size = "1024x1024";
    const quality = "high";
    // const model = "dall-e-3";
    // const size = "1024x1024";
    // const quality = "standard";
    const start = Date.now();
    const response = await client.images.generate({
      model,
      prompt: finalPrompt,
      size,
      n: 1,
      background: "transparent",
      // TODO: remove when in production
      quality,
      moderation: "low",
    });
    const duration = Date.now() - start;
    return {
      api: "openai",
      b64_json: response?.data?.[0].b64_json || undefined,
      duration,
      prompt,
      finalPrompt,
      model,
      size,
      quality,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined;
  }
}

export { createShirtPattern };
