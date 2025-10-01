"use client";

import React from "react";
import { Input as HeroInput, InputProps } from "@heroui/react";

export default function Input(props: InputProps) {
  return (
    // @ts-expect-error TODO: fix
    <HeroInput {...props} />
  );
}
