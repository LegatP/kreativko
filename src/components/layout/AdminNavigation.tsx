"use client";

import React from "react";
import {
  BasketIcon,
  HouseIcon,
  ShirtFoldedIcon,
  StarFourIcon,
  UsersIcon,
  TagIcon,
  PackageIcon,
} from "@phosphor-icons/react";
import { Tooltip } from "@heroui/react";
import Link from "next/link";
import { DESIGN_SESSIONS_COLLECTION } from "@/db/design-sessions";
import { PRODUCT_CATEGORIES_COLLECTION } from "@/db/product-categories";
import { PRODUCTS_COLLECTION } from "@/db/products";
import { AI_RESPONSES_COLLECTION } from "@/db/ai-reponses";
import { ORDERS_COLLECTION } from "@/db/orders";
import { USERS_COLLECTION } from "@/db/users";

const collections = [
  {
    collectionName: PRODUCT_CATEGORIES_COLLECTION,
    displayName: "Kategorije izdelkov",
    icon: TagIcon,
  },
  {
    collectionName: PRODUCTS_COLLECTION,
    displayName: "Izdelki",
    icon: PackageIcon,
  },
  {
    collectionName: AI_RESPONSES_COLLECTION,
    displayName: "Motivi",
    icon: StarFourIcon,
  },
  {
    collectionName: DESIGN_SESSIONS_COLLECTION,
    displayName: "Ustvarjeni dizajni",
    icon: ShirtFoldedIcon,
  },
  {
    collectionName: USERS_COLLECTION,
    displayName: "Uporabniki",
    icon: UsersIcon,
  },
  {
    collectionName: ORDERS_COLLECTION,
    displayName: "Naročila",
    icon: BasketIcon,
  },
];

export default function AdminNavigation() {
  return (
    <div className="fixed left-0 top-0 h-screen border-r-1 border-default-200 py-4 px-2 flex flex-col gap-4">
      <Tooltip content="Domov" placement="right">
        <Link
          className="flex hover:bg-default-400 p-2 rounded-md transition-colors mb-10"
          href="/"
        >
          <HouseIcon size={24} weight="duotone" />
        </Link>
      </Tooltip>
      {collections.map((collection) => (
        <Tooltip
          key={collection.collectionName}
          content={collection.displayName}
          placement="right"
        >
          <Link
            className="flex hover:bg-default-400 p-2 rounded-md transition-colors"
            href={`/admin/${collection.collectionName}`}
          >
            <collection.icon size={24} weight="duotone" />
          </Link>
        </Tooltip>
      ))}
    </div>
  );
}
