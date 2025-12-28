"use client";

import { useState, useMemo } from "react";
import { Button } from "@heroui/react";
import { SparkleIcon } from "@phosphor-icons/react";
import PromptInput from "@/components/common/PromptInput";
import {
  analyzeImageForSuggestions,
  type ImageAnalysisSuggestion,
} from "@/actions/openai";
import { uploadFile } from "@/lib/firebase/storage";
import LabeledDivider from "@/components/common/LabeledDivider";
import SuggestionList from "@/components/common/SuggestionList";

interface UploadStepProps {
  onSubmit: (file: File, prompt?: string, uploadedUrl?: string) => void;
  initialFile: File; // Required - file is always pre-selected via wizard
  isSubmitting?: boolean;
}

export default function UploadStep({
  onSubmit,
  initialFile,
  isSubmitting = false,
}: UploadStepProps) {
  const [suggestions, setSuggestions] = useState<ImageAnalysisSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setShowSuggestions(true);
    setIsLoadingSuggestions(true);

    try {
      // Upload file to Firebase first, then pass URL to OpenAI
      const imageUrl = await uploadFile(initialFile);
      setUploadedImageUrl(imageUrl);
      const result = await analyzeImageForSuggestions(imageUrl);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handlePromptSubmit = (prompt: string, images?: File[]) => {
    // Use the image from PromptInput if provided, otherwise use initialFile
    const file = images?.[0] || initialFile;
    // Reuse the already uploaded URL if available (from suggestions fetch)
    const existingUrl = file === initialFile ? uploadedImageUrl : null;
    onSubmit(file, prompt, existingUrl ?? undefined);
  };

  // Memoize initialImages to prevent infinite re-renders
  const initialImages = useMemo(() => [initialFile], [initialFile]);

  // Show prompt input with the uploaded image and suggestions
  return (
    <div className="space-y-4 -mb-4">
      {/* Prompt input */}
      <PromptInput
        placeholder="Opiši kaj želiš narediti s sliko..."
        onSubmit={handlePromptSubmit}
        allowImages={true}
        initialImages={initialImages}
        initialValue={selectedPrompt}
        disabled={isSubmitting}
      />

      {/* Show suggestions button - only when suggestions are not visible */}
      {!showSuggestions && (
        <Button
          variant="light"
          color="primary"
          size="sm"
          startContent={<SparkleIcon size={16} weight="duotone" />}
          onPress={fetchSuggestions}
          className="-mt-2"
        >
          Analiziraj sliko in prikaži predloge
        </Button>
      )}

      {/* Suggestions section */}
      {showSuggestions && (
        <>
          <LabeledDivider
            label={
              isLoadingSuggestions ? "analiziram sliko..." : "predlagane ideje"
            }
            className="mt-2"
          />
          <SuggestionList
            suggestions={suggestions}
            onSelect={setSelectedPrompt}
            isLoading={isLoadingSuggestions}
          />
        </>
      )}
    </div>
  );
}
