"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createDesignSession, updateDesignSession } from "@/db/design-sessions";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { arrayUnion } from "@/lib/firebase/firestore";
import auth from "@/lib/firebase/auth";
import ROUTES from "@/utils/routes.utils";
import { Spinner } from "@heroui/react";

export default function CreateSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createImage } = useImageGeneration();
  const hasStartedRef = useRef(false);

  const opis = searchParams.get("opis");
  const reference = searchParams.get("reference")?.split(",").filter(Boolean);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const createSessionAndGenerate = async () => {
      // 1. Create session first
      const session = await createDesignSession({
        userId: auth.currentUser?.uid || "guest",
        uploadedAssets: [],
        createdDesigns: [],
      });

      // 2. Start generation FIRST (fire and forget)
      if (opis) {
        const mode = reference?.length ? "edit" : "create";
        createImage(opis, reference, mode).then(async (result) => {
          if (result?.url) {
            await updateDesignSession(session.id, {
              createdDesigns: arrayUnion({ title: opis, url: result.url }),
              designUrls: { front: result.url },
            });
          }
        });
      }

      // 3. Navigate AFTER (delay like homepage modal animation)
      // TODO: improve with a better transition solution
      setTimeout(() => {
        router.replace(ROUTES.createDesign(session.id));
      }, 350);
    };

    createSessionAndGenerate();
  }, [opis, reference, createImage, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Spinner size="lg" />
      <p className="text-default-500 text-sm">Pripravljamo...</p>
    </div>
  );
}
