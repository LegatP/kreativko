"use client";

import Link from "next/link";
import { Card, CardBody, Divider, Image } from "@heroui/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import DescribeDesignForm from "@/components/forms/DescribeDesignForm";
import CanvasModel from "@/components/canvas";
import { Product } from "@/types/product.types";
import { useState } from "react";
import products from "@/products";
import DesignCard from "@/components/UI/DesignCard";

export default function Page() {
  const desings = products["sadez-zelenjava"].designs.slice(0, 3);
  const [selectedDesign, setSelectedDesign] = useState<string>(
    desings[0].imageUrl
  );
  return (
    <div className="min-h-screen">
      <section
        className="bg-primary-50 py-20"
        style={{
          backgroundImage: "url('/assets/bg.png')",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <h1 className="text-6xl font-bold text-primary mb-6">
            Ustvari svojo unikatno majico
          </h1>
          <p className="text-2xl font-bold text-primary-900 mb-8 max-w-3xl mx-auto">
            Opiši motiv. Izberi velikost in barvo. Naroči.
          </p>
          <div className="flex flex-row mt-50 gap-20">
            <div className="w-md">
              <DescribeDesignForm />
            </div>
            <div className="h-[700px] flex-1 relative pt-[400px]">
              <div className="absolute h-[700px] -left-10 -top-30">
                <CanvasModel
                  product={Product.Shirt}
                  color="#fff"
                  frontPatternUrl={selectedDesign}
                />
                <div className="flex flex-row gap-4">
                  {desings.map((design) => (
                    <DesignCard
                      key={design.imageUrl}
                      title={design.title}
                      isSelected={selectedDesign === design.imageUrl}
                      designUrl={design.imageUrl}
                      handleDesignSelect={setSelectedDesign}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produkti" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary mb-4 text-center">
            Personaliziraj obstoječi motiv
          </h1>
          <p className="text-xl font-bold text-primary-900 mb-20 text-center mx-auto">
            Izberi motiv iz naše galerije in ga prilagodi svojim željam
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              products["sadez-zelenjava"],
              products["silhueta-zivali"],
              products["rojstni-dan-prometni-znak-in-ime"],
            ].map((product) => (
              <Card
                key={product.id}
                className="bg-white hover:bg-white group text-start"
                isPressable
                shadow="md"
                as={Link}
                href={product.slug}
              >
                <Image
                  isZoomed
                  src={product.designs[0].imageUrl}
                  alt={product.name}
                  className="object-cover"
                />
                <Divider />
                <CardBody className="px-4 pt-4 pb-6">
                  <h3 className="text-xl font-semibold mb-2 text-primary-900 group-hover:text-primary">
                    {product.shortName}
                  </h3>
                  <p className="text-primary-900">{product.description}</p>
                  <div className="flex items-center justify-end mt-4">
                    <span className="flex flex-row items-center gap-2 text-primary text-sm">
                      Personaliziraj
                      <ArrowRightIcon />
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-default-50 text-default-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <div className="text-primary-900 space-y-2">
                <p>info@mojamajica.si</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Pravne informacije</h3>
              <div className="space-y-2">
                <Link
                  href="/politika-zasebnosti"
                  className="block text-default-900 hover:text-primary transition-colors"
                >
                  Politika zasebnosti
                </Link>
                <Link
                  href="/pogoji-uporabe"
                  className="block text-default-900 hover:text-primary transition-colors"
                >
                  Pogoji uporabe
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-default-900">
            <p>&copy; 2024 Moja Majica. Vse pravice pridržane.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
