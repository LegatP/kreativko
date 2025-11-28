import { uploadFile } from "@/lib/firebase/storage";
import { addToast, Card, Spinner } from "@heroui/react";
import React, { useState } from "react";
import { FileArrowUpIcon } from "@phosphor-icons/react";

interface FileUploadProps {
  onAssetUpload: (url: string) => void;
}

export default function FileUpload({ onAssetUpload }: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [numOfAssetsUploading, setNumOfAssetsUploading] = useState(0);

  async function uploadFilePrivate(e: React.ChangeEvent<HTMLInputElement>) {
    setNumOfAssetsUploading((prev) => prev + 1);
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const url = await uploadFile(file);

      onAssetUpload(url);
    } catch (error) {
      console.log("Error uploading file:", error);
      addToast({ title: "Napaka pri nalaganju datoteke.", color: "danger" });
    } finally {
      setNumOfAssetsUploading((prev) => prev - 1);
    }
  }

  return (
    <>
      <Card
        className="p-4 border-dashed border-2 border-gray-900 cursor-pointer bg-transparent aspect-square flex items-center justify-center"
        isPressable
        onPress={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden absolute"
          onChange={uploadFilePrivate}
        />
        <FileArrowUpIcon size={36} weight="fill" className="absolute " />
      </Card>
      {Array.from({ length: numOfAssetsUploading }).map((_, index) => (
        <Card
          key={index}
          className="aspect-square p-0 overflow-hidden items-center justify-center"
        >
          <Spinner color="primary" size="md" />
        </Card>
      ))}
    </>
  );
}
