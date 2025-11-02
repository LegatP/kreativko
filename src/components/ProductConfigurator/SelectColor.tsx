import React from "react";
import cx from "classnames";
import { garmet } from "@/products";
import { Tooltip } from "@heroui/react";

interface SelectColorProps {
  color?: string;
  setColor: (color: string) => void;
}

export default function SelectColor({ color, setColor }: SelectColorProps) {
  return (
    <div className="flex flex-row gap-3 flex-wrap">
      {garmet.colors.map(({ name, hex }) => (
        <Tooltip key={name} content={name} placement="top">
          <button
            className={cx(
              "w-6 aspect-square rounded-full cursor-pointer transition-colors duration-200",
              color === hex
                ? "ring-primary ring-2 ring-offset-2"
                : "ring-2 ring-gray-200"
            )}
            style={{ background: hex }}
            onClick={() => setColor(hex)}
            aria-label={`Izberi barvo ${name}`}
          />
        </Tooltip>
      ))}
    </div>
  );
}
