"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

const products = {
  "stiri-krogi": {
    id: "stiri-krogi",
    name: "Majica s štirimi krogi",
    price: 29.99,
    description:
      "Personaliziraj svojo majico z unikatnim dizajnom štirih krogov",
    baseColors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
  },
};

const colorOptions = [
  "#FF6B6B",
  "#FF8E53",
  "#FF6B9D",
  "#C44569",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#0BE881",
  "#FFD93D",
  "#FF9F43",
  "#FFB8B8",
  "#A55EEA",
  "#6C5CE7",
  "#2F3542",
  "#57606F",
  "#FF3838",
];

const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function PersonalizePage({
  params,
}: {
  params: { id: string };
}) {
  const product = products[params.id as keyof typeof products];

  if (!product) {
    notFound();
  }

  const [selectedColors, setSelectedColors] = useState(product.baseColors);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...selectedColors];
    newColors[index] = color;
    setSelectedColors(newColors);
  };

  const handleAddToCart = () => {
    // This will call your existing drawer checkout modal
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      customization: {
        colors: selectedColors,
        size: selectedSize,
      },
      quantity,
    };

    // Trigger your existing drawer checkout
    // You'll need to integrate this with your existing cart system
    console.log("Adding to cart:", cartItem);
    // Example: openDrawerCheckout(cartItem);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Nazaj na glavno stran
          </Link>
        </nav> */}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Preview */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* T-shirt mockup */}
            <div className="relative bg-gray-100 rounded-lg p-8 mb-6">
              <div className="aspect-square bg-white rounded-lg shadow-inner flex items-center justify-center relative">
                {/* T-shirt outline */}
                <div className="w-64 h-72 bg-gray-200 rounded-t-full relative">
                  {/* Design area */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    <div className="grid grid-cols-2 gap-3">
                      {selectedColors.map((color, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="text-3xl font-bold text-blue-600">
                €{product.price}
              </div>
            </div>

            {/* Color Customization */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Prilagodi barve krogov
              </h3>

              {selectedColors.map((currentColor, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-center mb-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300 mr-3"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span className="font-medium">Krog {index + 1}</span>
                  </div>

                  <div className="grid grid-cols-8 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          currentColor === color
                            ? "border-gray-900 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(index, color)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Izberi velikost</h3>
              <div className="grid grid-cols-6 gap-2">
                {shirtSizes.map((size) => (
                  <button
                    key={size}
                    className={`py-2 px-4 border rounded-lg font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Količina
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">Skupaj</div>
                  <div className="text-2xl font-bold text-blue-600">
                    €{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Dodaj v košarico
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                Brezplačna dostava za naročila nad €50
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Informacije o izdelku
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 100% bombažna majica</li>
                <li>• Visokokakovosten digitalni tisk</li>
                <li>• Pranje pri 30°C</li>
                <li>• Dostava v 3-5 delovnih dneh</li>
                <li>• Možnost vračila v 14 dneh</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
