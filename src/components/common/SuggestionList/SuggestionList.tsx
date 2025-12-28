"use client";

import { ReactNode } from "react";
import SuggestionCard from "@/components/common/SuggestionCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import LabeledDivider from "@/components/common/LabeledDivider";

interface Suggestion {
  id: string;
  prompt: string;
}

interface SuggestionListProps {
  suggestions: Suggestion[];
  onSelect: (prompt: string) => void;
  title?: string;
  isLoading?: boolean;
  icon?: ReactNode;
}

export default function SuggestionList({
  suggestions,
  onSelect,
  title,
  isLoading = false,
  icon,
}: SuggestionListProps) {
  return (
    <>
      {/* Divider with title */}
      {title && <LabeledDivider label={title} className="mt-2" />}

      {/* Loading state */}
      {isLoading && <LoadingSpinner className="py-8" />}

      {/* Suggestions */}
      {!isLoading && suggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={suggestion.id}
              prompt={suggestion.prompt}
              onSelect={onSelect}
              icon={icon}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}
    </>
  );
}
