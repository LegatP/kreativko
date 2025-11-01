"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Image,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { DesignStyle } from "@/types/product.types";

const configurables = [
  {
    id: "avocado",
    type: "fruit-activity" as const,
    title: "Sadež/Zelenjava Motiv",
    presetImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760025709663_ai_generated.png?alt=media&token=5382d01a-7d47-434a-b01f-74cd7bf6ecc4",
    getPrompt: (object: string, action: string) =>
      `You are generating a T-Shirt design. The design consists of a character performing an action or doing activity based on the profession (should also include simple objects that represent that profession or activity). The design cosists of four non-perfect circles, each one representing ${object} in a different position. The positions should vary but match ${action}. The circles should be a bit deformed and not perfect circles. ${object} should be a simplistic cartoon-like character. The character should have stick-like arms and legs.`,
  },
  {
    id: "animal",
    type: "animal" as const,
    title: "Živalski Motiv",
    presetImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760013922058_ai_generated.png?alt=media&token=0b7d8a42-5dab-465e-8fd3-2dcccdaf9e4d",
    getPrompt: (animal: string) =>
      `
    A vibrant geometric-style digital illustration of a ${animal} sitting proudly on a rock with a small waterfall, in the background you can see Triglav (Slovenia's tallest mountain) with Aljaž tower at the top and Slovenian Flag and nature with flowers and tress found in Slovenia. The design uses polygonal shapes and vivid colors with soft gradients and stylized lighting, in a modern, cheerful aesthetic. The fox should be child-friendly, featuring big puppy-like eyes. The background should not have edges cut off - meaning all shapes should end on the image so it can blend with shirt color.

    `,
  },
  {
    id: "since",
    type: "since" as const,
    title: "Letnica rojstva",
    presetImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760023978638_ai_generated.png?alt=media&token=8f00f4b4-f5ec-482e-aa0f-c3c6ea47e95c",
    getPrompt: (title: "Od leta" | "Since" | "Letnik", year: string) =>
      `
    Napis "${title}" v eni vrstici in številka "${year}" v drugi vrstici. Vse velike začetnice. Besedilo mora biti poravnano na obe strani. Pisava številke naj bo v drugem stilu kot besedilo "${title}". Vintage and retro font types. Z dekoracijami okoli naslova.

    `,
  },
];

