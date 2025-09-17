import { createAsset } from "@/db/assets";
import { uploadFile } from "@/lib/firebase/storage";
import { Avatar, Badge, Card, Image, NumberInput } from "@heroui/react";
import React from "react";

interface SelectDesignProps {
  designUrls: string[];
  setDesignUrl: (url: string) => void;
}

export default function SelectDesign({
  designUrls,
  setDesignUrl,
}: SelectDesignProps) {
  async function uploadFilePrivate(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log(file);
    const url = await uploadFile(file);

    console.log("Uploaded file URL:", url);

    console.log("Creating asset with URL:", url, "and type:", file.type);

    const asset = await createAsset({ url, type: file.type });

    console.log("Created asset:", asset);
  }

  return (
    <div>
      {designUrls.map((url) => (
        <Image key={url} src={url} alt="Design" />
      ))}
      <Card className="p-4 border-dashed border-2 border-gray-300 cursor-pointer hover:bg-gray-50">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadFilePrivate}
          />
          Naloži svojo sliko
        </label>
      </Card>
    </div>
  );
}
