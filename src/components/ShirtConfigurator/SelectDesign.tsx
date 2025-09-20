import { Asset, createAsset } from "@/db/assets";
import { uploadFile } from "@/lib/firebase/storage";
import { addToast, Card, Spinner } from "@heroui/react";
import Image from "next/image";
import React, { useState } from "react";
import cx from "classnames";
import { FileArrowUpIcon } from "@phosphor-icons/react";

interface DisplayedAsset {
  id: string;
  url: string;
}

interface SelectDesignProps {
  assets: DisplayedAsset[];
  onAssetUpload: (asset: Asset & { id: string }) => void;
  onAssetSelect?: (asset: DisplayedAsset) => void;
  selectedAssetUrl?: string;
}

export default function SelectDesign({
  assets = [],
  onAssetUpload,
  onAssetSelect,
  selectedAssetUrl,
}: SelectDesignProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [numOfAssetsUploading, setNumOfAssetsUploading] = useState(0);

  async function uploadFilePrivate(e: React.ChangeEvent<HTMLInputElement>) {
    setNumOfAssetsUploading((prev) => prev + 1);
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const url = await uploadFile(file);

      const asset = await createAsset({ url, type: file.type });

      if (asset) {
        onAssetUpload(asset);
      }
    } catch (error) {
      console.log("Error uploading file:", error);
      addToast({ title: "Napaka pri nalaganju datoteke.", color: "danger" });
    } finally {
      setNumOfAssetsUploading((prev) => prev - 1);
    }
  }

  console.log("Assets in SelectDesign:", assets);
  return (
    <div className="grid grid-cols-3 gap-4">
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
        <FileArrowUpIcon size={40} weight="fill" className="absolute " />
      </Card>
      {Array.from({ length: numOfAssetsUploading }).map((_, index) => (
        <Card
          key={index}
          className="aspect-square p-0 overflow-hidden items-center justify-center"
        >
          <Spinner color="primary" size="md" />
        </Card>
      ))}
      {assets.map((asset) => (
        <Card
          key={asset.url}
          className={cx(
            "aspect-square p-0 overflow-hidden",
            selectedAssetUrl === asset.url && "ring-2 ring-primary"
          )}
          isPressable
          onPress={() => onAssetSelect?.(asset)}
        >
          <Image
            unoptimized
            src={asset.url}
            alt="Asset"
            className="w-full h-full object-cover"
            width={150}
            height={150}
          />
        </Card>
      ))}
    </div>
  );
}
