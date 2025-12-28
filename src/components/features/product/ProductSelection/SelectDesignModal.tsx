"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, Tab, Spinner, Card } from "@heroui/react";
import { PlusIcon } from "@phosphor-icons/react";
import Image from "next/image";
import BaseDesignModal from "./BaseDesignModal";
import { useImageUpload } from "@/hooks/useImageUpload";
import { uploadFile } from "@/lib/firebase/storage";

interface CreatedDesign {
  url: string;
  title: string;
}

interface UploadedAsset {
  url: string;
}

interface UploadingFile {
  preview: string;
  isUploading: boolean;
  url?: string; // Set after upload completes
}

interface SelectDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  createdDesigns: CreatedDesign[];
  uploadedAssets?: UploadedAsset[];
  onSelectDesign: (url: string) => void;
  onAssetUploaded?: (url: string) => void;
}

interface ImageCardProps {
  src: string;
  alt: string;
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

function ImageCard({
  src,
  alt,
  onPress,
  isDisabled,
  isLoading,
}: ImageCardProps) {
  return (
    <Card
      isPressable={!isDisabled}
      isDisabled={isDisabled}
      onPress={onPress}
      className={`aspect-square border-default-200 overflow-hidden bg-default-50 hover:ring-1 hover:ring-primary transition-colors ${
        isLoading ? "cursor-wait opacity-70" : ""
      }`}
    >
      <div className="w-full h-full relative">
        <Image src={src} alt={alt} fill className="object-contain" />
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Spinner size="md" color="primary" />
          </div>
        )}
      </div>
    </Card>
  );
}

export default function SelectDesignModal({
  isOpen,
  onClose,
  createdDesigns,
  uploadedAssets = [],
  onSelectDesign,
  onAssetUploaded,
}: SelectDesignModalProps) {
  const [selectedTab, setSelectedTab] = useState<string>("created");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const { files, inputProps, triggerInput, clear } = useImageUpload({
    multiple: true,
  });
  const processedFilesRef = useRef<Set<string>>(new Set());

  // Upload files automatically when selected
  useEffect(() => {
    const uploadNewFiles = async () => {
      for (const item of files) {
        // Skip if already processed
        if (processedFilesRef.current.has(item.preview)) continue;
        processedFilesRef.current.add(item.preview);

        // Add to uploading state
        setUploadingFiles((prev) => [
          ...prev,
          { preview: item.preview, isUploading: true },
        ]);

        try {
          const url = await uploadFile(item.file);
          // Update state with uploaded URL
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.preview === item.preview ? { ...f, isUploading: false, url } : f
            )
          );
          // Notify parent to persist the uploaded asset
          onAssetUploaded?.(url);
        } catch (error) {
          console.error("Failed to upload file:", error);
          // Remove failed upload from state
          setUploadingFiles((prev) =>
            prev.filter((f) => f.preview !== item.preview)
          );
          processedFilesRef.current.delete(item.preview);
        }
      }
    };

    if (files.length > 0) {
      uploadNewFiles();
    }
  }, [files, onAssetUploaded]);

  // Clear state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUploadingFiles([]);
      processedFilesRef.current.clear();
      clear();
    }
  }, [isOpen, clear]);

  const handleSelect = (url: string) => {
    onSelectDesign(url);
    clear();
    onClose();
  };

  const handleClose = () => {
    clear();
    onClose();
  };

  return (
    <>
      <input {...inputProps} />
      <BaseDesignModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Izberi"
        size="2xl"
      >
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          variant="underlined"
          fullWidth
        >
          <Tab key="created" title="Ustvarjeni motivi">
            <div>
              {createdDesigns.length === 0 ? (
                <div className="text-center text-sm py-12 text-default-400">
                  <p>Nimate še ustvarjenih motivov.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {createdDesigns.map((design, index) => (
                    <ImageCard
                      key={index}
                      src={design.url}
                      alt={design.title || "Motiv"}
                      onPress={() => handleSelect(design.url)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Tab>
          <Tab key="files" title="Moje datoteke">
            <div>
              <div className="grid grid-cols-3 gap-3">
                {/* Upload button */}
                <button
                  onClick={triggerInput}
                  className="aspect-square border-2 border-dashed border-default-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors focus:outline-none focus:border-primary"
                >
                  <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center">
                    <PlusIcon size={20} className="text-default-500" />
                  </div>
                  <span className="text-sm text-default-500">Naloži</span>
                </button>

                {/* Previously uploaded assets from session */}
                {uploadedAssets.map((asset, index) => (
                  <ImageCard
                    key={`asset-${index}`}
                    src={asset.url}
                    alt={`Asset ${index + 1}`}
                    onPress={() => handleSelect(asset.url)}
                  />
                ))}

                {/* Newly uploaded files in this session (filter out ones already in uploadedAssets) */}
                {uploadingFiles
                  .filter(
                    (item) =>
                      !item.url ||
                      !uploadedAssets.some((a) => a.url === item.url)
                  )
                  .map((item, index) => (
                    <ImageCard
                      key={`file-${index}`}
                      src={item.preview}
                      alt={`Upload ${index + 1}`}
                      onPress={() => item.url && handleSelect(item.url)}
                      isDisabled={item.isUploading}
                      isLoading={item.isUploading}
                    />
                  ))}
              </div>
            </div>
          </Tab>
        </Tabs>
      </BaseDesignModal>
    </>
  );
}
