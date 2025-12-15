import { Chip, NumberInput } from "@heroui/react";

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
          <Chip
            color="primary"
            size="md"
            radius="sm"
            className="bg-primary-100 text-primary-600"
          >
            <div className="min-w-[26px] text-center">{s}</div>
          </Chip>
          <NumberInput
            size="sm"
            width="40px"
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
    </div>
  );
}
