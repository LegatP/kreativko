"use client";

import ProductCard from "@/components/common/ProductCard";
import { BASE_PRODUCT_PRICE } from "@/components/contexts/AppContext/CheckoutContext";
import p from "@/products";

const products = Object.values(p);

export default function Page() {
  return (
    <div className="min-h-screen">
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
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 max-w-6xl mx-auto my-10 gap-y-4">
        {products.map((item, index) => (
          <ProductCard
            key={index}
            title={item.name}
            // description={item.description}
            price={BASE_PRODUCT_PRICE}
            imageUrl={item.designs[0].url}
            slug={item.slug}
          />
        ))}
      </section>
    </div>
  );
}
