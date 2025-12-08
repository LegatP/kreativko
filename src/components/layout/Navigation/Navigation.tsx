"use client";

import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import React from "react";
import logo from "@/../public/assets/moj-motiv.png";
import Image from "next/image";
import Link from "next/link";
import { PaintBrushIcon } from "@phosphor-icons/react";
import ROUTES from "@/utils/routes.utils";
import { trackCreateDesignFromHeader } from "@/lib/firebase/analytics";
import { createDesignSession } from "@/db/design-sessions";
import auth from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  async function createNewDesign() {
    const designSession = await createDesignSession({
      uploadedAssets: [],
      createdDesigns: [],
      userId: auth.currentUser ? auth.currentUser.uid : "guest",
    });
    router.push(ROUTES.createDesign(designSession.id));
  }

  return (
    <Navbar isBordered maxWidth="xl" position="static">
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <Link href={ROUTES.home} className="flex items-center">
          <Image className="w-[150px]" src={logo} alt="Moj Motiv - Logo" />
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
          color="primary"
          variant="bordered"
          className="text-primary font-bold"
          size="md"
          startContent={<PaintBrushIcon weight="bold" size={20} />}
          onPress={() => {
            trackCreateDesignFromHeader();
            createNewDesign();
          }}
        >
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
