"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  closeToast,
  Divider,
  Textarea,
} from "@heroui/react";
import CanvasModel from "@/components/canvas";
import ProductConfigurator from "@/components/ProductConfigurator";
import { createShirtPattern } from "@/actions/openai";
import { useState } from "react";
import { useAppStateContext } from "@/components/contexts/AppContext";
import { uploadFile } from "@/lib/firebase/storage";
import { createAsset } from "@/db/assets";

import cx from "classnames";
import { ArrowRightIcon, StarFourIcon } from "@phosphor-icons/react";
import { Product } from "@/types/product.types";
import PromptToolbar from "@/components/layout/PromptToolbar";
import { ProductIcons } from "@/config";

// UX
// Homepahe: input with dropdown and prompt suggestions, similar to
// /kreiraj => similar to adobe firefrefly

export default function Page() {
  const { state, setState, currentProductConfig, setCurrentProductConfig } =
    useAppStateContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");

  console.log("Current state:", state);
  console.log("Current product config:", currentProductConfig);

  async function onCreate() {
    setIsGenerating(true);
    // console.log("generating");
    const toastId = addToast({
      title: "Kreativko ustvarja tvoj motiv.",
      color: "default",
      description: "To lahko traja nekaj časa. Ne zapiraj brskalnika.",
      isClosing: false,
      promise: new Promise(() => {}),
    });
    try {
      const response = await createShirtPattern(prompt, state.designStyle);
      // console.log(response);

      if (!response?.b64_json) throw new Error("No image generated");

      // console.log("uploading");
      const url = await uploadFile(response?.b64_json);

      const asset = await createAsset({ url, type: "image/png" });

      if (asset) {
        setState({
          ...state,
          assets: { ...state.assets, [asset.id]: asset.url },
        });
        setCurrentProductConfig({
          ...currentProductConfig,
          frontPatternUrl: asset.url,
        });
      }
      if (toastId) {
        closeToast(toastId);
      }
    } catch (error) {
      console.log("Error generating ai file:", error);
      if (toastId) {
        closeToast(toastId);
      }
      addToast({ title: "Napaka pri generiranju motiva.", color: "danger" });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="relative h-[calc(100vh-65px)] bg-gray-100">
      <div className="flex flex-row gap-4 p-8 items-end h-full">
        <div className="hidden md:flex flex-col h-full gap-2">
          <div className="flex flex-row gap-2">
            {Object.values(Product).map((key, index) => {
              const Icon = ProductIcons[key];
              return (
                <Card
                  className={cx(
                    "aspect-square h-12 items-center justify-center",
                    state.selectedProduct === key && "ring-2 ring-primary"
                  )}
                  radius="md"
                  key={index}
                  isPressable
                  onPress={() => setState({ ...state, selectedProduct: key })}
                >
                  <Icon size={32} />
                </Card>
              );
            })}
          </div>
          <Card className="w-[272px] h-full" isBlurred>
            {/* <CardHeader className="font-bold">Moje naročilo</CardHeader>
            <Divider /> */}
            <CardBody>
              <ProductConfigurator />
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                color="primary"
                fullWidth
                endContent={
                  <ArrowRightIcon className="text-white" weight="bold" />
                }
              >
                <span className="text-white font-medium">Naprej</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="flex w-full flex-col h-full">
          <CanvasModel />
          <PromptToolbar />
          <div className="relative w-full flex flex-col">
            <Textarea
              classNames={{
                inputWrapper: "bg-white",
              }}
              variant="faded"
              color="primary"
              label="Kreiraj motiv"
              rows={20}
              placeholder="Opiši motiv..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              isClearable
            />
            <Button
              isDisabled={isGenerating}
              color="primary"
              startContent={
                <StarFourIcon className="text-white" weight="fill" />
              }
              size="sm"
              className="absolute bottom-2 right-2"
              onPress={onCreate}
              disabled={!prompt.trim()}
            >
              <span className="text-white font-medium">Kreiraj</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
