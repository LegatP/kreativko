"use client";

import CanvasModel from "@/components/canvas";
import { Configuration, getConfigurationById } from "@/db/configurations";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [state, setState] = useState<Configuration | null>(null);

  const { id } = useParams<{ id: string }>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const state = await getConfigurationById(id);
  //     setState(state);
  //   };
  //   fetchData();
  // }, [id]);

  if (!state) return null;
  // return <CanvasModel />;
  return null;
}
