"use client";

import React from "react";
import { Card, Tab, Tabs } from "@heroui/react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import usePathHash from "@/hooks/usePathHash";

export default function Page() {
  const hash = usePathHash();

  const cardClasses =
    "p-6 sm:p-25 sm:pt-16 flex flex-col gap-4 items-center w-full";

  return (
    <>
      <Tabs
        className="sm:mb-4 hidden md:block"
        variant="light"
        color="default"
        selectedKey={hash ?? "#prijava"}
        size="lg"
      >
        <Tab
          href="#prijava"
          key="#prijava"
          title="Prijava"
          className="w-full max-w-xl"
        >
          <Card fullWidth className={cardClasses}>
            <h1 className="text-2xl font-bold text-default-900 mb-2 self-start">
              Prijava
            </h1>
            <SignInForm />
          </Card>
        </Tab>
        <Tab
          href="#registracija"
          key="#registracija"
          title="Registracija"
          className="w-full max-w-xl"
        >
          <Card fullWidth className={cardClasses}>
            <h1 className="text-2xl font-bold text-default-900 mb-2 self-start">
              Registracija
            </h1>
            <SignUpForm />
          </Card>
        </Tab>
        <Tab
          href="#pozabljeno-geslo"
          key="#pozabljeno-geslo"
          title="Pozabljeno geslo"
          className="w-full max-w-xl"
        >
          <Card fullWidth className={cardClasses}>
            <h1 className="text-2xl font-bold text-default-900 mb-2 self-start">
              Pozabljeno geslo
            </h1>
            <ForgotPasswordForm />
          </Card>
        </Tab>
      </Tabs>
    </>
  );
}
