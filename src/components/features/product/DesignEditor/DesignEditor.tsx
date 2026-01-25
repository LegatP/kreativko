"use client";

import { useState, useMemo } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PromptInput from "@/components/common/PromptInput";
import LabeledDivider from "@/components/common/LabeledDivider";
import {
  SparkleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { PromptSuggestion } from "@/db/products";

interface DesignEditorProps {
  designUrl: string;
  designName: string;
  promptSuggestions?: PromptSuggestion[];
  onSubmit: (prompt: string, images?: File[], templateUrl?: string) => void;
  isLoading?: boolean;
}

// Helper to render prompt with variables as primary colored text
// If variableValues is provided, shows the current values; otherwise shows placeholders
function renderPromptWithVariables(
  suggestion: PromptSuggestion,
  variableValues?: Record<string, string>
) {
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
      // Get display text: current value (if provided) or placeholder
      const displayText = variableValues
        ? variableValues[variableKey] || variable.placeholder || variable.label || variableKey
        : variable.placeholder || variable.label || variableKey;

      parts.push(
        <span
          key={`var-${variableKey}`}
          className="text-primary font-medium mx-0.5"
        >
          {displayText}
        </span>
      );
    } else {
      parts.push(
        <span key={`unknown-${variableKey}`} className="text-default-400">
          {match[0]}
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
}

// Simple card that shows prompt with placeholders (no inline inputs)
function PromptSuggestionCard({
  suggestion,
  onSelect,
  index,
}: {
  suggestion: PromptSuggestion;
  onSelect: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        isPressable
        onPress={onSelect}
        className="border-2 border-transparent hover:border-primary/50 transition-colors w-full"
      >
        <CardBody className="flex flex-row items-center gap-3 p-3">
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
            <SparkleIcon size={16} weight="duotone" />
          </div>
          {/* Prompt with placeholders */}
          <div className="flex-1 flex flex-wrap items-center text-sm font-medium text-foreground leading-relaxed">
            {renderPromptWithVariables(suggestion)}
          </div>
          {/* Arrow icon */}
          <ArrowRightIcon
            size={16}
            weight="bold"
            className="text-default-400 flex-shrink-0"
          />
        </CardBody>
      </Card>
    </motion.div>
  );
}

// View for filling in variables (second step)
function VariableFillView({
  suggestion,
  onBack,
  onSubmit,
}: {
  suggestion: PromptSuggestion;
  onBack: () => void;
  onSubmit: (prompt: string) => void;
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

  // Build the final prompt with replaced variables
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

  const handleSubmit = () => {
    onSubmit(builtPrompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-4"
    >
      {/* Back button */}
      <Button
        variant="light"
        size="sm"
        startContent={<ArrowLeftIcon size={16} />}
        onPress={onBack}
        className="self-start -ml-2"
      >
        Nazaj
      </Button>

      {/* Prompt preview at top - updates live */}
      <Card className="bg-default-50">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
              <SparkleIcon size={16} weight="duotone" />
            </div>
            <div className="flex-1 flex flex-wrap items-center text-sm font-medium text-foreground leading-relaxed">
              {renderPromptWithVariables(suggestion, variableValues)}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Variable inputs */}
      {suggestion.variables.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-default-600">
            Izpolni podatke:
          </p>
          {suggestion.variables.map((variable) => (
            <Input
              key={variable.key}
              label={variable.label}
              placeholder={variable.placeholder}
              value={variableValues[variable.key] || ""}
              onValueChange={(value) => handleVariableChange(variable.key, value)}
              size="md"
              variant="bordered"
            />
          ))}
        </div>
      )}

      {/* Submit button */}
      <Button
        color="primary"
        size="lg"
        onPress={handleSubmit}
        className="mt-2 text-white"
      >
        Uporabi
      </Button>
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
  // Track which suggestion is selected for the two-step flow (null = selection view)
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<PromptSuggestion | null>(null);

  const handlePromptSubmit = async (prompt: string, images?: File[]) => {
    // Pass template URL directly for edit mode (instead of fetching as File)
    onSubmit(prompt, images, designUrl || undefined);
  };

  const handleSuggestionSelect = (suggestion: PromptSuggestion) => {
    // If suggestion has no variables, use it directly
    if (suggestion.variables.length === 0) {
      setPromptValue(suggestion.prompt);
    } else {
      // Go to variable fill step
      setSelectedSuggestion(suggestion);
    }
  };

  const handleVariableFillSubmit = (prompt: string) => {
    setPromptValue(prompt);
    setSelectedSuggestion(null);
  };

  const handleBack = () => {
    setSelectedSuggestion(null);
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

      <AnimatePresence mode="wait">
        {selectedSuggestion ? (
          // Step 2: Variable fill view
          <VariableFillView
            key="variable-fill"
            suggestion={selectedSuggestion}
            onBack={handleBack}
            onSubmit={handleVariableFillSubmit}
          />
        ) : (
          // Step 1: Selection view with prompt input and suggestions
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
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
                      onSelect={() => handleSuggestionSelect(suggestion)}
                      index={index}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
