"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { useTexture } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react";
import CanvasModel from "@/components/canvas";
import { Product } from "@/types/product.types";
import { useCreateDesignContext } from "@/components/contexts/CreateDesignContext";

// Rotating design images for the canvas
const DESIGN_IMAGES = [
  "/assets/placeholder-design-1.png",
  "/assets/placeholder-design-2.png",
  "/assets/placeholder-design-3.png",
  "/assets/placeholder-design-4.png",
  "/assets/placeholder-design-5.png",
  "/assets/placeholder-design-6.png",
  "/assets/placeholder-design-7.png",
];

// Preload all design textures for Three.js to prevent flash
DESIGN_IMAGES.forEach((src) => useTexture.preload(src));

// Auto-rotate interval
const ROTATION_INTERVAL = 4000;

const HeroSection = () => {
  const router = useRouter();
  const { openModal } = useCreateDesignContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDesignImage = DESIGN_IMAGES[currentIndex];

  // Auto-rotate designs
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % DESIGN_IMAGES.length);
    }, ROTATION_INTERVAL);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  // Handle "Ustvari motiv" button click
  const handleCreateClick = () => {
    openModal();
  };

  // Handle "Prilagodi motiv" button click
  const handleCustomizeClick = () => {
    router.push("/trgovina");
  };

  return (
    <section
      className="bg-primary-50 py-8 lg:py-8 overflow-hidden"
      style={{
        backgroundImage: "url('/assets/bg-transparent.png')",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Horizontal layout: title/buttons on left, canvas on right */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-8">
          {/* Left: Title, subtitle, and buttons */}
          <div className="w-full max-w-lg lg:max-w-xl space-y-4 md:text-center lg:text-left lg:mt-16">
            {/* Title and subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                Ustvari svojo unikatno majico.
              </h1>
              <p className="text-lg md:text-xl text-primary-900">
                Opiši motiv. Izberi velikost in barvo. Naroči.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                color="primary"
                size="lg"
                className="font-semibold px-8 text-white"
                endContent={<ArrowRightIcon size={20} />}
                onPress={handleCreateClick}
              >
                Ustvari motiv
              </Button>
              <Button
                variant="bordered"
                color="primary"
                size="lg"
                className="font-semibold px-8"
                endContent={<ArrowRightIcon size={20} />}
                onPress={handleCustomizeClick}
              >
                Obstoječi motivi
              </Button>
            </div>
          </div>

          {/* Right: Canvas */}
          <div className="w-full max-w-[600px] lg:max-w-[750px] aspect-square -mb-[40px] lg:mb-0">
            <CanvasModel
              product={Product.Shirt}
              color="#fff"
              frontPatternUrl={currentDesignImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
