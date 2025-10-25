import React from "react";
import { Card, Image, Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import NextImage from "next/image";

interface DesignCardProps {
  title: string;
  isSelected?: boolean;
  designUrl: string;
  handleDesignSelect: (imageUrl: string) => void;
}

export default function DesignCard({
  title,
  isSelected,
  designUrl,
  handleDesignSelect,
}: DesignCardProps) {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`shadow-md aspect-square w-full ${
          isSelected ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
        isPressable
        isHoverable
        onPress={() => handleDesignSelect(designUrl)}
      >
        <Image
          as={NextImage}
          classNames={{
            wrapper: "h-full",
          }}
          width={200}
          height={200}
          className="object-contain max-h-full"
          src={designUrl}
          alt={title || "Design"}
        />
      </Card>
    </motion.div>
  );

  return title ? (
    <Tooltip content={title} placement="top">
      {cardContent}
    </Tooltip>
  ) : (
    cardContent
  );
}
