"use client";

import { notFound } from "next/navigation";
import {
  Card,
  CardBody,
  Image,
  Button,
  Chip,
  Divider,
  Badge,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import {
  BasketIcon,
  StarIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
} from "@phosphor-icons/react";
import NextImage from "next/image";
import Link from "next/link";
import { useState, use } from "react";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";

// Mock data - in real app this would come from API/database
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

type ProductType = (typeof mockProducts)[keyof typeof mockProducts];

function ProductDetailsPage({ product }: { product: ProductType }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { onOpen } = useCheckoutContext();

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Show error that size is required
      return;
    }
    // Add to cart logic
    console.log(
      `Adding to cart: ${product.id}, size: ${selectedSize}, color: ${selectedColor}, quantity: ${quantity}`
    );
    onOpen(); // Open checkout drawer
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      return;
    }
    // Add to cart and redirect to checkout
    handleAddToCart();
    // Additional buy now logic
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem>
          <Link href="/">Domov</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/${product.category.toLowerCase()}`}>
            {product.category}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link
            href={`/${product.category.toLowerCase()}/${product.subcategory.toLowerCase()}`}
          >
            {product.subcategory}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{product.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            {product.discount > 0 && (
              <div className="w-full">
                <Image
                  as={NextImage}
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-auto rounded-xl"
                  isZoomed
                />
              </div>
            )}
            {product.isPopular && (
              <Chip
                color="primary"
                variant="solid"
                className="absolute top-3 right-3 z-10 text-white"
              >
                Priljubljeno
              </Chip>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image: string, index: number) => (
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
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold text-default-800 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              {/* <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={16}
                    weight={i < Math.floor(product.rating) ? "fill" : "regular"}
                    className="text-warning"
                  />
                ))}
                <span className="text-sm text-default-600 ml-1">
                  ({product.reviewCount} ocen)
                </span>
              </div> */}
              <Chip size="sm" variant="flat" color="success">
                Na zalogi
              </Chip>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              {product.price}€ / kos
            </span>
            {/* {product.originalPrice > product.price && (
              <span className="text-xl text-default-400 line-through">
                {product.originalPrice}€
              </span>
            )}
            <Chip color="danger" variant="flat" size="sm">
              Prihranite {(product.originalPrice - product.price).toFixed(2)}€
            </Chip> */}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {/* {product.inStock ? (
              <>
                <Chip color="success" variant="flat" size="sm">
                  Na zalogi
                </Chip>
                <span className="text-sm text-default-600">
                  Še {product.stockCount} kosov
                </span>
                {product.stockCount <= 5 && (
                  <Chip color="warning" variant="flat" size="sm">
                    Skoraj razprodano!
                  </Chip>
                )}
              </>
            ) : (
              <Chip color="danger" variant="flat" size="sm">
                Razprodano
              </Chip>
            )} */}
            {/* <Chip color="success" variant="flat" size="sm">
              Na zalogi
            </Chip> */}
          </div>

          {/* Description */}
          <div>
            <p className="text-default-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Divider />

          {/* Size Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Velikost</h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size: string) => (
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
            <h3 className="text-lg font-semibold mb-3">
              Barva: {selectedColor}
            </h3>
            <div className="flex gap-2">
              {product.colors.map((color: string) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "solid" : "bordered"}
                  color={selectedColor === color ? "primary" : "default"}
                  onPress={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Količina</h3>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="bordered"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                isDisabled={quantity <= 1}
              >
                -
              </Button>
              <span className="text-lg font-semibold min-w-8 text-center">
                {quantity}
              </span>
              <Button
                isIconOnly
                variant="bordered"
                onPress={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <Divider />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              color="primary"
              size="lg"
              className="w-full font-semibold text-white"
              onPress={handleBuyNow}
              isDisabled={!product.inStock || !selectedSize}
              startContent={<CreditCardIcon size={20} weight="bold" />}
            >
              Kupi zdaj
            </Button>
            <Button
              variant="bordered"
              color="primary"
              size="lg"
              className="w-full font-semibold"
              onPress={handleAddToCart}
              isDisabled={!product.inStock || !selectedSize}
              startContent={<BasketIcon size={20} weight="bold" />}
            >
              Dodaj v košarico
            </Button>
          </div>

          {/* Features */}
          <Card>
            <CardBody className="p-4">
              {/* <h3 className="text-lg font-semibold mb-3">Lastnosti izdelka</h3>
              <div className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <ShieldCheckIcon size={16} className="text-success" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div> */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <TruckIcon size={24} className="mx-auto text-success mb-1" />
                  <p className="text-xs text-default-600">
                    Brezplačna dostava nad 50€
                  </p>
                </div>
                <div className="text-center">
                  <ShieldCheckIcon
                    size={24}
                    className="mx-auto text-success mb-1"
                  />
                  <p className="text-xs text-default-600">30 dni garancije</p>
                </div>
                <div className="text-center">
                  <CreditCardIcon
                    size={24}
                    className="mx-auto text-success mb-1"
                  />
                  <p className="text-xs text-default-600">Varno plačilo</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Trust Signals */}
          {/* <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <TruckIcon size={24} className="mx-auto text-success mb-1" />
              <p className="text-xs text-default-600">
                Brezplačna dostava nad 50€
              </p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon
                size={24}
                className="mx-auto text-success mb-1"
              />
              <p className="text-xs text-default-600">30 dni garancije</p>
            </div>
            <div className="text-center">
              <CreditCardIcon size={24} className="mx-auto text-success mb-1" />
              <p className="text-xs text-default-600">Varno plačilo</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Additional Product Information */}
      {/* <div className="mt-12">
        <Card>
          <CardBody className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Podrobnosti o izdelku
            </h3>
            <p className="text-default-700 leading-relaxed">
              {product.longDescription}
            </p>
          </CardBody>
        </Card>
      </div> */}
    </div>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = use(params); // e.g. ["funny", "birthday", "funny-cake-shirt"]

  if (!slug || slug.length < 1) return notFound();

  if (slug.length === 1) {
    // /majice/category
    // return <CategoryPage category={slug[0]} />;
    return <div>Category: {slug[0]}</div>;
  }

  if (slug.length === 2) {
    // /majice/category/product
    const productId = slug[1];
    const product = mockProducts[productId as keyof typeof mockProducts];

    if (!product) return notFound();

    return <ProductDetailsPage product={product} />;
  }

  if (slug.length === 3) {
    // /majice/category/subcategory/product
    const productId = slug[2];
    const product = mockProducts[productId as keyof typeof mockProducts];

    if (!product) return notFound();

    return <ProductDetailsPage product={product} />;
  }

  return notFound();
}
