"use client";

import React from "react";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";
import {
  FileIcon,
  HouseIcon,
  StarFourIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { Tooltip } from "@heroui/react";
import Link from "next/link";

const collections = [
  {
    collectionName: "ai_responses",
    displayName: "Motivi",
    icon: StarFourIcon,
  },
  {
    collectionName: "users",
    displayName: "Uporabniki",
    icon: UsersIcon,
  },
  {
    collectionName: "assets",
    displayName: "Datoteke",
    icon: FileIcon,
  },
];

export default function AdminNavigation() {
  const { onOpen } = useCheckoutContext();
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
