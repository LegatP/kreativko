import { useState, useCallback } from "react";
import { ShirtView } from "./Shirt";

export function useCanvasControls(initialView: ShirtView = "front") {
  const [view, setView] = useState<ShirtView>(initialView);

  const toggleView = useCallback(() => {
    setView((v) => (v === "front" ? "back" : "front"));
  }, []);

  return { view, toggleView };
}
