import React from "react";
import cx from "classnames";

const colors = [
  "#FFFFFF",
  "#000000",
  "#EFBD48",
  "#24C1E0",
  "#E02C2C",
  "#2CE07B",
  "#8B2CE0",
  "#E0A22C",
];

interface SelectColorProps {
  color?: string;
  setColor: (color: string) => void;
}

export default function SelectColor({ color, setColor }: SelectColorProps) {
  return (
    <div className="flex flex-row gap-3 flex-wrap">
      {colors.map((c) => (
        <button
          key={c}
          className={cx(
            "w-6 aspect-square rounded-full cursor-pointer transition-colors duration-200",
            color === c
              ? "ring-primary ring-2 ring-offset-2"
              : "ring-2 ring-gray-200"
          )}
          style={{ background: c }}
          onClick={() => setColor(c)}
          aria-label={`Izberi barvo ${c}`}
        />
      ))}
    </div>
  );
}
