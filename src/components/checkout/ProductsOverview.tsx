import { Divider } from "@heroui/react";
import SelectSizes from "../ProductConfigurator/SelectSizes";
import Image from "next/image";
import { calculateTotal } from "@/utils/checkout.utils";

const products = [
  {
    id: 1,
    name: "Majica Moška",
    price: 9.99,
    imageUrl: "/assets/shirt-sample.webp",
    sizes: {
      S: 10,
      M: 5,
      L: 0,
    },
    accessories: [
      {
        id: 1,
        name: "Tisk na majico spredaj",
        imageUrl: "/assets/shirt-sample.webp",
        price: 5,
        priceCalculation: "perItem",
      },
    ],
  },
  //   {
  //     id: 2,
  //     name: "Product 2",
  //     price: 200,
  //     imageUrl: "/assets/hoodie-sample.webp",
  //   },
  //   {
  //     id: 3,
  //     name: "Product 3",
  //     price: 300,
  //     imageUrl: "/assets/umbrella-sample.jpg",
  //     sizes: {
  //       KOS: 10,
  //     },
  //   },
];

interface ProductsOverviewProps {
  products: typeof products;
  onSizeChange?: (productId: number, size: string, value: number) => void;
}

export default function ProductsOverview({
  products,
  onSizeChange,
}: ProductsOverviewProps) {
  return (
    <div>
      {/* <h3>Košarica</h3> */}
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-4 relative">
            <div className="flex flex-row gap-2 overflow-hidden items-start">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={70}
                height={70}
              />
              <div className="flex flex-col gap-2">
                <div className="flex flex-col min-h-[70px]">
                  <span className="text-sm font-bold">{product.name}</span>
                  <span className="text-sm">{product.price}€ / kos</span>
                </div>
                {product.sizes && (
                  <SelectSizes
                    sizes={product.sizes}
                    setSize={(size, value) =>
                      onSizeChange?.(product.id, size, value)
                    }
                  />
                )}
              </div>
            </div>
            {product.accessories && (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2">
                  {product.accessories.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex flex-row gap-2 items-start"
                    >
                      <Image
                        src={acc.imageUrl}
                        alt={acc.name}
                        width={70}
                        height={70}
                        className="rounded-sm"
                        unoptimized
                      />
                      <div className="flex flex-col min-h-[70px]">
                        <span className="text-sm font-bold">{acc.name}</span>
                        <span className="text-sm">{acc.price}€ / kos</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* <Divider className="absolute bottom-0 w-full" /> */}
          </div>
        ))}
      </div>
      <Divider className="my-4 bg-gray-400" />
      <div className="flex justify-between font-bold">
        <span>Za plačilo</span>
        <span>{calculateTotal(products)}€</span>
      </div>
    </div>
  );
}
