"use client";

import { useState } from "react";
import PromptInput from "@/components/common/PromptInput";
import LabeledDivider from "@/components/common/LabeledDivider";
import SuggestionList from "@/components/common/SuggestionList";

// Example prompts in Slovenian for cool t-shirt designs
const EXAMPLE_PROMPTS = [
  {
    id: "1",
    prompt:
      "Stiliziran volk z geometrijskimi oblikami in ostrimi linijami, ki izžareva moč, svobodo in urbano energijo sodobne ulične kulture.",
  },
  {
    id: "2",
    prompt:
      "Temen vesoljski motiv z luno in zvezdami ter preprostim, a močnim napisom »NO LIMITS«, ki daje občutek širine, sanj in poguma.",
  },
  {
    id: "3",
    prompt:
      "Kul lobanja z sončnimi očali, obdana z živahnimi barvnimi plameni in preprostimi grafičnimi oblikami, z močnim kontrastom in jasnimi linijami na svetlem ozadju.",
  },
  {
    id: "4",
    prompt:
      "Minimalistična silhueta mestnega kolesarja se zliva z abstraktnimi linijami vetra in svetlobe, ki ustvarjajo občutek hitrosti, svobode in urbanega utripa.",
  },
  {
    id: "5",
    prompt:
      "Divji tiger iz digitalnih fragmentov rjovi skozi eksplozijo barv, pikslov in dinamičnih oblik, ki izražajo moč, upor in sodobni slog.",
  },
];

interface DescribeStepProps {
  onPromptSubmit: (prompt: string, images?: File[]) => void;
  isSubmitting?: boolean;
}

export default function DescribeStep({ onPromptSubmit, isSubmitting = false }: DescribeStepProps) {
  const [selectedPrompt, setSelectedPrompt] = useState("");

  return (
    <div className="space-y-6">
      {/* Prompt input */}
      <PromptInput
        placeholder="Opiši svoj motiv..."
        onSubmit={onPromptSubmit}
        allowImages={true}
        initialValue={selectedPrompt}
        disabled={isSubmitting}
      />

      {/* Divider */}
      <LabeledDivider label="preizkusi spodnje ideje" />

      {/* Example prompts */}
      <SuggestionList
        suggestions={EXAMPLE_PROMPTS}
        onSelect={setSelectedPrompt}
      />
    </div>
  );
}
