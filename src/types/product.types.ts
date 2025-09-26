export enum Product {
  Shirt = "shirt",
  Hoodie = "hoodie",
  Umbrella = "umbrella",
}

export enum DesignStyle {
  Monotone = "Monotone",
  Colorful = "Colorful",
}

export type ProductConfigs = {
  [Product.Shirt]: ShirtConfig;
  [Product.Hoodie]: HoodieConfig;
  [Product.Umbrella]: UmbrellaConfig;
};

// Shirt

export enum ShirtSizes {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export type ShirtConfig = {
  color: string;
  frontPatternUrl: string;
  model: "male" | "female";
  sizes: {
    [key in keyof typeof ShirtSizes]: number;
  };
};

// Hoodie

export enum HoodieSizes {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export type HoodieConfig = {
  color: string;
  frontPatternUrl: string;
  // model: "male" | "female";
  sizes: {
    [key in keyof typeof HoodieSizes]: number;
  };
};

// Umbrella

export enum UmbrellaSizes {
  Standard = "Kos",
}

export type UmbrellaConfig = {
  color: string;
  patternUrl: string;
  sizes: {
    [UmbrellaSizes.Standard]: number;
  };
};
