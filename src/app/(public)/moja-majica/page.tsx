"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Image,
  Input,
  Tooltip,
} from "@heroui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { DesignStyle, Product } from "@/types/product.types";
import { PaintBrushIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import SelectColor from "@/components/ProductConfigurator/SelectColor";
import CanvasModel from "@/components/canvas";
import SelectSizes from "@/components/ProductConfigurator/SelectSizes";

const products = {
  "sadez-zelenjava": {
    id: "sadez-zelenjava",
    name: "Personalizirana majica - moj hobi, moj poklic",
    price: 29.99,
    description:
      "Personaliziraj svojo majico z unikatnim motivom sadja ali zelenjave",
    // defaultFruit: "jabolko",
    // defaultAction: "jem",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
};

const fruitOptions = [
  "Avokado",
  "Hruška",
  "Jabolko",
  "Banana",
  "Pomaranča",
  "Korenje",
  "Brokoli",
  "Paradižnik",
  "Paprika",
];

const activityOptions = [
  "Izvaja jogo",
  "Kolesari",
  "Bere",
  "Zdravnik",
  "Kuhar",
  "Športnik",
  "Učitelj",
  "Slikar",
  "Programer",
  "Plesalec",
];

const existingDesigns = [
  {
    title: "Jabolko, ki izvaja jogo",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760025709663_ai_generated.png?alt=media&token=5382d01a-7d47-434a-b01f-74cd7bf6ecc4",
  },
  {
    title: "Korenje, ki je športnik",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/xOet49IcwkW2PD5hiSjfc2tRX2I2%2F1761078014913_ai_generated.png?alt=media&token=95e727e6-e9d1-472e-875f-ca021a930515",
  },
  {
    title: "Ninja borovnica",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/IHo52hfFKeYozR6zuxnGsCtrPCt1%2F1760386169386_ai_generated.png?alt=media&token=d710df42-c56a-4949-97c5-1d6eedad26e0",
  },
  {
    title: "Kuhar pomaranča",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760099155030_ai_generated.png?alt=media&token=a9d41db4-53f9-41df-a9ef-cd49889cba6c",
  },
];

export default function Page() {
  const product = products["sadez-zelenjava"];
  const [selectedAction, setSelectedAction] = useState("Izvaja jogo");
  const [selectedFruit, setSelectedFruit] = useState("Avokado");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [quantity, setQuantity] = useState(1);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDesignImage, setSelectedDesignImage] = useState<string | null>(
    null
  );
  const [allDesigns, setAllDesigns] = useState(existingDesigns);

  const { generateImage } = useImageGeneration();

  // Default preset image from /prilagodi
  const presetImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760025709663_ai_generated.png?alt=media&token=5382d01a-7d47-434a-b01f-74cd7bf6ecc4";

  const handleChipClick = (field: string, value: string) => {
    if (field === "fruit") {
      setSelectedFruit(value);
    } else if (field === "action") {
      setSelectedAction(value);
    }
  };

  const handleDesignSelect = (imageUrl: string) => {
    setSelectedDesignImage(imageUrl);
    setGeneratedImage(null); // Clear generated image when selecting preset
  };

  const handleGenerateMotif = async () => {
    const isValid = Boolean(selectedFruit?.trim() && selectedAction?.trim());
    if (!isValid) return;

    setIsGenerating(true);

    try {
      const prompt = `You are generating a T-Shirt design. The design consists of a character performing an action or doing activity based on the profession (should also include simple objects that represent that profession or activity). The design cosists of four non-perfect circles, each one representing ${selectedFruit} in a different position. The positions should vary but match ${selectedAction}. The circles should be a bit deformed and not perfect circles. ${selectedFruit} should be a simplistic cartoon-like character. The character should have stick-like arms and legs.`;

      const result = await generateImage(prompt, DesignStyle.Colorful);
      if (result?.url) {
        const newDesign = {
          title: `Personaliziran motiv: ${selectedFruit} - ${selectedAction}`,
          imageUrl: result.url,
        };
        setAllDesigns((prev) => [newDesign, ...prev]);
        setGeneratedImage(result.url);
        setSelectedDesignImage(result.url); // Auto-select the generated design
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isInputValid = () => {
    return Boolean(selectedFruit?.trim() && selectedAction?.trim());
  };

  const handleAddToCart = () => {
    // This will call your existing drawer checkout modal
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      customization: {
        fruit: selectedFruit,
        action: selectedAction,
        size: selectedSize,
      },
      quantity,
    };

    // Trigger your existing drawer checkout
    // You'll need to integrate this with your existing cart system
    console.log("Adding to cart:", cartItem);
    // Example: openDrawerCheckout(cartItem);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Preview and Product Info */}
          <Card className="col-span-3">
            <CardBody className="py-5 px-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-default-900">
                  Personaliziraj
                </h3>
                <p className="text-medium text-default-700">
                  Izberi motiv iz galerije ali ustvari svojega.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="aspect-square animate-pulse bg-default-100 shadow-md">
                      <CardBody className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}

                {allDesigns.map((design, index) => (
                  <Tooltip
                    key={design.imageUrl + index}
                    content={design.title}
                    placement="top"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className={`aspect-square cursor-pointer shadow-md ${
                          selectedDesignImage === design.imageUrl
                            ? "ring-2 ring-primary ring-offset-2"
                            : ""
                        }`}
                        isPressable
                        isHoverable
                        onPress={() => handleDesignSelect(design.imageUrl)}
                      >
                        <div className="aspect-square">
                          <Image
                            className="h-full w-full object-cover rounded-lg"
                            src={design.imageUrl}
                            alt={design.title}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  </Tooltip>
                ))}
              </div>
              <Divider className="my-4" />
              <div>
                <Input
                  label="Kaj počne oziroma kdo je?"
                  variant="underlined"
                  placeholder="Izvaja jogo"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                />
                <div className="flex flex-row flex-wrap mt-2">
                  {activityOptions.map((item, chipIndex) => (
                    <Chip
                      key={chipIndex}
                      size="sm"
                      className="m-1 cursor-pointer transition-colors hover:bg-primary hover:text-white"
                      onClick={() => handleChipClick("action", item)}
                      color="primary"
                      variant="flat"
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <Input
                  label="Sadež ali zelenjava"
                  variant="underlined"
                  placeholder="Avokado"
                  value={selectedFruit}
                  onChange={(e) => setSelectedFruit(e.target.value)}
                />
                <div className="flex flex-row flex-wrap mt-2">
                  {fruitOptions.map((item, chipIndex) => (
                    <Chip
                      key={chipIndex}
                      size="sm"
                      className="m-1 cursor-pointer transition-colors hover:bg-primary hover:text-white"
                      onClick={() => handleChipClick("fruit", item)}
                      color="primary"
                      variant="flat"
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              <Button
                startContent={
                  <PaintBrushIcon className="w-5 h-5" weight="fill" />
                }
                variant="ghost"
                color="primary"
                fullWidth
                // className="hover:text-white"
                onPress={handleGenerateMotif}
                isDisabled={!isInputValid() || isGenerating}
                isLoading={isGenerating}
              >
                {isGenerating ? "Ustvarjam motiv..." : "Ustvari motiv"}
              </Button>
            </CardBody>
          </Card>
          <div className="space-y-8 col-span-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <CanvasModel
                  product={Product.Shirt}
                  modelProps={{
                    color: selectedColor,
                    frontPatternUrl:
                      generatedImage || selectedDesignImage || presetImageUrl,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Product Details and Customization */}
          <Card className="col-span-3">
            <CardBody className="py-5 px-6 space-y-6">
              <div>
                <h1 className="text-xl font-semibold text-default-900">
                  {product.name}
                </h1>
                <p className="text-medium text-default-700">
                  {product.description}
                </p>
              </div>

              {/* Text Customization */}
              {/* <Card shadow="none" className="bg-transparent">
              <CardBody className="space-y-4"> */}

              {/* </CardBody>
            </Card> */}

              {/* Color Selection */}
              <div>
                <h3 className="text-md font-semibold mb-4 text-default-900">
                  BARVA
                </h3>
                <SelectColor setColor={setSelectedColor} />
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-md font-semibold mb-4 text-default-900">
                  VELIKOST IN KOLIČINA
                </h3>
                {/* <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`py-2 px-4 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div> */}
                <SelectSizes sizes={product.sizes} />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Količina
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select> */}
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">Skupaj</div>
                  <div className="text-2xl font-bold text-primary">
                    €{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              </div>

              <Button
                startContent={
                  <ShoppingCartIcon className="w-5 h-5" weight="fill" />
                }
                color="primary"
                fullWidth
                onPress={handleAddToCart}
              >
                Na blagajno
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
