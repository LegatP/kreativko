"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  closeToast,
  Divider,
  Textarea,
} from "@heroui/react";
import CanvasModel from "@/components/canvas";
import AnimatedHeading from "../../components/layout/AnimatedHeading/AnimatedHeading";
import ShirtConfigurator from "@/components/ShirtConfigurator";
import { createShirtPattern } from "@/actions/openai";
import { useState } from "react";
import { useAppStateContext } from "@/components/contexts/AppContext";
import { uploadFile } from "@/lib/firebase/storage";
import { createAsset } from "@/db/assets";
import { set } from "firebase/database";

// UX
// Homepahe: input with dropdown and prompt suggestions, similar to
// /kreiraj => similar to adobe firefrefly

export default function Home() {
  const { state, setState } = useAppStateContext();
  const [prompt, setPrompt] = useState("");

  async function onCreate() {
    console.log("generating");
    const toastId = addToast({
      title: "Kreiram motiv.",
      color: "default",
      description: "To lahko traja nekaj časa. Prosim ne zapirajte okna.",
      isClosing: false,
      promise: new Promise(() => {}),
    });
    const response = await createShirtPattern(prompt);
    console.log(response);

    if (!response?.b64_json) return;

    try {
      console.log("uploading");
      const url = await uploadFile(response?.b64_json);

      const asset = await createAsset({ url, type: "image/png" });

      if (asset) {
        setState({
          ...state,
          assets: [...state.assets, asset],
          assetIds: [...state.assetIds, asset.id],
          shirtConfig: {
            ...state.shirtConfig,
            frontPatternUrl: asset.url,
          },
        });
        setPrompt("");
      }
      toastId && closeToast(toastId);
    } catch (error) {
      console.log("Error generating ai file:", error);
      toastId && closeToast(toastId);
      addToast({ title: "Napaka pri generiranju motiva.", color: "danger" });
    }
  }

  return (
    <div className="relative h-[calc(100vh-65px)]">
      <div className="w-full h-full absolute">
        <CanvasModel />
      </div>
      {/* <AnimatedHeading /> */}
      <div className="flex flex-row gap-4 p-8 items-end h-full">
        <div className="flex flex-col h-full gap-4">
          {/* <Card>
            <CardHeader className="font-bold">Predogled</CardHeader>
          </Card> */}
          <Card className="w-xs h-full" isBlurred>
            <CardHeader className="font-bold">Moje naročilo</CardHeader>
            <Divider />
            <CardBody>
              <ShirtConfigurator />
            </CardBody>
            <CardFooter>
              <Button fullWidth>Na Blagajno</Button>
            </CardFooter>
          </Card>
        </div>
        {/* <Card className="w-lg">
            <p className="absolute bottom-2 text-gray-400 text-xs self-center">
            Končni izdelek lahko malenkostno odostopa.
            </p>
            </Card> */}
        <div className="relative w-full">
          <Textarea
            variant="faded"
            color="default"
            label="Kreiraj motiv"
            rows={20}
            placeholder="Opiši motiv..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            isClearable
          />
          <Button
            size="sm"
            className="absolute bottom-2 right-2"
            onPress={onCreate}
            disabled={!prompt.trim()}
          >
            Kreiraj
          </Button>
        </div>
      </div>
    </div>
  );
}
