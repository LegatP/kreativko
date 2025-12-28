"use client";

import { useState, useMemo } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import PromptInput from "@/components/common/PromptInput";
import LabeledDivider from "@/components/common/LabeledDivider";
import { SparkleIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { PromptSuggestion } from "@/db/products";

interface DesignEditorProps {
  designUrl: string;
  designName: string;
  promptSuggestions?: PromptSuggestion[];
  onSubmit: (prompt: string, images?: File[]) => void;
  isLoading?: boolean;
}

// Component for a single prompt suggestion with inline variable inputs
function PromptSuggestionCard({
  suggestion,
  onUse,
  index,
}: {
  suggestion: PromptSuggestion;
  onUse: (prompt: string) => void;
  index: number;
}) {
  // Initialize with default values
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      suggestion.variables.forEach((v) => {
        initial[v.key] = v.defaultValue || "";
      });
      return initial;
    }
  );

  // Build the prompt with replaced variables (use defaultValue if not filled)
  const builtPrompt = useMemo(() => {
    let prompt = suggestion.prompt;
    suggestion.variables.forEach((variable) => {
      const value = variableValues[variable.key] || variable.defaultValue || "";
      prompt = prompt.replace(
        new RegExp(`\\{\\{${variable.key}\\}\\}`, "g"),
        value
      );
    });
    return prompt;
  }, [suggestion, variableValues]);

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleUse = () => {
    onUse(builtPrompt);
  };

  // Render prompt text with inline inputs for variables
  const renderPromptWithInputs = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /\{\{(\w+)\}\}/g;
    let match;

    while ((match = regex.exec(suggestion.prompt)) !== null) {
      // Add text before the variable
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {suggestion.prompt.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Find the variable config
      const variableKey = match[1];
      const variable = suggestion.variables.find((v) => v.key === variableKey);

      if (variable) {
        parts.push(
          <Input
            key={`input-${variableKey}`}
            size="sm"
            isClearable={false}
            variant="flat"
            placeholder={variable.placeholder}
            value={variableValues[variableKey] || ""}
            onValueChange={(value) => handleVariableChange(variableKey, value)}
            className="inline-flex w-auto min-w-[80px] max-w-[100px] mx-1"
            classNames={{
              input: "text-sm text-center",
              inputWrapper: "h-7 min-h-7 px-1",
            }}
          />
        );
      } else {
        // Variable not found in config, show as text
        parts.push(
          <span key={`unknown-${variableKey}`} className="text-default-400">
            {variableValues[variableKey] || match[0]}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last variable
    if (lastIndex < suggestion.prompt.length) {
      parts.push(
        <span key={`text-end`}>{suggestion.prompt.slice(lastIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-2 border-transparent hover:border-primary/50 transition-colors w-full">
        <CardBody className="flex flex-row items-center gap-3 p-3">
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
            <SparkleIcon size={16} weight="duotone" />
          </div>
          {/* Prompt with inline inputs */}
          <div className="flex-1 flex flex-wrap items-center text-sm font-medium text-foreground leading-relaxed">
            {renderPromptWithInputs()}
          </div>
          {/* Arrow button on right */}
          <Button
            variant="light"
            color="primary"
            size="sm"
            isIconOnly
            onPress={handleUse}
            className="flex-shrink-0"
          >
            <ArrowRightIcon size={16} weight="bold" />
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default function DesignEditor({
  designUrl,
  designName,
  promptSuggestions,
  onSubmit,
  isLoading = false,
}: DesignEditorProps) {
  const [promptValue, setPromptValue] = useState("");

  const handlePromptSubmit = async (prompt: string, images?: File[]) => {
    // Always include the current design as a reference image for high fidelity
    if (designUrl) {
      try {
        const response = await fetch(designUrl);
        const blob = await response.blob();
        const designFile = new File([blob], "design-reference.png", {
          type: "image/png",
        });
        // Combine design reference with any user-provided images
        const allImages = [designFile, ...(images || [])];
        onSubmit(prompt, allImages);
        return;
      } catch (error) {
        console.error("Failed to fetch design image:", error);
      }
    }
    onSubmit(prompt, images);
  };

  const handleSuggestionUse = (prompt: string) => {
    setPromptValue(prompt);
  };

  const hasPromptSuggestions = promptSuggestions && promptSuggestions.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Design preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square max-w-[280px] mx-auto w-full rounded-xl overflow-hidden bg-gradient-to-br from-default-100 to-default-200"
      >
        {designUrl && (
          <Image
            src={designUrl}
            alt={designName}
            fill
            className="object-contain"
          />
        )}
      </motion.div>

      {/* Prompt input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PromptInput
          placeholder="Opiši kako bi spremenil motiv..."
          onSubmit={handlePromptSubmit}
          allowImages={true}
          initialValue={promptValue}
          disabled={isLoading}
        />
      </motion.div>

      {/* Prompt Suggestions */}
      {hasPromptSuggestions && (
        <>
          {/* Divider */}
          <LabeledDivider label="ali preizkusi spodnje ideje" />

          {/* Suggestion cards */}
          <div className="flex flex-col gap-3">
            {promptSuggestions.map((suggestion, index) => (
              <PromptSuggestionCard
                key={index}
                suggestion={suggestion}
                onUse={handleSuggestionUse}
                index={index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
