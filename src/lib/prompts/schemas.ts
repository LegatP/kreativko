import { z } from "zod";

// Response schema for structured output
export const ImageAnalysisResponseSchema = z.object({
  suggestions: z.array(z.string()).length(4),
});

export type ImageAnalysisResponse = z.infer<typeof ImageAnalysisResponseSchema>;
