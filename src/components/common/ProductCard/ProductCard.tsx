import ROUTES from "@/utils/routes.utils";
import { Button, Card, Image } from "@heroui/react";
import {
  FadersHorizontalIcon,
  HeartIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";
import NextImage from "next/image";
import Link from "next/link";

interface ProductCardProps {
  title: string;
  // description: string;
  price: number;
  imageUrl: string;
  slug: string;
}

const ProductCard = ({ title, price, imageUrl, slug }: ProductCardProps) => {
  return (
    <Link className="w-[250px]" href={ROUTES.productDetails(slug)}>
      <Card className="hover:ring-1 hover:ring-primary p-4">
        <Image
          // isBlurred
          as={NextImage}
          width={250}
          height={250}
          isZoomed
          src={imageUrl}
          alt={title}
          className="w-full object-contain aspect-square bg-default-50"
        />
        <div className="pt-2 flex flex-col gap-2">
          <div className="flex flex-col justify-between items-start">
            <h2 className="text">{title}</h2>
            <div className="text text-primary">{price}€</div>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              size="md"
              variant="flat"
              color="primary"
              className="w-full font-bold flex flex-row gap-2"
            >
              <FadersHorizontalIcon weight="bold" className="w-5 h-5" />
              Prilagodi
            </Button>
            <Button
              size="md"
              variant="flat"
              color="primary"
              isIconOnly
              className="font-bold"
            >
              <HeartIcon weight="duotone" className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
