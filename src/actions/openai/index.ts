"use server";

import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export interface CreateShirtPatternResponse {
  api: string;
  b64_json?: string;
  duration?: number;
  prompt: string;
  model: string;
  size: string;
}

async function createShirtPattern(
  prompt: string
): Promise<CreateShirtPatternResponse | undefined> {
  const { user } = await getAuthenticatedAppForUser();

  try {
    if (!user) {
      throw new Error("User not authenticated");
    }
    const model = "gpt-image-1";
    const size = "1024x1024";
    const start = Date.now();
    const response = await client.images.generate({
      model,
      prompt,
      size,
      n: 1,
    });
    const duration = Date.now() - start;
    return {
      api: "openai",
      b64_json: response?.data?.[0].b64_json || undefined,
      duration,
      prompt: prompt,
      model,
      size,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined;
  }
}

export { createShirtPattern };
