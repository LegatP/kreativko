"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  CardHeader,
  PressEvent,
} from "@heroui/react";
import {
  BasketIcon,
  HeartIcon,
  ShoppingBagIcon,
  StarAndCrescentIcon,
  StarIcon,
} from "@phosphor-icons/react";
import NextImage from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  inStock?: boolean;
  isPopular?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  inStock = true,
  isPopular = false,
}: ProductCardProps) {
  const handleAddToCart = (e: PressEvent) => {
    // e.preventDefault();
    // TODO: Implement add to cart functionality
    console.log(`Adding product ${id} to cart`);
  };

  return (
    <Link href={`/majice/za-abrahama/funny-cake-shirt`}>
      <Card shadow="sm" className="w-full" radius="sm">
        <CardHeader className="p-0 relative">
          {isPopular && (
            <Chip
              variant="solid"
              color="primary"
              size="sm"
              className="absolute m-2 z-10 bottom-0 left-0 text-[11px] text-white tracking-wide"
            >
              Priljubljeno
            </Chip>
          )}
          {/* <div>
          <Button
            className="absolute m-2 z-10 top-0 right-0 text-xs text-white tracking-wide bg-default-600"
            variant="flat"
            color="default"
            size="sm"
            isIconOnly
          >
            <ShoppingBagIcon size={16} weight="bold" />
          </Button>
          <Button
            className="absolute m-2 z-10 top-0 right-10 text-xs text-white tracking-wide bg-default-600"
            variant="flat"
            color="default"
            size="sm"
            isIconOnly
          >
            <HeartIcon size={16} weight="bold" />
          </Button>
        </div> */}
          <div className="w-full z-0">
            <Image
              shadow="sm"
              as={NextImage}
              radius="md"
              width={230}
              height={192}
              alt={name}
              className="w-full object-cover h-48 rounded-b-none"
              src={image}
              isZoomed
            />
          </div>
        </CardHeader>
        <CardBody className="" onClick={() => console.log(id)}>
          <div className="flex flex-col justify-between items-start w-full">
            <div className="flex flex-col gap-1">
              <b className="text-default-800">{name}</b>
              {/* {category && (
              <Chip size="sm" variant="flat" color="primary">
                {category}
              </Chip>
            )} */}
            </div>
            <p className="text-md font-bold text-primary">{price}€ / kos</p>
          </div>

          {/* <p className="text-default-500 text-sm line-clamp-2">{description}</p> */}
        </CardBody>
        <CardFooter className="text-small flex-col items-start gap-2">
          <Button
            className="w-full text-primary font-semibold"
            variant="bordered"
            color="primary"
            size="sm"
            onPress={handleAddToCart}
            isDisabled={!inStock}
          >
            <BasketIcon size={16} weight="bold" />
            Dodaj v košarico
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
