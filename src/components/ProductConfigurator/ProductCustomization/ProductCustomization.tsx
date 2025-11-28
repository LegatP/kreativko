"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { ShoppingCartIcon } from "@phosphor-icons/react";
import SelectColor from "@/components/ProductConfigurator/SelectColor";
import SelectSizes from "@/components/ProductConfigurator/SelectSizes";
import {
  trackCheckoutInitiated,
  trackColorChange,
  trackSizeQuantityChange,
} from "@/lib/firebase/analytics";

interface ProductCustomizationProps {
  // product: {
  //   name: string;
  //   description: string;
  //   sizes: string[];
  // };
  quantities: Record<string, number>;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string, value: number) => void;
  productsAmount: number;
  onCheckout: () => void;
  productId: string;
  name: string;
  color?: string;
  isCheckoutDisabled: boolean;
}

export default function ProductCustomization({
  // product,
  quantities,
  onColorChange,
  onSizeChange,
  productsAmount,
  onCheckout,
  name,
  productId = "unknown",
  color = "#FFFFFF",
  isCheckoutDisabled,
}: ProductCustomizationProps) {
  const handleCheckout = () => {
    // Calculate total quantity
    const totalQuantity = Object.values(quantities).reduce(
      (sum, qty) => sum + qty,
      0
    );

    // Track checkout initiation
    trackCheckoutInitiated(
      productId,
      name,
      productsAmount,
      totalQuantity,
      color,
      quantities
    );

    onCheckout();
  };

  const handleColorChange = (newColor: string) => {
    trackColorChange(newColor, productId);
    onColorChange(newColor);
  };

  const handleSizeChange = (size: string, value: number) => {
    trackSizeQuantityChange(size, value, productId);
    onSizeChange(size, value);
  };

  return (
    <>
      <Card>
        <CardBody className="py-5 px-6 space-y-6">
          {/* Color Selection */}
          <div>
            <h3 className="text-md font-semibold mb-4 text-default-900">
              BARVA
            </h3>
            <SelectColor setColor={handleColorChange} />
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-md font-semibold mb-4 text-default-900">
              VELIKOST IN KOLIČINA
            </h3>
            <SelectSizes sizes={quantities} setSize={handleSizeChange} />
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardBody className="pt-4 pb-6">
          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-700">
              Skupaj za majice in tisk
            </div>
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
            onPress={handleCheckout}
            variant="shadow"
            className="text-white"
            isDisabled={isCheckoutDisabled}
          >
            Na blagajno
          </Button>
        </CardBody>
      </Card>
    </>
  );
}
