import { Avatar, Divider, NumberInput } from "@heroui/react";
import React from "react";

interface SelectSizesProps {
  sizes: Record<string, number>;
  setSize: (size: string, value: number) => void;
}

export default function SelectSizes({ sizes, setSize }: SelectSizesProps) {
  return (
    <div className="flex flex-col gap-2">
      {Object.keys(sizes).map((s) => (
        <div
          className="flex flex-row gap-2 items-center justify-between"
          key={s}
        >
          <Avatar
            color="primary"
            size="sm"
            radius="sm"
            name={s}
            className="bg-primary-100 text-primary-600 font-medium"
          />
          <NumberInput
            // className="w-16"
            size="sm"
            width="40px"
            // label="Število kosov"
            labelPlacement="outside"
            minValue={0}
            maxValue={100}
            value={sizes[s]}
            onValueChange={(value) => setSize(s, value)}
            variant="underlined"
            color="default"
          />
        </div>
      ))}
      {/* <p>Največje število kosov je 100. Za večje</p> */}
    </div>
  );
}
