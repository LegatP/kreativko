"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Image,
  Chip,
  Divider,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownSection,
  Select,
  SelectItem,
} from "@heroui/react";
import NextImage from "next/image";
import { useState, useEffect } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { Product } from "@/types/product.types";
import { ProductIcons } from "@/config";
import { useAppStateContext } from "@/components/contexts/AppContext";
import SelectColor from "@/components/ProductConfigurator/SelectColor";

// Mock data for different products
const productData = {
  [Product.Shirt]: {
    id: "shirt",
    name: "Moška majica",
    price: 6.99,
    description:
      "Udobna majica iz kakovostnega bombaža, popolna za vsakodnevno nošenje in personalizacijo.",
    longDescription:
      "Ta majica je narejena iz 100% organskega bombaža, ki zagotavlja maksimalno udobje in vzdržljivost. Idealna za digitalni tisk in personalizacijo z vašimi dizajni.",
    images: ["/assets/shirt-sample.webp", "/assets/shirt-sample.webp"],
    category: "Oblačila",
    subcategory: "Majice",
    inStock: true,
    stockCount: 25,
    isPopular: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Bela", "Črna", "Siva", "Modra", "Rdeča"],
    features: [
      "100% organski bombaž",
      "Visokokakovosten DTG tisk",
      "Pranje pri 30°C",
      "Unisex kroj",
      "Preverjena kakovost",
    ],
    materialInfo: "100% bombaž, 180 g/m²",
    printInfo: "DTG digitalni tisk",
    careInstructions: "Pranje pri 30°C, brez belila",
  },
  [Product.Hoodie]: {
    id: "hoodie",
    name: "Pulover s kapuco",
    price: 21.99,
    description:
      "Topel in udoben pulover s kapuco, odličen za hladnejše dni in casual styling.",
    longDescription:
      "Ta pulover je narejen iz mešanice bombaža in poliestra za optimalno toploto in udobje. Klasičen kroj s kapuco in prednjim žepom.",
    images: ["/assets/hoodie-sample.webp", "/assets/hoodie-sample.webp"],
    category: "Oblačila",
    subcategory: "Puloverji",
    inStock: true,
    stockCount: 18,
    isPopular: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Črna", "Siva", "Mornarsko modra", "Bordeaux"],
    features: [
      "Mešanica bombaž/poliester",
      "Kakovostni DTG tisk",
      "Kapuca z vrvicami",
      "Prednji žep",
      "Ojačana šiva",
    ],
    materialInfo: "80% bombaž, 20% poliester, 320 g/m²",
    printInfo: "DTG digitalni tisk",
    careInstructions: "Pranje pri 30°C, sušenje na nizki temperaturi",
  },
  [Product.Umbrella]: {
    id: "umbrella",
    name: "Dežnik",
    price: 6.99,
    description:
      "Kakovosten dežnik z možnostjo personalizacije celotne površine.",
    longDescription:
      "Vzdržljiv dežnik z jeklenim okvirjem in kakovostno tkanino. Idealen za reklame ali personalizirane darila.",
    images: ["/assets/umbrella-sample.jpg", "/assets/umbrella-sample.jpg"],
    category: "Dodatki",
    subcategory: "Dežniki",
    inStock: true,
    stockCount: 12,
    isPopular: false,
    sizes: ["Standard"],
    colors: ["Črna", "Modra", "Rdeča", "Zelena"],
    features: [
      "Jeklen okvir",
      "Kakovostna polna personalizacija",
      "Premer 120 cm",
      "Avtomatsko odpiranje",
      "Ergonomski ročaj",
    ],
    materialInfo: "Poliester tkanina, jeklen okvir",
    printInfo: "Sublimacijski tisk",
    careInstructions: "Pustite, da se posuši, nato shranite",
  },
};

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect?: (product: Product) => void;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  onProductSelect,
}: ProductDetailsModalProps) {
  const { state, setState } = useAppStateContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [localSelectedProduct, setLocalSelectedProduct] = useState<Product>(
    state.selectedProduct
  );

  const currentProduct = productData[localSelectedProduct];
  const Icon = ProductIcons[localSelectedProduct];

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedProduct(state.selectedProduct);
      setSelectedColor(productData[state.selectedProduct].colors[0]);
      setSelectedSize("");
      setSelectedImageIndex(0);
      setActiveTab("details");
    }
  }, [isOpen, state.selectedProduct]);

  // Update selected color when local product changes
  useEffect(() => {
    setSelectedColor(currentProduct.colors[0]);
  }, [localSelectedProduct, currentProduct.colors]);

  const handleProductChange = (product: Product) => {
    setLocalSelectedProduct(product);
    setSelectedImageIndex(0); // Reset image selection
    setSelectedSize(""); // Reset size selection
    setSelectedColor(productData[product].colors[0]); // Set first color as default
  };

  const handleConfirmSelection = () => {
    // Only update the global state when user confirms
    setState({
      ...state,
      selectedProduct: localSelectedProduct,
      configs: {
        ...state.configs,
        [localSelectedProduct]: {
          ...state.configs[localSelectedProduct],
          color: selectedColor,
        },
      },
    });
    if (onProductSelect) {
      onProductSelect(localSelectedProduct);
    }
    handleModalClose();
  };

  const handleModalClose = () => {
    setSelectedImageIndex(0);
    setActiveTab("details");
    setSelectedSize("");
    setSelectedColor("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      size="4xl"
      scrollBehavior="inside"
      backdrop="blur"
      radius="md"
    >
      <ModalContent>
        <ModalHeader className="flex justify-start gap-3 rounded-t-xl bg-default-50">
          {/* <Icon size={28} className="text-primary" /> */}
          <div>
            <h2 className="text-xl font-bold">Podrobnosti izdelka</h2>
            <p className="text-sm text-default-600 font-normal">
              Izberite izdelek za personalizacijo
            </p>
          </div>
          {/* <Select
            size="sm"
            color="primary"
            variant="flat"
            classNames={{ base: "w-40" }}
            value={localSelectedProduct}
          >
            {Object.values(Product).map((product) => (
              <SelectItem
                key={product}
                onClick={() => handleProductChange(product)}
              >
                {productData[product].name}
              </SelectItem>
            ))}
          </Select> */}
        </ModalHeader>
        <Divider />
        <ModalBody className="p-0 pt-4">
          <div className="px-6">
            <div className="mb-4">
              <div className="flex gap-4 justify-start">
                {Object.values(Product).map((product) => {
                  const ProductIcon = ProductIcons[product];
                  const data = productData[product];
                  const isSelected = localSelectedProduct === product;

                  return (
                    <Card
                      key={product}
                      isPressable
                      isHoverable
                      className={`min-w-10 aspect-square transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-primary border-primary scale-105"
                          : "border-default-200 hover:border-primary/50"
                      }`}
                      onPress={() => handleProductChange(product)}
                      shadow="sm"
                    >
                      <CardBody className="text-center p-2">
                        <ProductIcon
                          size={32}
                          className={`transition-colors ${
                            isSelected ? "text-primary" : "text-default-600"
                          }`}
                        />
                        {/* <p
                        className={`text-base font-semibold mb-1 ${
                          isSelected ? "text-primary" : "text-default-700"
                        }`}
                      >
                        {data.name.split(" ").slice(0, 2).join(" ")}
                      </p>
                      <p className="text-sm text-default-500">
                        {data.price}€ / kos
                      </p> */}
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
            {/* Product Selector */}
            <Divider />
            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    as={NextImage}
                    src={currentProduct.images[selectedImageIndex]}
                    alt={currentProduct.name}
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-xl aspect-square object-cover"
                    isZoomed
                  />
                  {/* {currentProduct.isPopular && (
                    <Chip
                      color="primary"
                      variant="solid"
                      className="absolute top-3 right-3 z-10 text-white"
                      size="sm"
                    >
                      Priljubljeno
                    </Chip>
                  )} */}
                </div>

                {/* Thumbnail Images */}
                {currentProduct.images.length > 1 && (
                  <div className="flex gap-2">
                    {currentProduct.images.map(
                      (image: string, index: number) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 ${
                            selectedImageIndex === index
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                        >
                          <Image
                            as={NextImage}
                            src={image}
                            alt={`${currentProduct.name} ${index + 1}`}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-cover"
                          />
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-default-800 mb-2">
                    {currentProduct.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-3">
                    <Chip size="sm" variant="flat" color="success">
                      Na zalogi
                    </Chip>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {currentProduct.price}€ / kos
                    </span>
                  </div>
                </div>

                {/* <Divider /> */}

                <div>
                  <p className="text-default-700 leading-relaxed">
                    {currentProduct.description}
                  </p>
                </div>

                <Divider />

                {/* Size Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-default-900">
                    Velikost
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {currentProduct.sizes.map((size: string) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "solid" : "bordered"}
                        color={selectedSize === size ? "primary" : "default"}
                        className="min-w-12"
                        onPress={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-default-900">
                    Barva: {selectedColor || currentProduct.colors[0]}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <SelectColor
                      color={selectedColor || currentProduct.colors[0]}
                      setColor={(setColor) => setSelectedColor(setColor)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="bg-transparent gap-3">
          <Button variant="light" onPress={handleModalClose}>
            Zapri
          </Button>
          <Button
            color="primary"
            onPress={handleConfirmSelection}
            className="text-white"
          >
            Izberi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
