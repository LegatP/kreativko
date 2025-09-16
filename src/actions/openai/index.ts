"use server";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

async function createShirtPattern(prompt: string) {
  try {
    console.log("Generating image with prompt:", prompt);
    const reponse = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
      n: 1,
    });
    console.log(reponse);
    return reponse?.data?.[0].b64_json || undefined;
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined;
  }
}

export { createShirtPattern };
