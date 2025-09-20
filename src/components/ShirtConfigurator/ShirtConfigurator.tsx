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
            color={state.shirtConfig?.color || "#FFFFFF"}
            setColor={(color) =>
              setState({
                ...state,
                shirtConfig: { ...state.shirtConfig, color },
              })
            }
          />
        </AccordionItem>
        <AccordionItem key="2" title="Model">
          <SelectGender
            gender={state.shirtConfig?.gender || "male"}
            setGender={(gender) =>
              setState({
                ...state,
                shirtConfig: { ...state.shirtConfig, gender },
              })
            }
          />
        </AccordionItem>
        <AccordionItem key="3" title="Motiv">
          <SelectDesign
            assets={Object.entries(state.assets).map(([id, url]) => ({
              id,
              url,
            }))}
            onAssetUpload={(asset) =>
              setState({
                ...state,
                assets: { ...state.assets, [asset.id]: asset.url },
              })
            }
            onAssetSelect={(asset) =>
              setState({
                ...state,
                shirtConfig: {
                  ...state.shirtConfig,
                  frontPatternUrl: asset.url,
                },
              })
            }
            selectedAssetUrl={state.shirtConfig?.frontPatternUrl}
          />
        </AccordionItem>
        <AccordionItem key="4" title="Velikost in število">
          <SelectSizes
            size={state.shirtConfig?.size || "M"}
            setSize={(size) =>
              setState({
                ...state,
                shirtConfig: { ...state.shirtConfig, size },
              })
            }
          />
        </AccordionItem>
      </Accordion>
    </>
  );
}
