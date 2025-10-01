"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";

export default function usePathHash() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const [hash, setHash] = useState<string>(window.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange); // in case of back/forward navigation

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHash(window.location.hash);
    }
  }, [pathname, searchParams, params]); // re-run whenever navigation happens

  return hash;
}
