import React from "react";
import cx from "classnames";

const colors = [
  "#EFBD48",
  "#24C1E0",
  "#E02C2C",
  "#2CE07B",
  "#8B2CE0",
  "#E0A22C",
];

interface SelectColorProps {
  color: string;
  setColor: (color: string) => void;
}

export default function SelectColor({ color, setColor }: SelectColorProps) {
  return (
    <div className="flex gap-2 mb-4">
      {colors.map((c) => (
        <button
          key={c}
          className={cx(
            "w-8 h-8 rounded-full border-2 transition-colors duration-200 focus:outline-none cursor-pointer",
            color === c ? "border-gray-800" : "border-white"
          )}
          style={{ background: c }}
          onClick={() => setColor(c)}
          aria-label={`Izberi barvo ${c}`}
        />
      ))}
    </div>
  );
}
