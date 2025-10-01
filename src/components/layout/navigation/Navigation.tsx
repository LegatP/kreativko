"use client";

import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import React from "react";
import logo from "@/../public/assets/kreativko.png";
import Image from "next/image";
import Link from "next/link";
import {
  BasketIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";
import ROUTES from "@/utils/routes.utils";

export default function Navigation() {
  const { onOpen } = useCheckoutContext();
  return (
    <Navbar isBordered maxWidth="xl" position="static">
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <Link href={ROUTES.home} className="flex items-center">
          <Image className="w-[150px]" src={logo} alt="KREATIVKO" />
          {/* <p className="font-bold text-inherit">KREATIVKO</p> */}
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem> */}
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
          isIconOnly
        >
          <BasketIcon size={20} weight="duotone" />
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
