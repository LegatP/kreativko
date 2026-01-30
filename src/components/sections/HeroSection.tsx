"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useCreateDesignContext } from "@/components/contexts/CreateDesignContext";

// Example designs with images and prompts
const EXAMPLE_DESIGNS = [
  {
    image: "/assets/placeholder-design-1.png",
    prompt:
      "Ilustracija za dekliščino z osrednjim motivom silhuete neveste v dolgi obleki, poudarjene z roza barvo.",
  },
  {
    image: "/assets/placeholder-design-2.png",
    prompt:
      "Ilustracija bobra v urbanem streetwear slogu, stoje in sprednji pogled. Bober nosi temna sončna očala.",
  },
  {
    image: "/assets/placeholder-design-3.png",
    prompt:
      "Tipografski dizajn majice z velikim napisom »LETNIK 1985«. Krepka vintage pisava.",
  },
  {
    image: "/assets/placeholder-design-4.png",
    prompt:
      "Grafičen dizajn majice z velikim okroglim prometnim znakom, v sredini letnica 40.",
  },
  {
    image: "/assets/placeholder-design-5.png",
    prompt:
      "Kul lobanja s sončnimi očali, obdana z živahnimi barvnimi plameni in preprostimi grafičnimi oblikami.",
  },
  {
    image: "/assets/placeholder-design-6.png",
    prompt:
      "Minimalistična silhueta mestnega kolesarja se zliva z abstraktnimi linijami vetra in svetlobe.",
  },
];

// Auto-rotate interval
const ROTATION_INTERVAL = 4800;

const HeroSection = () => {
  const router = useRouter();
  const { openModal } = useCreateDesignContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDesign = EXAMPLE_DESIGNS[currentIndex];

  // Auto-rotate designs
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % EXAMPLE_DESIGNS.length);
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
    <div className="pb-52 lg:pb-0">
      <section
        className="bg-primary-50 py-12 lg:py-16"
        style={{
          backgroundImage: "url('/assets/bg-transparent.png')",
        }}
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            {/* Left: Title, subtitle, and buttons */}
            <div className="flex-1 max-w-lg space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                Ustvari svoj unikaten motiv.
              </h1>
              <p className="text-lg text-primary-900">
                Opiši motiv. Izberi velikost in barvo. Naroči.
              </p>
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

            {/* Right: Design Card - extends outside section on mobile */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md mb-[-13rem] lg:mb-0">
              <Card className="shadow-xl">
                <CardBody className="p-0">
                  <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-white">
                    <Image
                      src={currentDesign.image}
                      alt="Primer motiva"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-3 bg-primary-50">
                    <p className="text-sm text-primary-800 italic line-clamp-2">
                      &ldquo;{currentDesign.prompt}&rdquo;
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
