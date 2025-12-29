"use client";

import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import logo from "@/../public/assets/moj-motiv.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PaintBrushIcon } from "@phosphor-icons/react";
import ROUTES from "@/utils/routes.utils";
import { useCreateDesignContext } from "@/components/contexts/CreateDesignContext";

export default function Navigation() {
  const { openModal } = useCreateDesignContext();
  const pathname = usePathname();

  // Hide "Ustvari Motiv" button on the design session page
  const isOnDesignSessionPage = pathname?.startsWith("/ustvari/");

  function handleCreateDesign() {
    openModal();
  }

  return (
    <Navbar isBordered maxWidth="xl" position="static">
      <NavbarBrand>
        <Link href={ROUTES.home} className="flex items-center">
          <Image className="w-[150px]" src={logo} alt="Moj Motiv - Logo" />
        </Link>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      ></NavbarContent>
      <NavbarContent justify="end" className="flex gap-2">
        {!isOnDesignSessionPage && (
          <Button
            color="primary"
            variant="bordered"
            className="text-primary font-bold"
            size="md"
            startContent={<PaintBrushIcon weight="bold" size={20} />}
            onPress={handleCreateDesign}
          >
            Ustvari Motiv
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}
