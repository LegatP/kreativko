"use client";

import ProductCard from "@/components/ProductCard";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { sub } from "framer-motion/client";
import Link from "next/link";

export const dummyProducts = [
  {
    id: "1",
    name: "Stašljiva majica za noč čarovnic",
    price: 19.99,
    description:
      "Beautiful handcrafted ceramic mug with unique glazing patterns",
    image:
      "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/0N0hFGlEA6VP6LEg4ulmf8vq5CT2%2F1759351377579_Screenshot%202025-10-01%20at%2022.42.17.png?alt=media&token=ed97daa6-0708-4c95-bcd7-ec14b61106ee",
    category: "Home & Kitchen",
    inStock: true,
    isPopular: true,
  },
  {
    id: "2",
    name: "Vintage Leather Journal",
    price: 45.5,
    description:
      "Premium leather-bound journal with aged paper for writing enthusiasts",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    category: "Stationery",
    inStock: false,
    isPopular: false,
  },
  {
    id: "3",
    name: "Artisan Wooden Bowl",
    price: 32.0,
    description: "Hand-carved wooden bowl made from sustainable oak wood",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    category: "Home & Kitchen",
    inStock: true,
    isPopular: true,
  },
  {
    id: "4",
    name: "Silk Scarf Collection",
    price: 78.25,
    description: "Luxurious silk scarf with hand-painted floral designs",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400",
    category: "Fashion",
    inStock: true,
    isPopular: false,
  },
  {
    id: "5",
    name: "Craft Beer Starter Kit",
    price: 89.99,
    description: "Complete brewing kit for making your own craft beer at home",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400",
    category: "Food & Beverage",
    inStock: false,
    isPopular: false,
  },
  {
    id: "6",
    name: "Miniature Succulent Garden",
    price: 18.75,
    description:
      "Cute collection of mini succulents in decorative ceramic pots",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400",
    category: "Plants & Garden",
    inStock: true,
    isPopular: false,
  },
];

export const categories = [
  {
    title: "Majice",
    slug: "majice",
    subcategories: [
      { title: "Majice za abrahama", slug: "za-abrahama" },
      { title: "Majice za rojstni dan", slug: "rojstni-dan" },
      { title: "Smešne majice", slug: "smesne" },
      { title: "Majice za pare", slug: "za-pare" },
      { title: "Otroške majice", slug: "otroske" },
      {
        title: "Tematske majice",
        slug: "tematske",
        subcategories: [
          { title: "Božične majice", slug: "bozic" },
          { title: "Halloween majice", slug: "halloween" },
        ],
      },
      { title: "Personalizirane / Po meri", slug: "personalizirane-po-meri" },
      { title: "Promocijske in korporativne", slug: "promocijske" },
      { title: "Športne / Team majice", slug: "sportne" },
      { title: "Eko / organski material", slug: "eko-organic" },
    ],
  },
];

export default function Page() {
  return null;
  // return (
  // <div className="container mx-auto flex flex-col">
  //   <div>
  //     <h1 className="text-3xl font-bold mb-4">Trgovina</h1>
  //   </div>
  //   <div className="flex flex-row gap-4">
  //     <Card className="hidden lg:block w-[300px]" shadow="md">
  //       <CardHeader>
  //         <h3 className="font-semibold">Kategorije</h3>
  //       </CardHeader>
  //       <Divider />
  //       <CardBody>
  //         <ul className="flex flex-col gap-2">
  //           {categories.map((category) =>
  //             category.subcategories ? (
  //               <li key={category.slug} className="flex flex-col">
  //                 <span className="font-medium">{category.title}</span>
  //                 <ul className="ml-4 mt-1 flex flex-col gap-1">
  //                   {category.subcategories.map((sub) =>
  //                     sub.subcategories ? (
  //                       <li key={sub.slug} className="flex flex-col">
  //                         <span className="font-medium">{sub.title}</span>
  //                         <ul className="ml-4 mt-1 flex flex-col gap-1">
  //                           {sub.subcategories.map((subsub) => (
  //                             <li key={subsub.slug} className="text-sm">
  //                               {subsub.title}
  //                             </li>
  //                           ))}
  //                         </ul>
  //                       </li>
  //                     ) : (
  //                       <li key={sub.slug} className="text-sm">
  //                         {sub.title}
  //                       </li>
  //                     )
  //                   )}
  //                 </ul>
  //               </li>
  //             ) : (
  //               <li key={category.slug} className="text-sm">
  //                 {category.title}
  //               </li>
  //             )
  //           )}
  //         </ul>
  //         <Link href="/majice/za-abrahama">Majice za abrahama</Link>
  //         <Link href="/majice/za-rojstni-dan">Majice za rojstni dan</Link>
  //       </CardBody>
  //     </Card>
  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  //       {dummyProducts.map((product) => (
  //         <ProductCard key={product.id} {...product} />
  //       ))}
  //     </div>
  //   </div>
  // </div>
  // );
}
