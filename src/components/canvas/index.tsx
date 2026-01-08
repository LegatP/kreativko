import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";

import Shirt, { ShirtView } from "./Shirt";
import Backdrop from "./Backdrop";
import CameraRig from "./CameraRig";
import { Umbrella } from "./Umbrella";
import { Hoodie } from "./Hoodie";
import { Product } from "@/types/product.types";

const productToModel = {
  [Product.Shirt]: Shirt,
  [Product.Umbrella]: Umbrella,
  [Product.Hoodie]: Hoodie,
};

interface CanvasModelProps {
  product: Product | null;
  color: string;
  frontPatternUrl?: string;
  backPatternUrl?: string;
  view?: ShirtView;
}

interface ModelProps {
  color: string;
  frontPatternUrl?: string;
  backPatternUrl?: string;
  view: ShirtView;
}

// Inner scene component that holds the model
function Scene({
  product,
  modelProps,
}: {
  product: Product;
  modelProps: ModelProps;
}) {
  const Model = productToModel[product];

  return (
    <>
      <directionalLight
        castShadow
        intensity={0.5}
        position={[5, 10, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
      <Environment path="/assets/" files="potsdamer_platz_1k.hdr" />

      <CameraRig>
        <Backdrop />
        <Center>
          <Model
            color={modelProps.color}
            frontPatternUrl={modelProps.frontPatternUrl}
            backPatternUrl={modelProps.backPatternUrl}
            view={modelProps.view}
          />
        </Center>
      </CameraRig>
    </>
  );
}

const CanvasModel = ({
  product,
  color,
  frontPatternUrl,
  backPatternUrl,
  view = "front",
}: CanvasModelProps) => {
  // Debounce texture URL changes to prevent rapid re-renders
  const [stableProps, setStableProps] = useState<ModelProps>({
    color,
    frontPatternUrl,
    backPatternUrl,
    view,
  });

  // Update color and view immediately (they animate smoothly)
  useEffect(() => {
    setStableProps((prev) => ({
      ...prev,
      color,
      view,
    }));
  }, [color, view]);

  // Debounce texture URL changes to prevent infinite loops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStableProps((prev) => {
        if (
          prev.frontPatternUrl === frontPatternUrl &&
          prev.backPatternUrl === backPatternUrl
        ) {
          return prev;
        }
        return {
          ...prev,
          frontPatternUrl,
          backPatternUrl,
        };
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [frontPatternUrl, backPatternUrl]);

  if (!product) return null;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2], fov: 26 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full transition-all ease-in aspect-square"
    >
      <Scene product={product} modelProps={stableProps} />
    </Canvas>
  );
};

CanvasModel.displayName = "CanvasModel";

export default CanvasModel;
