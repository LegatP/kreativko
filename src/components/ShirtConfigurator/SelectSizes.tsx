import { Avatar, Badge, NumberInput } from "@heroui/react";
import React from "react";

enum ShirtSizes {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

interface SelectColorProps {
  size: Record<keyof typeof ShirtSizes, number>;
  setSize: (size: keyof typeof ShirtSizes) => void;
}

export default function SelectSizes({ size, setSize }: SelectColorProps) {
  return (
    <div className="flex flex-col gap-2">
      {Object.keys(ShirtSizes).map((s) => (
        <div className="flex flex-row gap-2 items-center" key={s}>
          <Avatar color="default" size="sm" radius="sm" name={s} />
          <NumberInput
            size="sm"
            width="40px"
            // label="Število kosov"
            labelPlacement="outside"
            minValue={0}
            maxValue={100}
          />
        </div>
      ))}
      {/* <p>Največje število kosov je 100. Za večje</p> */}
    </div>
  );
}
