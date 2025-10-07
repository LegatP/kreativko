"use client";

import {
  Button,
  Card,
  Divider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  useDisclosure,
} from "@heroui/react";
import React from "react";
import logo from "@/../public/assets/kreativko.png";
import Image from "next/image";
import Link from "next/link";
import {
  BasketIcon,
  CaretDownIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";
import ROUTES from "@/utils/routes.utils";
import cx from "classnames";
import { useAppStateContext } from "@/components/contexts/AppContext";
import { ProductIcons } from "@/config";
import { Product } from "@/types/product.types";
import ProductDetailsModal from "./ProductDetailsModal";

export default function EditorNavigation() {
  const { onOpen } = useCheckoutContext();
  const { state } = useAppStateContext();
  const { isOpen, onOpen: onModalOpen, onClose } = useDisclosure();
  const Icon = ProductIcons[state.selectedProduct as Product];

  // Function to get product display name
  const getProductDisplayName = () => {
    switch (state.selectedProduct) {
      case Product.Shirt:
        return "Moška majica s kratkimi rokavi";
      case Product.Hoodie:
        return "Unisex pulover s kapuco";
      case Product.Umbrella:
        return "Dežnik";
      default:
        return "Izdelek";
    }
  };

  // Function to get current configuration summary
  const getConfigSummary = () => {
    const config = state.configs[state.selectedProduct];
    const totalItems = Object.values(config.sizes || {}).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalItems === 0) {
      return "Ni izbrane velikosti";
    }

    const selectedSizes = Object.entries(config.sizes || {})
      .filter(([, count]) => count > 0)
      .map(([size, count]) => `${count} x ${size}`)
      .join(" | ");

    return selectedSizes || "Ni izbrane velikosti";
  };

  return (
    <>
      <ProductDetailsModal isOpen={isOpen} onClose={onClose} />
      <Navbar
        isBordered
        maxWidth="full"
        position="static"
        classNames={{ wrapper: "px-4" }}
      >
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <div>
            <NavbarBrand>
              <Link href={ROUTES.home} className="flex items-center">
                <Image className="w-[150px]" src={logo} alt="KREATIVKO" />
              </Link>
            </NavbarBrand>
          </div>
          <Divider orientation="vertical" />
          <div className="flex flex-row gap-2">
            <Card
              className={cx(
                "aspect-square min-w-12 items-center justify-center"
              )}
              radius="md"
              shadow="sm"
            >
              <Icon size={32} />
            </Card>
            <Button
              className="py-6"
              variant="light"
              size="md"
              fullWidth
              endContent={<CaretDownIcon size={16} />}
              onPress={onModalOpen}
            >
              <div className="flex flex-col items-start py-4">
                <h1 className="font-bold text-xl text-default-900 leading-tight">
                  {getProductDisplayName()}
                </h1>
                <div className="text-default-600 text-sm leading-tight">
                  {getConfigSummary()}
                </div>
              </div>
            </Button>
          </div>
        </NavbarContent>
        <NavbarContent justify="end" className="flex gap-2">
          <Button
            as={Link}
            color="default"
            href={ROUTES.shop}
            variant="flat"
            isIconOnly
            size="md"
          >
            <MagnifyingGlassIcon size={20} weight="duotone" />
          </Button>
          <Button
            as={Link}
            color="default"
            href={ROUTES.profile}
            variant="flat"
            isIconOnly
            size="md"
          >
            <UserCircleIcon size={20} weight="duotone" />
          </Button>
          <Button
            onPress={onOpen}
            color="primary"
            variant="flat"
            size="md"
            startContent={<BasketIcon size={20} weight="duotone" />}
          >
            Dodaj v košarico
          </Button>
        </NavbarContent>
      </Navbar>
    </>
  );
}
