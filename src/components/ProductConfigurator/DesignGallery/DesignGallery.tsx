"use client";

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import DesignCard from "@/components/UI/DesignCard";

export interface Design {
  title: string;
  imageUrl: string;
}

interface DesignGalleryProps {
  designs: Design[];
  selectedDesignUrl?: string;
  onDesignSelect: (imageUrl: string) => void;
  withPlaceholder?: boolean;
}

export default function DesignGallery({
  selectedDesignUrl,
  onDesignSelect,
  designs,
  withPlaceholder = false,
}: DesignGalleryProps) {
  if (designs.length === 0 && !withPlaceholder) {
    return null;
  }
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
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

      {designs.map((design, index) => (
        <DesignCard
          key={design.imageUrl + index}
          title={design.title}
          isSelected={selectedDesignUrl === design.imageUrl}
          designUrl={design.imageUrl}
          handleDesignSelect={onDesignSelect}
        />
      ))}
    </div>
  );
}
