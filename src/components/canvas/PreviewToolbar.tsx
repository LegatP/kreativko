"use client";

import { Card, CardBody, Tooltip } from "@heroui/react";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";

interface PreviewToolbarProps {
  onRotate: () => void;
  className?: string;
}

export default function PreviewToolbar({ onRotate, className }: PreviewToolbarProps) {
  return (
    <Tooltip content="Zavrti model">
      <Card
        isPressable
        onPress={onRotate}
        className={className ?? "w-fit ml-4 sm:ml-0 lg:absolute lg:top-0 lg:-ml-2.5"}
      >
        <CardBody className="p-2.5">
          <ArrowsClockwiseIcon
            size={20}
            weight="bold"
            className="text-foreground"
          />
        </CardBody>
      </Card>
    </Tooltip>
  );
}
