"use client";

import Link from "next/link";
import { Chip } from "@heroui/react";
import { ProductCategory } from "@/db/product-categories";
import ROUTES from "@/utils/routes.utils";

interface CategorySidebarProps {
  categories: ProductCategory[];
  currentCategorySlug?: string;
  productCounts?: Record<string, number>;
}

export default function CategorySidebar({
  categories,
  currentCategorySlug,
  productCounts,
}: CategorySidebarProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold text-foreground py-2">Kategorije</p>
        <div className="space-y-1">
          {categories.map((category) => {
            const isActive = category.slug === currentCategorySlug;
            const count = productCounts?.[category.id];

            return (
              <Link
                key={category.id}
                href={ROUTES.category(category.slug)}
                className={`flex items-center justify-between w-full px-2 py-1.5 rounded text-sm text-left transition-colors ${
                  isActive
                    ? "text-primary font-medium bg-primary-50"
                    : "text-foreground hover:bg-default-100"
                }`}
              >
                <span>{category.name}</span>
                {count !== undefined && (
                  <span
                    className={`text-xs ${
                      isActive ? "text-primary" : "text-foreground/60"
                    }`}
                  >
                    ({count})
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface MobileCategoryChipsProps {
  categories: ProductCategory[];
  currentCategorySlug?: string;
}

export function MobileCategoryChips({
  categories,
  currentCategorySlug,
}: MobileCategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 lg:hidden">
      {categories.map((category) => {
        const isActive = category.slug === currentCategorySlug;

        return (
          <Chip
            key={category.id}
            as={Link}
            href={ROUTES.category(category.slug)}
            variant={isActive ? "solid" : "bordered"}
            color={isActive ? "primary" : "default"}
            className="cursor-pointer"
          >
            {category.name}
          </Chip>
        );
      })}
    </div>
  );
}
