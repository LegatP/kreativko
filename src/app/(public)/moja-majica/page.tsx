"use client";

import { Button, Card, CardBody, Chip, Divider, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { DesignStyle, Product } from "@/types/product.types";
import { PaintBrushIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import SelectColor from "@/components/ProductConfigurator/SelectColor";
import CanvasModel from "@/components/canvas";
import SelectSizes from "@/components/ProductConfigurator/SelectSizes";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";
import DesignCard from "@/components/UI/DesignCard";
import products from "@/products";

export default function Page() {
  const product = products["sadez-zelenjava"];
  const [selectedAction, setSelectedAction] = useState("Izvaja jogo");
  const [selectedFruit, setSelectedFruit] = useState("Avokado");
  const [isGenerating, setIsGenerating] = useState(false);

  const [allDesigns, setAllDesigns] = useState(product.designs);

  const {
    onOpen: openCheckout,
    productsAmount,
    item,
    setItem,
  } = useCheckoutContext();
  const { generateImage } = useImageGeneration();
  const { quantities, color, designUrl } = item;
  useEffect(() => {
    // TODO: improve this initialization logic
    const quantities = Object.fromEntries(
      product.sizes.map((size) => [size, 0])
    );
    setItem({
      productId: product.id,
      name: product.name,
      color: "#FFFFFF",
      designUrl:
        "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760025709663_ai_generated.png?alt=media&token=5382d01a-7d47-434a-b01f-74cd7bf6ecc4",
      quantities,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChipClick = (field: string, value: string) => {
    if (field === "fruit") {
      setSelectedFruit(value);
    } else if (field === "action") {
      setSelectedAction(value);
    }
  };

  const handleDesignSelect = (imageUrl: string) => {
    setItem({ ...item, designUrl: imageUrl });
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
        setItem({ ...item, designUrl: result.url }); // Auto-select the generated design
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
                  <DesignCard
                    key={design.imageUrl + index}
                    title={design.title}
                    isSelected={designUrl === design.imageUrl}
                    designUrl={design.imageUrl}
                    handleDesignSelect={handleDesignSelect}
                  />
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
                  {product.activities.map((item, chipIndex) => (
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
                  {product.fruits.map((item, chipIndex) => (
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
                  // modelProps={{
                  //   color: selectedColor,
                  //   frontPatternUrl: selectedDesignImage || presetImageUrl,
                  // }}
                  color={color}
                  frontPatternUrl={designUrl}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Product Details and Customization */}
          <div className="col-span-3 flex flex-col gap-4">
            <Card>
              <CardBody className="py-5 px-6 space-y-6">
                <div>
                  <h1 className="text-xl font-semibold text-default-900">
                    {product.name}
                  </h1>
                  <p className="text-medium text-default-700">
                    {product.description}
                  </p>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="text-md font-semibold mb-4 text-default-900">
                    BARVA
                  </h3>
                  <SelectColor
                    setColor={(c) => setItem({ ...item, color: c })}
                  />
                </div>

                {/* Size Selection */}
                <div>
                  <h3 className="text-md font-semibold mb-4 text-default-900">
                    VELIKOST IN KOLIČINA
                  </h3>
                  <SelectSizes
                    sizes={quantities}
                    setSize={(size, value) =>
                      setItem({
                        ...item,
                        quantities: { ...quantities, [size]: value },
                      })
                    }
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="pt-4 pb-6">
                {/* Quantity and Add to Cart */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-700">Skupaj za plačilo</div>
                  <div className="text-2xl font-bold text-primary">
                    €{productsAmount.toFixed(2)}
                  </div>
                </div>

                <Button
                  startContent={
                    <ShoppingCartIcon className="w-5 h-5" weight="fill" />
                  }
                  color="primary"
                  fullWidth
                  onPress={openCheckout}
                  variant="shadow"
                  className="text-white"
                  // disabled={quantity === 0}
                >
                  Na blagajno
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
