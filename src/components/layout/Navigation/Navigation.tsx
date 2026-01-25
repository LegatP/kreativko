"use client";

import { useState } from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import logo from "@/../public/assets/moj-motiv.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PaintBrushIcon } from "@phosphor-icons/react";
import ROUTES from "@/utils/routes.utils";
import { useCreateDesignContext } from "@/components/contexts/CreateDesignContext";

const menuItems = [
  { label: "Domov", href: ROUTES.home },
  { label: "Trgovina", href: ROUTES.shop },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useCreateDesignContext();
  const pathname = usePathname();

  // Hide "Ustvari Motiv" button on the design session page
  const isOnDesignSessionPage = pathname?.startsWith("/ustvari/");

  function handleCreateDesign() {
    openModal();
  }

  return (
    <Navbar
      isBordered
      maxWidth="xl"
      position="static"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Mobile menu toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Zapri meni" : "Odpri meni"}
        />
      </NavbarContent>

      {/* Logo - centered on mobile, left on desktop */}
      <NavbarContent className="hidden sm:flex" justify="start">
        <NavbarBrand>
          <Link href={ROUTES.home} className="flex items-center">
            <Image className="w-[150px]" src={logo} alt="Moj Motiv - Logo" />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Logo - mobile (centered by default) */}
      <NavbarBrand className="sm:hidden">
        <Link href={ROUTES.home} className="flex items-center">
          <Image className="w-[150px]" src={logo} alt="Moj Motiv - Logo" />
        </Link>
      </NavbarBrand>

      {/* Desktop navigation links */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href}>
            <Link
              href={item.href}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* CTA button */}
      <NavbarContent justify="end" className="flex gap-2">
        {!isOnDesignSessionPage && (
          <Button
            color="primary"
            className="text-white font-bold shadow-md hover:shadow-lg transition-shadow"
            size="md"
            startContent={<PaintBrushIcon weight="bold" size={20} />}
            onPress={handleCreateDesign}
          >
            <span className="hidden sm:inline">Ustvari Motiv</span>
            <span className="sm:hidden">Ustvari</span>
          </Button>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              href={item.href}
              className="w-full text-foreground hover:text-primary transition-colors font-medium text-lg py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
