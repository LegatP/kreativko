import { Divider } from "@heroui/react";
import SelectSizes from "../ProductConfigurator/SelectSizes";
import Image from "next/image";
import { SHIPPING } from "@/config/shipping";
import { InfoIcon } from "@phosphor-icons/react";
import { DesignUrls } from "@/db/orders/types";
import { formatPrice } from "@/utils/currency.utils";

interface ProductOverviewItem {
  id: string;
  name: string;
  price: number;
  sizes: Record<string, number>;
  designUrls: DesignUrls;
}

interface ProductsOverviewProps {
  products: ProductOverviewItem[];
  totalPrice: number;
  onSizeChange?: (size: string, value: number) => void;
  withShipping?: boolean;
}

export default function ProductsOverview({
  products,
  onSizeChange,
  totalPrice,
  withShipping = true,
}: ProductsOverviewProps) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col gap-4 relative">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <span className="font-bold">{product.name}</span>
                <span>{formatPrice(product.price)}€ / kos</span>
              </div>

              {/* Print position thumbnails */}
              <div className="flex gap-3 mt-2">
                {product.designUrls.front && (
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={product.designUrls.front}
                      alt="Spredaj"
                      width={60}
                      height={60}
                      className="rounded border border-gray-200"
                      unoptimized
                    />
                    <span className="text-xs text-gray-500">Spredaj</span>
                  </div>
                )}
                {product.designUrls.back && (
                  <div className="flex flex-col items-center gap-1">
                    <Image
                      src={product.designUrls.back}
                      alt="Zadaj"
                      width={60}
                      height={60}
                      className="rounded border border-gray-200"
                      unoptimized
                    />
                    <span className="text-xs text-gray-500">Zadaj</span>
                  </div>
                )}
              </div>

              {product.sizes && (
                <div className="mt-2">
                  <SelectSizes
                    sizes={product.sizes}
                    setSize={(size, value) => onSizeChange?.(size, value)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Divider className="my-4 bg-gray-400" />
      <div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span>Poštnina</span>
            <span className="text-xs mt-1.5 flex items-center gap-1 text-success-600">
              <InfoIcon className="w-4 h-4" /> Brezplačna poštnina ob naročilu
              nad {formatPrice(SHIPPING.freeShippingThreshold)}€
            </span>
          </div>
          <span>
            {withShipping ? formatPrice(SHIPPING.baseCost) : "0.00"}€
          </span>
        </div>
      </div>
      <Divider className="my-4 bg-gray-400" />
      <div className="flex justify-between">
        <span>Skupaj za plačilo</span>
        <span>{formatPrice(totalPrice)}€</span>
      </div>
    </div>
  );
}
