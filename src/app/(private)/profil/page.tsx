"use client";

import React from "react";
import { Card, Tab, Tabs } from "@heroui/react";
import usePathHash from "@/hooks/usePathHash";

export default function Page() {
  const hash = usePathHash();

  console.log("hash", hash);
  const cardClasses =
    "p-6 sm:p-25 sm:pt-16 flex flex-col gap-4 items-center w-full";

  return (
    <>
      <Tabs
        className="sm:mb-4 hidden md:block"
        variant="light"
        color="default"
        selectedKey={hash && hash !== "" ? hash : "#moja-narocila"}
        size="lg"
      >
        <Tab
          href="#moja-narocila"
          key="#moja-narocila"
          title="Moja naročila"
          className="w-full max-w-3xl"
        >
          <Card fullWidth className={cardClasses}>
            <h1 className="text-2xl font-bold text-default-900 mb-2 self-start">
              Moja naročila
            </h1>
            <p>TODO</p>
          </Card>
        </Tab>
        <Tab
          href="#nastavitve"
          key="#nastavitve"
          title="Nastavitve"
          className="w-full max-w-xl"
        >
          <Card fullWidth className={cardClasses}>
            <h1 className="text-2xl font-bold text-default-900 mb-2 self-start">
              Nastavitve
            </h1>
            <p>TODO</p>
          </Card>
        </Tab>
      </Tabs>
    </>
  );
}
