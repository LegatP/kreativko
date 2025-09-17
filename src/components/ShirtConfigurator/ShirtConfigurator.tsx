import React from "react";
import { useAppStateContext } from "../contexts/AppContext";
import SelectColor from "./SelectColor";
import SelectSizes from "./SelectSizes";
import { Accordion, AccordionItem } from "@heroui/react";
import SelectGender from "./SelectModel";
import SelectDesign from "./SelectDesign";

export default function ShirtConfigurator() {
  const { state, setState } = useAppStateContext();

  return (
    <>
      <Accordion
        variant="light"
        defaultExpandedKeys={["1", "2", "3", "4"]}
        selectionMode="multiple"
      >
        <AccordionItem key="1" title="Barva">
          <SelectColor
            color={state.color}
            setColor={(color) => setState({ ...state, color })}
          />
        </AccordionItem>
        <AccordionItem key="2" title="Model">
          <SelectGender
            gender={state.gender}
            setGender={(gender) => setState({ ...state, gender })}
          />
        </AccordionItem>
        <AccordionItem key="3" title="Velikost in število">
          <SelectSizes
            size={state.size}
            setSize={(size) => setState({ ...state, size })}
          />
        </AccordionItem>
        <AccordionItem key="4" title="Izberi motiv">
          <SelectDesign
            designUrls={[state.shirtPatternUrl]}
            setDesignUrl={(url) => setState({ ...state, shirtPatternUrl: url })}
          />
        </AccordionItem>
      </Accordion>
      {/* <div className="font-semibold mb-2">
        Izberi ali naloži sliko za majico:
      </div>
      <div className="flex gap-2 mb-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (reader.result && typeof reader.result === "string") {
                  setState({ ...state, shirtPatternUrl: reader.result });
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {state.shirtPatternUrl && (
          <img
            src={state.shirtPatternUrl}
            alt="Majica vzorec"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              objectFit: "cover",
              border: "1px solid #ccc",
            }}
          />
        )}
      </div> */}
    </>
  );
}
