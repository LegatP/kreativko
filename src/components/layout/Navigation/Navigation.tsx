"use client";

import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import React from "react";
import logo from "@/../public/assets/kreativko.png";
import Image from "next/image";
import Link from "next/link";
import { PaintBrushIcon } from "@phosphor-icons/react";
import ROUTES from "@/utils/routes.utils";
import { trackCreateDesignFromHeader } from "@/lib/firebase/analytics";

export default function Navigation() {
  return (
    <Navbar isBordered maxWidth="xl" position="static">
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <Link href={ROUTES.home} className="flex items-center">
          {/* <Image className="w-[150px]" src={logo} alt="KREATIVKO" /> */}
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
        {/* <Button
          as={Link}
          color="default"
          href={ROUTES.shop}
          variant="flat"
          isIconOnly
          size="md"
        >
          <MagnifyingGlassIcon size={20} weight="duotone" />
        </Button> */}
        {/* <Button
          as={Link}
          color="primary"
          href={ROUTES.login}
          variant="bordered"
          className="text-primary"
          // isIconOnly
          size="md"
        >
          <UserCircleIcon size={20} weight="duotone" />
          {auth.currentUser?.displayName || "Prijava"}
        </Button> */}
        <Button
          as={Link}
          color="primary"
          href={ROUTES.createDesign()}
          variant="bordered"
          className="text-primary font-bold"
          // isIconOnly
          size="md"
          startContent={<PaintBrushIcon weight="bold" size={20} />}
          onPress={() => trackCreateDesignFromHeader()}
        >
          {/* <UserCircleIcon size={20} weight="duotone" />
          {auth.currentUser?.displayName || "Prijava"} */}
          Ustvari Motiv
        </Button>
        {/* <Button
          onPress={onOpen}
          color="primary"
          variant="flat"
          size="md"
          isIconOnly
        >
          <BasketIcon size={20} weight="duotone" />
        </Button> */}
      </NavbarContent>
    </Navbar>
  );
}
