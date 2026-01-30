"use client";

import { useState } from "react";
import PromptInput from "@/components/common/PromptInput";
import LabeledDivider from "@/components/common/LabeledDivider";

// Example prompts with labels
const EXAMPLE_PROMPTS = [
  {
    label: "Motiv za dekliščino",
    prompt:
      "Ilustracija za dekliščino z osrednjim motivom silhuete neveste v dolgi obleki, poudarjene z roza barvo, ob njej stojita dve ženski silhueti v zapeljivih pozah z majhnimi hudičevimi rogovi in vilami. Okoli zgornjega dela so raztreseni majhni srčki. Spodaj je dekorativen tipografski napis »Nevestina straža« v igrivi, ženstveni pisavi. Barvna paleta je omejena na črno, roza in belo, čiste linije, raven vektorski slog, jasen kontrast.",
  },
  {
    label: "Urbani bober",
    prompt:
      "Ilustracija bobra v urbanem streetwear slogu, stoje in sprednji pogled. Bober nosi temna sončna očala, turkizno modro jakno s kapuco in rumeno podlogo, pod njo živahno grafično majico z ilustriranim motivom. Slog je čista vektorska ilustracija z ostrimi linijami, visokim kontrastom in nasičenimi barvami (turkizna, oranžna, roza). Rahli barvni madeži in pršci okoli figure, belo ozadje, sodoben, igriv in trendovski videz.",
  },
  {
    label: "Letnik rojstva",
    prompt:
      "Tipografski dizajn majice z velikim napisom »LETNIK 1985«. Krepka vintage pisava, rahlo obrabljen tisk, brez ilustracij, centrirana postavitev. Barvna paleta: črna in bela, čist vektorski slog.",
  },
  {
    label: "Prometni znak",
    prompt:
      "Grafičen dizajn majice z velikim okroglim prometnim znakom, v sredini letnica 40, pod znakom majhen ročno narisan napis »jih imam, pa kaj!«. Barve: rdeča, črna, bela; čisti flat vektorski slog.",
  },
  {
    label: "Ognjena lobanja",
    prompt:
      "Kul lobanja s sončnimi očali, obdana z živahnimi barvnimi plameni in preprostimi grafičnimi oblikami, z močnim kontrastom in jasnimi linijami na svetlem ozadju.",
  },
  {
    label: "Mestni kolesar",
    prompt:
      "Minimalistična silhueta mestnega kolesarja se zliva z abstraktnimi linijami vetra in svetlobe, ki ustvarjajo občutek hitrosti, svobode in urbanega utripa.",
  },
  {
    label: "Digitalni tiger",
    prompt:
      "Divji tiger iz digitalnih fragmentov rjovi skozi eksplozijo barv, pikslov in dinamičnih oblik, ki izražajo moč, upor in sodobni slog.",
  },
];

interface DescribeStepProps {
  onPromptSubmit: (prompt: string, images?: File[]) => void;
  isSubmitting?: boolean;
}

export default function DescribeStep({
  onPromptSubmit,
  isSubmitting = false,
}: DescribeStepProps) {
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

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_PROMPTS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setSelectedPrompt(suggestion.prompt)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
