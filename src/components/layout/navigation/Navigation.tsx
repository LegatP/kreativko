"use client";

import {
  Button,
  Card,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import React from "react";
import logo from "@/../public/assets/kreativko.png";
import Image from "next/image";
import Link from "next/link";
import { BasketIcon } from "@phosphor-icons/react";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";

export default function Navigation() {
  const { onOpen } = useCheckoutContext();
  return (
    <Navbar isBordered maxWidth="full" position="static">
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <Image className="w-[150px]" src={logo} alt="KREATIVKO" />
        {/* <p className="font-bold text-inherit">KREATIVKO</p> */}
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
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            onPress={onOpen}
            as={Link}
            color="primary"
            href="#"
            variant="flat"
            size="md"
          >
            <BasketIcon size={16} weight="duotone" /> Na blagajno
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
