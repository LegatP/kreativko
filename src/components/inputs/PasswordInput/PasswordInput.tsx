"use client";

import React from "react";
import { Input, InputProps } from "@heroui/react";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";

export default function PasswordInput(
  props: Omit<InputProps, "type" | "endContent">
) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const iconClasses = "w-6 aspect-square text-default-900";

  const endContent = (
    <button
      className="focus:outline-none cursor-pointer"
      type="button"
      onClick={toggleVisibility}
    >
      {isVisible ? (
        <EyeClosedIcon className={iconClasses} />
      ) : (
        <EyeIcon className={iconClasses} />
      )}
    </button>
  );

  return (
    <Input
      // @ts-expect-error TODO: fix
      endContent={endContent}
      minLength={6}
      description="Geslo mora vsebovati vsaj 6 znakov."
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
}
