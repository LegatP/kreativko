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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import CanvasModel from "@/components/canvas";
import ProductConfigurator from "@/components/ProductConfigurator";
import { createShirtPattern } from "@/actions/openai";
import { useState } from "react";
import { useAppStateContext } from "@/components/contexts/AppContext";
import { uploadFile } from "@/lib/firebase/storage";
import { createAsset } from "@/db/assets";

const mockProducts = {
  "funny-cake-shirt": {
    id: "funny-cake-shirt",
    name: "Stašljiva majica za noč čarovnic",
    price: 19.99,
    originalPrice: 29.99,
    description:
      "Unikaten dizajn za noč čarovnic z visokokakovostnim tiskom na mehko bombaž majico. Popolna za zabave, darila ali vsakodnevno nošenje.",
    longDescription:
      "Ta ekskluzivna majica kombinira udobje in stil. Narejena iz 100% organskega bombaža, ki zagotavlja maksimalno udobje in vzdržljivost. Dizajn je natisnjen z najnovejšo tehnologijo DTG (Direct to Garment), kar zagotavlja žive barve in dolgotrajnost vzorca.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/0N0hFGlEA6VP6LEg4ulmf8vq5CT2%2F1759351377579_Screenshot%202025-10-01%20at%2022.42.17.png?alt=media&token=ed97daa6-0708-4c95-bcd7-ec14b61106ee",
      "/assets/shirt-sample.webp",
    ],
    category: "Majice",
    subcategory: "Za abrahama",
    inStock: true,
    stockCount: 15,
    isPopular: true,
    rating: 4.8,
    reviewCount: 127,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Črna", "Bela", "Siva"],
    features: [
      "100% organski bombaž",
      "Visokokakovosten DTG tisk",
      "Pranje pri 30°C",
      "Unisex kroj",
    ],
    discount: 33,
  },
};

import cx from "classnames";
import {
  ArrowRightIcon,
  PaintBrushIcon,
  PaperPlaneTiltIcon,
  StarFourIcon,
} from "@phosphor-icons/react";
import { Product } from "@/types/product.types";
import PromptToolbar from "@/components/layout/PromptToolbar";
import { ProductIcons } from "@/config";
import { createAiReponse } from "@/db/ai-reponses";
import DesignConfigurator from "@/components/ProductConfigurator/DesignConfigurator";
import ProductCard from "@/components/ProductCard";
import { ProductDetailsPage } from "@/app/(public)/[...slug]/page";

// UX
// Homepahe: input with dropdown and prompt suggestions, similar to
// /kreiraj => similar to adobe firefrefly

export default function Page() {
  const { state, setState, currentProductConfig, setCurrentProductConfig } =
    useAppStateContext();
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");

  async function onCreate() {
    setIsGenerating(true);
    // console.log("generating");
    const toastId = addToast({
      title: "Kreativko ustvarja tvoj motiv.",
      color: "default",
      description: "To lahko traja nekaj časa. Ne zapiraj brskalnika.",
      isClosing: true,
      promise: new Promise(() => {}),
      hideCloseButton: true,
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

      createAiReponse({
        ...response,
        imageUrl: url,
      });
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

  const Icon = ProductIcons[state.selectedProduct as Product];

  return (
    <>
      <Modal
        className="fixed z-20"
        isOpen={isProductDetailsOpen}
        size="3xl"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>Deljenje izdelka</ModalHeader>
          <ModalBody>
            {/* <ProductDetailsPage product={mockProducts["funny-cake-shirt"]} /> */}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="danger">
              Zapri
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="relative h-[calc(100vh-65px)] bg-gray-100">
        <div className="flex flex-row gap-4 p-4 items-end h-full">
          <div className="hidden md:flex flex-row h-full gap-2">
            <div className="flex flex-col gap-2">
              {/* {Object.values(Product).map((key, index) => {
              const Icon = ProductIcons[key];
              return (
                <Card
                  className={cx(
                    "aspect-square h-10 items-center justify-center",
                    state.selectedProduct === key && "ring-2 ring-primary"
                  )}
                  radius="md"
                  key={index}
                  isPressable
                  onPress={() => setState({ ...state, selectedProduct: key })}
                >
                  <Icon size={26} />
                </Card>
              );
            })} */}
              {/* <Card
              className={cx(
                "aspect-square h-10 items-center justify-center",
                selectedTab === "product" && "ring-2 ring-primary"
              )}
              radius="md"
              isPressable
              onPress={() => setSelectedTab("product")}
            >
              <Icon size={26} />
            </Card>
            <Card
              className={cx(
                "aspect-square h-10 items-center justify-center",
                selectedTab === "design" && "ring-2 ring-primary"
              )}
              radius="md"
              isPressable
              onPress={() => setSelectedTab("design")}
            >
              <PaintBrushIcon size={26} />
            </Card> */}
            </div>
            <Card
              className="w-[272px] h-full"
              isBlurred
              classNames={{ body: "p-1" }}
            >
              <CardHeader className="font-bold bg-default-100 text-xl">
                Motiv
              </CardHeader>
              <Divider />
              <CardBody>
                <DesignConfigurator />
              </CardBody>
              {/* <Divider /> */}
              {/* <CardFooter>
              <Button
                color="primary"
                fullWidth
                endContent={
                  <ArrowRightIcon className="text-white" weight="bold" />
                }
              >
                <span className="text-white font-medium">Naprej</span>
              </Button>
            </CardFooter> */}
            </Card>
          </div>
          <div className="flex w-full flex-col h-full relative">
            <Card
              className="w-10 aspect-square mb-4 absolute right-0 items-center justify-center z-10"
              isBlurred
              isPressable
              onPress={() => {
                const url = `${window.location.origin}/predogled/${state?.id}`;
                // TODO: test on mobile
                if (navigator.canShare?.({ url })) {
                  navigator.share({ url });
                } else {
                  navigator.clipboard.writeText(url);
                  addToast({
                    title: "Povezava kopirana",
                    description: "Povezava je bila kopirana v odložišče.",
                    color: "success",
                  });
                }
              }}
            >
              <PaperPlaneTiltIcon weight="fill" size={20} />
            </Card>
            <CanvasModel state={state} />
            <div className="relative w-full flex flex-col">
              <PromptToolbar />
              <Textarea
                classNames={{
                  inputWrapper: "bg-white",
                }}
                variant="faded"
                color="primary"
                label="Kreiraj motiv"
                rows={20}
                placeholder="Opiši svoj motiv"
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
    </>
  );
}
