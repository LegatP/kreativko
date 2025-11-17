"use client";

import p from "@/products";
import { Button, Card, Image } from "@heroui/react";
import NextImage from "next/image";

const products = Object.values(p);

export default function Page() {
  return (
    <div className="min-h-screen bg-black-50">
      <section
        className="bg-primary-50 py-4 lg:py-8"
        style={{
          backgroundImage: "url('/assets/bg-transparent.png')",
        }}
      >
        <div className="container mx-auto sm:text-center max-w-7xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 lg:mb-4 w-full px-4">
            Majice za rojstni dan
          </h1>
          <p className="text-xl md:text-2xl font-bold text-primary-900 w-full px-4">
            Izberi motiv. Prilagodi po svojih željah. Naroči.
          </p>
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 max-w-6xl mx-auto my-10">
        {[...products, ...products].map((item, index) => (
          <div key={index} className="w-[250px]">
            <Card
              // radius="sm"
              // shadow="none"
              className="border-none shadow-black/5"
              // classNames={{ base: "border-none", body: "border-none" }}
            >
              <Image
                // isBlurred
                as={NextImage}
                width={250}
                height={250}
                isZoomed
                src={item.designs[0].imageUrl}
                alt={`Majica ${item.name}`}
                className="w-full object-contain aspect-square p-4"
              />
            </Card>
            <div className="py-4">
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-default-600">19.99</div>
                <h2 className="text-sm text-semibold">{item.name}</h2>
              </div>
              <div className="text-sm text-default-600 pt-4 mb-2">
                {item.description}
              </div>
              <div className="flex flex-row gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="w-full"
                >
                  Prilagodi
                </Button>
                <Button
                  size="sm"
                  variant="faded"
                  color="primary"
                  className="w-full"
                >
                  Kupi
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
