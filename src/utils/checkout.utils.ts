import { Configuration } from "@/db/configurations";
import { ShirtConfig } from "@/types/product.types";

function getProductsFromConfig(config: Configuration) {
  const currentProductConfig = config.configs[config.selectedProduct];
  const products = [];
  if (config.selectedProduct === "shirt") {
    const product = {
      id: 1,
      name: "Majica Moška",
      price: 9.99,
      imageUrl: "/assets/shirt-sample.webp",
      sizes: currentProductConfig.sizes,
      accessories: [] as Array<{
        id: number;
        name: string;
        imageUrl: string;
        price: number;
        priceCalculation: string;
      }>,
    };
    if ((currentProductConfig as ShirtConfig).frontPatternUrl) {
      product.accessories = [
        {
          id: 1,
          name: "Tisk na majico spredaj",
          imageUrl: (currentProductConfig as ShirtConfig).frontPatternUrl,
          price: 5,
          priceCalculation: "perItem",
        },
      ];
    }
    products.push(product);
  }
  return products;
}

function calculateTotal(products: ReturnType<typeof getProductsFromConfig>) {
  let total = 0;
  products.forEach((product) => {
    const quantity = Object.values(product.sizes).reduce(
      (acc, curr) => acc + curr,
      0
    );
    total += quantity * product.price;
    product.accessories.forEach((accessory) => {
      if (accessory.priceCalculation === "perItem") {
        total += accessory.price * quantity;
      } else if (accessory.priceCalculation === "perProduct") {
        total += accessory.price;
      }
    });
  });
  return total.toFixed(2);
}

export { calculateTotal, getProductsFromConfig };
