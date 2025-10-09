"use client";

import React, { use, useEffect } from "react";
import AnimatedHeading from "../../components/layout/AnimatedHeading/AnimatedHeading";
import { useRouter } from "next/navigation";

// UX
// Homepahe: input with dropdown and prompt suggestions, similar to
// /kreiraj => similar to adobe firefrefly

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/kreiraj");
  }, [router]);
  return null;
  // return <AnimatedHeading />;
}
