import { Avatar, Badge, NumberInput, Tab, Tabs } from "@heroui/react";
import React from "react";

interface SelectGenderProps {
  gender: "male" | "female";
  setGender: (gender: "male" | "female") => void;
}

export default function SelectGender({ gender, setGender }: SelectGenderProps) {
  return (
    // <div className="flex gap-2">
    //   {(["male", "female"] as Array<"male" | "female">).map((g) => (
    //     <button
    //       key={g}
    //       className={`px-4 py-2 rounded ${
    //         g === gender
    //           ? "bg-blue-500 text-white"
    //           : "bg-gray-200 text-gray-800"
    //       }`}
    //       onClick={() => setGender(g)}
    //     >
    //       {g === "male" ? "Moška" : "Ženska"}
    //     </button>
    //   ))}
    // </div>
    <Tabs fullWidth selectedKey={gender} onSelectionChange={setGender}>
      <Tab key="male" title="Moška"></Tab>
      <Tab key="female" title="Ženska"></Tab>
    </Tabs>
  );
}
