"use client";

import React, { useState } from "react";
import { Input, Button, Link, Chip } from "@heroui/react";
import { signInWithEmail } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import PasswordInput from "../inputs/PasswordInput/PasswordInput";
import { useUncontrolledForm } from "@/hooks/useUncontrolledForm";
import { useFormStatus } from "react-dom";
import { WarningCircleIcon } from "@phosphor-icons/react";

export default function SignInForm() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { pending } = useFormStatus();
  const { handleSubmit } = useUncontrolledForm<{
    email: string;
    password: string;
  }>(async ({ email, password }) => {
    setError("");

    const { user, error: authError } = await signInWithEmail(email, password);

    if (authError) {
      setError(getErrorMessage(authError));
    } else if (user) {
      router.push("/");
    }
  });

  const getErrorMessage = (error: string) => {
    if (error.includes("user-not-found")) {
      return "Uporabnik s tem e-poštnim naslovom ne obstaja.";
    } else if (error.includes("wrong-password")) {
      return "Napačno geslo.";
    } else if (error.includes("invalid-email")) {
      return "Neveljaven e-poštni naslov.";
    } else if (error.includes("auth/invalid-credential")) {
      return "Napačno uporabniško ime ali geslo.";
    } else if (error.includes("too-many-requests")) {
      return "Preveč poskusov. Poskusite znova pozneje.";
    }
    return "Prišlo je do napake. Poskusite znova.";
  };

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        label="E-poštni naslov"
        variant="flat"
        size="sm"
        isRequired
      />
      <div className="flex flex-col gap-2">
        <PasswordInput
          name="password"
          label="Geslo"
          variant="flat"
          size="sm"
          isRequired
        />
        <Link className="text-xs self-end" href="#pozabljeno-geslo">
          Pozabljeno geslo?
        </Link>
      </div>

      {error && (
        <Chip
          variant="bordered"
          className="min-w-full p-4 text-danger"
          color="danger"
          startContent={
            <WarningCircleIcon
              className="text-danger"
              size={20}
              weight="bold"
            />
          }
          radius="sm"
        >
          {error}
        </Chip>
      )}

      <Button
        type="submit"
        className="w-full text-white"
        color="primary"
        isLoading={pending}
        size="md"
      >
        Prijavi se
      </Button>
    </form>
  );
}
