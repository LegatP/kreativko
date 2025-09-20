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

// UX
// Homepahe: input with dropdown and prompt suggestions, similar to
// /kreiraj => similar to adobe firefrefly

export default function Home() {
  const { state, setState } = useAppStateContext();
  const [prompt, setPrompt] = useState("");

  async function onCreate() {
    // console.log("generating");
    const toastId = addToast({
      title: "Kreativko ustvarja tvoj motiv.",
      color: "default",
      description: "To lahko traja nekaj časa. Ne zapiratje brskalnika.",
      isClosing: false,
      promise: new Promise(() => {}),
    });
    const response = await createShirtPattern(prompt);
    // console.log(response);

    if (!response?.b64_json) return;

    try {
      // console.log("uploading");
      const url = await uploadFile(response?.b64_json);

      const asset = await createAsset({ url, type: "image/png" });

      if (asset) {
        setState({
          ...state,
          assets: { ...state.assets, [asset.id]: asset.url },
          shirtConfig: {
            ...state.shirtConfig,
            frontPatternUrl: asset.url,
          },
        });
        setPrompt("");
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
    }
  }

  return (
    <div className="relative h-[calc(100vh-65px)] bg-gray-100">
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
        <div className="flex w-full flex-col h-full">
          <CanvasModel />
          <div className="relative w-full flex flex-col">
            {/* <Card className="w-lg">
            <p className="absolute bottom-2 text-gray-400 text-xs self-center">
              Končni izdelek lahko malenkostno odostopa.
            </p>
          </Card> */}
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
    </div>
  );
}
