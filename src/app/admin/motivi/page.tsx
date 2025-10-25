"use client";

import db from "@/lib/firebase/firestore";
import { addToast, Image, Tooltip } from "@heroui/react";
import { collection, limit, query } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

export default function Page() {
  const [values] = useCollectionDataOnce(
    query(collection(db, `ai_responses`), limit(30))
  );

  console.log("VALUES", values);

  return (
    <div className="flex flex-row flex-wrap gap-4 items-center justify-center m-5">
      {values?.map((item, i) => (
        <Tooltip key={i} content={item.prompt} placement="top">
          <button
            className="w-40 border p-2 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(item.prompt);
              addToast({
                title: "Besedilo kopirano",
                description: "Besedilo je bilo kopirano v odložišče.",
                color: "success",
              });
            }}
          >
            <Image src={item.imageUrl} alt="AI Generated Design" />
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
