"use client";

import CanvasModel from "@/components/canvas";
import { Configuration, getConfigurationById } from "@/db/configurations";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [state, setState] = useState<Configuration | null>(null);

  const { id } = useParams<{ id: string }>();
  console.log("ID:", id);

  useEffect(() => {
    const fetchData = async () => {
      const state = await getConfigurationById(id);
      console.log("Fetched state:", state);
      setState(state);
    };
    fetchData();
  }, [id]);

  if (!state) return null;
  return <CanvasModel state={state} />;
}
