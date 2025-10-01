"use client";

import React, { useState } from "react";
import { Input, Button, Checkbox, Link } from "@heroui/react";
import { signUpWithEmail } from "@/lib/firebase/auth";
import PasswordInput from "../inputs/PasswordInput/PasswordInput";
import { AnimatePresence, motion } from "framer-motion";
import Delivery from "../checkout/Delivery";
import { CaretRightIcon } from "@phosphor-icons/react";
import { useFormStatus } from "react-dom";
import { useUncontrolledForm } from "@/hooks/useUncontrolledForm";
import { setUserProfile } from "@/db/users";
import { UserProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import ROUTES from "@/utils/routes.utils";

export default function SignUpForm() {
  const [isInitalView, setIsInitalView] = useState(true);
  const { pending } = useFormStatus();
  const router = useRouter();
  const { handleSubmit } = useUncontrolledForm<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptTerms: boolean;
    newsletterSubscribed: boolean;
    phone: string;
    postCode: string;
    city: string;
    address: string;
    country: string;
  }>(
    async ({
      firstName,
      lastName,
      email,
      password,
      acceptTerms,
      newsletterSubscribed,
      phone,
      postCode,
      city,
      address,
      country,
    }) => {
      setError("");

      console.log({
        firstName,
        lastName,
        email,
        password,
        acceptTerms,
        newsletterSubscribed,
        phone,
        postCode,
        city,
        address,
        country,
      });

      if (!acceptTerms) {
        setError("Prosimo, sprejmite pogoje uporabe.");
        return;
      }

      const displayName = `${firstName} ${lastName}`.trim();
      const { user, error: authError } = await signUpWithEmail(
        email,
        password,
        displayName
      );
      console.log({ user, authError });

      if (authError) {
        setError(getErrorMessage(authError));
      } else if (user) {
        let userData: Partial<UserProfile> = {
          firstName,
          lastName,
          termsAcceptedAt: new Date(),
          newsletterSubscribed,
        };
        if (phone && address && city && postCode && country) {
          userData = {
            ...userData,
            phone,
            deliveryAddress: { address, city, postCode, country },
          };
        }
        await setUserProfile(user.uid, userData);

        router.push(ROUTES.home);
      }
    }
  );

  const [error, setError] = useState("");

  const getErrorMessage = (error: string) => {
    if (error.includes("email-already-in-use")) {
      return "Ta e-poštni naslov je že v uporabi.";
    } else if (error.includes("invalid-email")) {
      return "Neveljaven e-poštni naslov.";
    } else if (error.includes("weak-password")) {
      return "Geslo je prešibko.";
    }
    return "Prišlo je do napake. Poskusite znova.";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <Input
            label="Ime"
            name="firstName"
            isRequired
            variant="flat"
            size="sm"
          />
          <Input
            label="Priimek"
            name="lastName"
            isRequired
            variant="flat"
            size="sm"
          />
        </div>

        <Input
          type="email"
          label="Elektronski naslov"
          name="email"
          isRequired
          variant="flat"
          size="sm"
        />

        <PasswordInput
          label="Geslo"
          name="password"
          isRequired
          variant="flat"
          size="sm"
        />
        <button
          type="button"
          className="flex flex-row gap-2 items-center text-sm text-default-900 self-end cursor-pointer underline"
          onClick={() => setIsInitalView(!isInitalView)}
        >
          Dodaj podatke za dostavo
          <CaretRightIcon
            style={{
              transform: !isInitalView ? "rotate(90deg)" : "none",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isInitalView && (
          <motion.div
            className="space-y-4"
            key="delivery-info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Delivery />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-1">
        <Checkbox
          name="acceptTerms"
          // value="true"
          size="sm"
          isRequired
          classNames={{ label: "text-foreground text-xs" }}
        >
          Sprejemam{" "}
          <Link size="sm" href="/pogoji">
            pogoje uporabe
          </Link>{" "}
          in{" "}
          <Link size="sm" href="/zasebnost">
            pravila o zasebnosti.
          </Link>
        </Checkbox>

        <Checkbox
          name="newsletterSubscribed"
          // value="true"
          size="sm"
          classNames={{ label: "text-foreground text-xs" }}
        >
          Želim prejemati novice o posebnih ponudbah.
        </Checkbox>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <Button
        type="submit"
        size="md"
        className="w-full text-white"
        color="primary"
        isLoading={pending}

        // isDisabled={
        //   !firstName ||
        //   !lastName ||
        //   !email ||
        //   !password ||
        //   !confirmPassword ||
        //   !acceptTerms
        // }
      >
        Ustvari račun
      </Button>
    </form>
  );
}