export default function Page() {
  // Separate state for each configurable
  const [configurableStates, setConfigurableStates] = useState<
    Record<string, Record<string, string>>
  >({
    avocado: { fruit: "", activity: "" },
    animal: { animal: "" },
    since: { title: "", year: "" },
  });

  // Separate generated images for each configurable
  const [generatedImages, setGeneratedImages] = useState<
    Record<string, string>
  >({});

  // Track which configurable is currently generating
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const { generateImage, isGenerating } = useImageGeneration();

  const handleInputChange = (
    configurableId: string,
    field: string,
    value: string
  ) => {
    setConfigurableStates((prev) => ({
      ...prev,
      [configurableId]: {
        ...prev[configurableId],
        [field]: value,
      },
    }));
  };

  const handleChipClick = (
    configurableId: string,
    field: string,
    value: string
  ) => {
    setConfigurableStates((prev) => ({
      ...prev,
      [configurableId]: {
        ...prev[configurableId],
        [field]: value,
      },
    }));
  };

  const handleGenerateMotif = async (
    configurable: (typeof configurables)[0]
  ) => {
    const state = configurableStates[configurable.id];

    let prompt = "";
    let isValid = false;

    if (configurable.type === "fruit-activity") {
      isValid = Boolean(state.fruit?.trim() && state.activity?.trim());
      if (isValid) {
        prompt = configurable.getPrompt(state.fruit, state.activity);
      }
    } else if (configurable.type === "animal") {
      isValid = Boolean(state.animal?.trim());
      if (isValid) {
        prompt = configurable.getPrompt(state.animal);
      }
    } else if (configurable.type === "since") {
      isValid = Boolean(state.title?.trim() && state.year?.trim());
      if (isValid) {
        prompt = configurable.getPrompt(
          state.title as "Od leta" | "Since" | "Letnik",
          state.year
        );
      }
    }

    if (!isValid) return;

    setGeneratingId(configurable.id);

    try {
      const result = await generateImage(prompt, DesignStyle.Colorful);
      if (result?.url) {
        setGeneratedImages((prev) => {
          const updated = { ...prev, [configurable.id]: result.url };
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setGeneratingId(null);
    }
  };

  const isConfigurableValid = (configurable: (typeof configurables)[0]) => {
    const state = configurableStates[configurable.id];

    if (configurable.type === "fruit-activity") {
      return Boolean(state.fruit?.trim() && state.activity?.trim());
    } else if (configurable.type === "animal") {
      return Boolean(state.animal?.trim());
    } else if (configurable.type === "since") {
      return Boolean(state.title?.trim() && state.year?.trim());
    }

    return false;
  };

  const renderInputs = (configurable: (typeof configurables)[0]) => {
    const state = configurableStates[configurable.id];

    if (configurable.type === "fruit-activity") {
      return (
        <>
          <div>
            <Input
              label="Sadež ali zelenjava"
              placeholder="Avokado"
              value={state.fruit || ""}
              onChange={(e) =>
                handleInputChange(configurable.id, "fruit", e.target.value)
              }
            />
            <div className="flex flex-row flex-wrap mt-2">
              {[
                "Avokado",
                "Hruška",
                "Jabolko",
                "Banana",
                "Pomaranča",
                "Korenje",
                "Brokoli",
                "Paradižnik",
                "Paprika",
              ].map((item, chipIndex) => (
                <Chip
                  key={chipIndex}
                  size="sm"
                  className="m-1 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  onClick={() =>
                    handleChipClick(configurable.id, "fruit", item)
                  }
                  color={state.fruit === item ? "primary" : "default"}
                >
                  {item}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <Input
              label="Kaj počne oziroma kdo je?"
              placeholder="Izvaja jogo"
              value={state.activity || ""}
              onChange={(e) =>
                handleInputChange(configurable.id, "activity", e.target.value)
              }
            />
            <div className="flex flex-row flex-wrap mt-2">
              {[
                "Joga",
                "Tiskar majic",
                "Kolesarjenje",
                "Branje",
                "Zdravnik",
                "Kuhar",
                "Športnik",
                "Učitelj",
                "Slikar",
                "Programer",
                "Plesalec",
              ].map((item, chipIndex) => (
                <Chip
                  key={chipIndex}
                  size="sm"
                  className="m-1 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  onClick={() =>
                    handleChipClick(configurable.id, "activity", item)
                  }
                  color={state.activity === item ? "primary" : "default"}
                >
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        </>
      );
    } else if (configurable.type === "animal") {
      return (
        <div>
          <Input
            label="Žival"
            placeholder="Ris"
            value={state.animal || ""}
            onChange={(e) =>
              handleInputChange(configurable.id, "animal", e.target.value)
            }
          />
          <div className="flex flex-row flex-wrap mt-2">
            {[
              "Ris",
              "Lisica",
              "Medved",
              "Jelen",
              "Veverica",
              "Zajec",
              "Volk",
              "Rjavi medved",
              "Gamsi",
              "Sokol",
              "Orel",
              "Kozorog",
            ].map((item, chipIndex) => (
              <Chip
                key={chipIndex}
                size="sm"
                className="m-1 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                onClick={() => handleChipClick(configurable.id, "animal", item)}
                color={state.animal === item ? "primary" : "default"}
              >
                {item}
              </Chip>
            ))}
          </div>
        </div>
      );
    } else if (configurable.type === "since") {
      return (
        <>
          <div>
            <Select
              label="Naslov"
              placeholder="Izberi naslov"
              selectedKeys={state.title ? [state.title] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleInputChange(configurable.id, "title", selectedKey || "");
              }}
            >
              <SelectItem key="Od leta">Od leta</SelectItem>
              <SelectItem key="Since">Since</SelectItem>
              <SelectItem key="Letnik">Letnik</SelectItem>
            </Select>
          </div>
          <div>
            <Input
              label="Leto"
              placeholder="1995"
              value={state.year || ""}
              onChange={(e) =>
                handleInputChange(configurable.id, "year", e.target.value)
              }
            />
            <div className="flex flex-row flex-wrap mt-2">
              {[
                "1985",
                "1990",
                "1995",
                "2000",
                "2005",
                "2010",
                "2015",
                "2020",
              ].map((item, chipIndex) => (
                <Chip
                  key={chipIndex}
                  size="sm"
                  className="m-1 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  onClick={() => handleChipClick(configurable.id, "year", item)}
                  color={state.year === item ? "primary" : "default"}
                >
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center m-5">
      {configurables.map((configurable) => {
        const isCurrentlyGenerating = generatingId === configurable.id;
        const generatedImageUrl = generatedImages[configurable.id];

        return (
          <div
            key={configurable.id}
            className="flex flex-row gap-4 p-4 items-center"
          >
            <Card>
              <CardBody className="flex flex-col gap-4 p-4 items-center">
                <h2 className="text-lg font-semibold">{configurable.title}</h2>
                <h3 className="text-sm text-gray-600">Predogled motiva</h3>
                <div className="h-full w-60">
                  <Image
                    className="h-full"
                    src={configurable.presetImageUrl}
                    alt={"Preset preview"}
                  />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-col gap-4 p-4 items-center">
                <h3 className="text-lg font-semibold">Personaliziran motiv</h3>
                <div className="h-full w-60 aspect-square">
                  {generatedImageUrl ? (
                    <Image
                      className="h-full"
                      src={generatedImageUrl}
                      alt={"Generated motif"}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <p className="text-gray-500 text-center">
                        {isCurrentlyGenerating
                          ? "Ustvarjam motiv..."
                          : "Tvoj motiv bo prikazan tukaj"}
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-col gap-4 p-4 w-[500px]">
                <h3 className="text-xl font-bold">Personaliziraj motiv</h3>
                {renderInputs(configurable)}
                <Button
                  color="primary"
                  fullWidth
                  className="text-white"
                  onPress={() => handleGenerateMotif(configurable)}
                  isDisabled={
                    !isConfigurableValid(configurable) || isGenerating
                  }
                  isLoading={isCurrentlyGenerating}
                >
                  {isCurrentlyGenerating
                    ? "Ustvarjam motiv..."
                    : "Ustvari motiv"}
                </Button>
              </CardBody>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
