"use client";

import { Card, Image, Tooltip, Select, SelectItem, Button } from "@heroui/react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { Trash, PencilSimpleIcon } from "@phosphor-icons/react";
import { PrintPosition } from "@/types/pricing.types";

interface BaseDesignCardProps {
  imageUrl: string;
  title?: string;
  className?: string;
  animate?: boolean;
}

interface SelectableDesignCardProps extends BaseDesignCardProps {
  variant: "selectable";
  selected?: boolean;
  onSelect: (imageUrl: string) => void;
}

interface EditableDesignCardProps extends BaseDesignCardProps {
  variant: "editable";
  position?: PrintPosition;
  onPositionChange?: (position: PrintPosition | undefined) => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

interface DisplayDesignCardProps extends BaseDesignCardProps {
  variant?: "display";
}

type DesignCardProps =
  | SelectableDesignCardProps
  | EditableDesignCardProps
  | DisplayDesignCardProps;

/**
 * Unified design card component supporting multiple variants:
 * - "selectable": Click to select, shows selection ring
 * - "editable": Shows position dropdown and edit/remove actions
 * - "display": Simple display without interactions (default)
 */
export default function DesignCard(props: DesignCardProps) {
  const { imageUrl, title, className = "", animate = true } = props;
  const variant = props.variant || "display";

  const imageElement = (
    <div className="w-full h-full relative">
      <NextImage
        src={imageUrl}
        alt={title || "Design"}
        fill
        className="object-contain"
      />
    </div>
  );

  const wrapWithAnimation = (content: React.ReactNode) => {
    if (!animate) return content;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  };

  // Selectable variant - used in galleries
  if (variant === "selectable") {
    const { selected, onSelect } = props as SelectableDesignCardProps;

    const cardContent = wrapWithAnimation(
      <Card
        className={`shadow-md aspect-square w-full ${
          selected ? "ring-2 ring-primary ring-offset-2" : ""
        } ${className}`}
        isPressable
        isHoverable
        onPress={() => onSelect(imageUrl)}
      >
        <Image
          as={NextImage}
          classNames={{ wrapper: "h-full" }}
          width={200}
          height={200}
          className="object-contain max-h-full"
          src={imageUrl}
          alt={title || "Design"}
        />
      </Card>
    );

    return title ? (
      <Tooltip content={title} placement="top">
        {cardContent}
      </Tooltip>
    ) : (
      cardContent
    );
  }

  // Editable variant - used in design management
  if (variant === "editable") {
    const { position, onPositionChange, onEdit, onRemove } =
      props as EditableDesignCardProps;

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {/* Design preview */}
        <div className="w-full aspect-square border border-default-200 rounded-xl overflow-hidden bg-default-50">
          {imageElement}
        </div>

        {/* Controls below the design */}
        <div className="flex flex-col gap-2">
          {/* Position dropdown */}
          {onPositionChange && (
            <Select
              label="Pozicija tiska"
              size="sm"
              placeholder="Izberi pozicijo"
              variant="underlined"
              selectedKeys={position ? [position] : []}
              onChange={(e) => {
                const value = e.target.value;
                onPositionChange(value ? (value as PrintPosition) : undefined);
              }}
              classNames={{ trigger: "h-10" }}
            >
              <SelectItem key="front">Spredaj</SelectItem>
              <SelectItem key="back">Zadaj</SelectItem>
            </Select>
          )}

          {/* Action buttons */}
          {(onEdit || onRemove) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  startContent={<PencilSimpleIcon size={14} weight="duotone" />}
                  onPress={onEdit}
                >
                  Spremeni
                </Button>
              )}
              {onRemove && (
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  startContent={<Trash size={14} weight="duotone" />}
                  onPress={onRemove}
                >
                  Odstrani
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Display variant - simple non-interactive display
  return wrapWithAnimation(
    <div
      className={`aspect-square border border-default-200 rounded-xl overflow-hidden bg-default-50 ${className}`}
    >
      {imageElement}
    </div>
  );
}
