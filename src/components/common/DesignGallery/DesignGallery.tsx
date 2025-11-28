"use client";

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import DesignCard from "@/components/UI/DesignCard";
import cx from "classnames";
import FileUpload from "../FileUpload/FileUpload";

export interface Design {
  title?: string;
  url: string;
}

interface DesignGalleryProps {
  designs: Design[];
  selectedDesignUrls?: string[] | string;
  onDesignSelect: (imageUrl: string) => void;
  withPlaceholder?: boolean;
  isSmallCards?: boolean;
  onUpload?: (url: string) => void;
}

export default function DesignGallery({
  selectedDesignUrls,
  onDesignSelect,
  designs,
  withPlaceholder = false,
  onUpload,
  isSmallCards = false,
}: DesignGalleryProps) {
  if (designs.length === 0 && !withPlaceholder && !onUpload) {
    return null;
  }
  const selectedDesignUrlsArray = Array.isArray(selectedDesignUrls)
    ? selectedDesignUrls
    : [selectedDesignUrls];

  return (
    <div
      className={cx("grid gap-3 mb-4", {
        "grid-cols-4": isSmallCards,
        "grid-cols-3": !isSmallCards,
      })}
    >
      {withPlaceholder && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="aspect-square animate-pulse bg-default-100 shadow-md">
            <CardBody className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {onUpload && <FileUpload onAssetUpload={onUpload} />}

      {designs.map((design, index) => (
        <DesignCard
          key={design.url + index}
          title={design.title || ""}
          isSelected={selectedDesignUrlsArray?.includes(design.url)}
          designUrl={design.url}
          handleDesignSelect={onDesignSelect}
        />
      ))}
    </div>
  );
}
