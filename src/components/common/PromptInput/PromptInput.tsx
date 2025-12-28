"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "@heroui/react";
import { XIcon, ImageSquareIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/useImageUpload";

interface PromptInputProps {
  placeholder?: string;
  onSubmit: (prompt: string, images?: File[]) => void;
  disabled?: boolean;
  allowImages?: boolean;
  initialValue?: string;
  initialImages?: File[];
}

export default function PromptInput({
  placeholder = "Opiši svoj motiv...",
  onSubmit,
  disabled = false,
  allowImages = true,
  initialValue = "",
  initialImages = [],
}: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use the image upload hook for all image handling
  const {
    previews,
    rawFiles,
    inputProps,
    removeFile,
    triggerInput,
    reset: resetImages,
  } = useImageUpload({ multiple: true, initialFiles: initialImages });

  // Sync with initialValue when it changes
  useEffect(() => {
    setPrompt(initialValue);
  }, [initialValue]);

  // DRY: Extract content check for reuse
  const hasContent = prompt.trim() || rawFiles.length > 0;
  const canSubmit = hasContent && !disabled;

  const handleSubmit = () => {
    if (hasContent) {
      onSubmit(prompt.trim(), rawFiles.length > 0 ? rawFiles : undefined);
      setPrompt("");
      resetImages();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  return (
    <div className="relative">
      {/* Hidden file input - spread inputProps from hook */}
      <input {...inputProps} />

      {/* Main input container */}
      <div className="flex flex-col border-2 border-default-200 rounded-2xl bg-white focus-within:border-primary transition-colors">
        {/* Image previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 pb-0">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative w-16 h-16 rounded-lg overflow-hidden group"
              >
                <Image
                  src={preview}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XIcon size={12} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <div className="flex items-start gap-2 p-2">
          {/* Image upload button */}
          {allowImages && (
            <Tooltip content="Dodaj slike" placement="top">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={triggerInput}
                className="text-default-400 hover:text-default-600 flex-shrink-0 mt-1"
              >
                <ImageSquareIcon size={22} weight="duotone" />
              </Button>
            </Tooltip>
          )}

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none resize-none text-foreground text-sm placeholder:text-default-400 py-2 px-1 min-h-[40px] max-h-[120px]"
          />

          {/* Submit button */}
          <Button
            isIconOnly
            color="primary"
            size="sm"
            variant="shadow"
            isDisabled={!canSubmit}
            isLoading={disabled}
            onPress={handleSubmit}
            className="rounded-full flex-shrink-0 self-end mb-1 text-white"
          >
            <PaperPlaneTiltIcon size={18} weight="fill" />
          </Button>
        </div>
      </div>
    </div>
  );
}
