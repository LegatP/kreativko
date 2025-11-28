import { Button, Textarea } from "@heroui/react";
import { PaintBrushHouseholdIcon } from "@phosphor-icons/react";
import { useState } from "react";
import DesignGallery from "../DesignGallery";

interface PromptFormProps {
  onSubmit: (prompt: string, selectedDesigns?: { url: string }[]) => void;
  isLoading?: boolean;
  initialPrompt?: string;
  initialFiles?: { url: string }[];
  initialSelectedDesigns?: { url: string }[];
}

export default function PromptForm({
  onSubmit,
  isLoading,
  initialPrompt,
  initialFiles,
  initialSelectedDesigns,
}: PromptFormProps) {
  const [selectedDesigns, setSelectedDesigns] = useState<{ url: string }[]>(
    initialSelectedDesigns || []
  );
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string }[]>(
    initialFiles || []
  );
  const [prompt, setPrompt] = useState(initialPrompt || "");

  const onSubmitPrivate = () => {
    onSubmit(prompt, selectedDesigns);
  };

  const onFileUpload = (url: string) => {
    setUploadedFiles((prev) => [...prev, { url }]);
    setSelectedDesigns((prev) => [...prev, { url, prompt: "" }]);
  };

  const onDesignSelect = (imageUrl: string) => {
    const asset = uploadedFiles.find((file) => file.url === imageUrl);
    if (!asset) return;
    if (selectedDesigns.includes(asset)) {
      setSelectedDesigns((prev) =>
        prev.filter((design) => design.url !== asset.url)
      );
    } else {
      setSelectedDesigns((prev) => [...prev, asset]);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={prompt}
        onValueChange={setPrompt}
        minRows={6}
        maxRows={12}
        autoFocus
        variant="bordered"
        color="primary"
        // placeholder="Opiši željen motiv..."
      />
      <p className="text-xs text-default-700 text-start mb-4">
        Naloži slike, ki bodo služile kot referenca za ustvarjanje motiva.
      </p>
      <DesignGallery
        withPlaceholder={false}
        selectedDesignUrls={selectedDesigns.map((design) => design.url)}
        designs={uploadedFiles.map((file) => ({
          url: file.url,
        }))}
        onDesignSelect={onDesignSelect}
        onUpload={onFileUpload}
        isSmallCards
      />
      <Button
        startContent={
          <PaintBrushHouseholdIcon className="w-5 h-5" weight="fill" />
        }
        variant="solid"
        color="primary"
        fullWidth
        // onPress={() => handleGenerateMotif(prompt)}
        onPress={onSubmitPrivate}
        isDisabled={!prompt.trim() || isLoading}
        isLoading={isLoading}
        className="text-white"
      >
        {/* {isLoading ? "Pripravljam motiv..." : labelsMap[mode]} */}
        {isLoading ? "Pripravljam motiv..." : "Ustvari motiv"}
      </Button>
    </div>
  );
}
