"use client";

import React from "react";
import { Input, Button, addToast } from "@heroui/react";
import { resetPassword } from "@/lib/firebase/auth";
import { useUncontrolledForm } from "@/hooks/useUncontrolledForm";
import { useFormStatus } from "react-dom";

export default function ForgotPasswordForm({}) {
  const { pending } = useFormStatus();
  const { handleSubmit } = useUncontrolledForm<{ email: string }>(
    async ({ email }) => {
      const { success, error: resetError } = await resetPassword(email);

      if (resetError) {
        addToast({
          description: "Prišlo je do napake. Poskusite znova.",
          color: "danger",
        });
      } else if (success) {
        addToast({
          description:
            "Povezava za ponastavitev gesla je bila poslana na vaš elektronski naslov.",
          color: "success",
        });
      }
    }
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        name="email"
        label="Elektronski naslov"
        isRequired
        variant="flat"
        size="sm"
      />
      <p className="text-xs text-default-900">
        Vnesite vaš elektronski naslov in poslali vam bomo povezavo za
        ponastavitev gesla.
      </p>

      <Button
        type="submit"
        className="w-full text-white"
        color="primary"
        size="md"
        isLoading={pending}
      >
        Pošlji
      </Button>
    </form>
  );
}
