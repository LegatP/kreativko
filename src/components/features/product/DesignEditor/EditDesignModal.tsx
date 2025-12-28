"use client";

import BaseDesignModal from "@/components/features/product/ProductSelection/BaseDesignModal";
import DesignEditor from "./DesignEditor";
import { PromptSuggestion } from "@/db/products";

interface EditDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  designUrl: string;
  designName: string;
  promptSuggestions?: PromptSuggestion[];
  onSubmit: (prompt: string, images?: File[]) => void;
  isLoading?: boolean;
  title: string;
  subtitle: string;
}

export default function EditDesignModal({
  isOpen,
  onClose,
  designUrl,
  designName,
  promptSuggestions,
  onSubmit,
  isLoading = false,
  title,
  subtitle,
}: EditDesignModalProps) {
  const handleSubmit = (prompt: string, images?: File[]) => {
    onSubmit(prompt, images);
    onClose();
  };

  return (
    <BaseDesignModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
    >
      <DesignEditor
        designUrl={designUrl}
        designName={designName}
        promptSuggestions={promptSuggestions}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </BaseDesignModal>
  );
}
