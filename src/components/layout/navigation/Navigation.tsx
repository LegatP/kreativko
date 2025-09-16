"use client";

import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import React from "react";
import logo from "@/../public/assets/kreativko.png";
import Image from "next/image";

export default function Navigation() {
  return (
    <Navbar isBordered>
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
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem> */}
      </NavbarContent>
    </Navbar>
  );
}
