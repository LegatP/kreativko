import { HoodieIcon, TShirtIcon, UmbrellaIcon } from "@phosphor-icons/react";
import { DesignStyle, Product } from "./types/product.types";

export const ProductIcons = {
  [Product.Shirt]: TShirtIcon,
  [Product.Hoodie]: HoodieIcon,
  [Product.Umbrella]: UmbrellaIcon,
};

export const DesignStyleConfig = {
  [DesignStyle.Monotone]: {
    imgUrl: "/assets/monotone-style.png",
    description: "Monotoski stil.",
  },
  [DesignStyle.Colorful]: {
    imgUrl: "/assets/multicolor-style.png",
    description: "Večbarvni stil.",
  },
};
