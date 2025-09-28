import React from "react";
import { useAppStateContext } from "../contexts/AppContext";
import SelectColor from "./SelectColor";
import SelectSizes from "./SelectSizes";
import { Accordion, AccordionItem } from "@heroui/react";
import SelectGender from "./SelectModel";
import SelectDesign from "./SelectDesign";

export default function ProductConfigurator() {
  const { currentProductConfig, setCurrentProductConfig, state, setState } =
    useAppStateContext();

  const { color, model, frontPatternUrl, sizes } = currentProductConfig as {
    color: string;
    model: string;
    frontPatternUrl: string;
    sizes: Record<string, number>;
  };

  const assets = Object.entries(state.assets).map(([id, url]) => ({
    id,
    url,
  }));

  return (
    <Accordion
      variant="light"
      defaultExpandedKeys={["1", "2", "3", "4"]}
      selectionMode="multiple"
      itemClasses={{
        heading: "font-bold",
        trigger: "pb-1",
        content: "mb-2",
      }}
    >
      <AccordionItem key="1" title="Barva">
        <SelectColor
          color={color}
          setColor={(color) =>
            setCurrentProductConfig({
              ...currentProductConfig,
              color,
            })
          }
        />
      </AccordionItem>
      <AccordionItem key="2" title="Model">
        <SelectGender
          gender={(model as "male" | "female") || "male"}
          setGender={(gender) =>
            setCurrentProductConfig({
              ...currentProductConfig,
              model: gender,
            })
          }
        />
      </AccordionItem>
      <AccordionItem key="3" title="Motiv">
        <SelectDesign
          assets={assets}
          onAssetUpload={(asset) =>
            setState({
              ...state,
              assets: { ...state.assets, [asset.id]: asset.url },
            })
          }
          onAssetSelect={(asset) =>
            setCurrentProductConfig({
              ...currentProductConfig,
              frontPatternUrl: asset.url,
            })
          }
          selectedAssetUrl={frontPatternUrl}
        />
      </AccordionItem>
      <AccordionItem key="4" title="Velikost in število">
        <SelectSizes
          sizes={sizes || {}}
          setSize={(size, value) =>
            // @ts-expect-error index signature. TODO: fix
            setCurrentProductConfig({
              ...currentProductConfig,
              sizes: { ...currentProductConfig.sizes, [size]: value },
            })
          }
        />
      </AccordionItem>
    </Accordion>
  );
}
