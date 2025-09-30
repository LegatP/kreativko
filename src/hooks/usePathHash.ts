"use client";

import { useEffect, useState } from "react";

export default function usePathHash() {
  const [hash, setHash] = useState<string>(window.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
      console.log("Hash changed to:", window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return hash;
}
