import React, { useMemo } from "react";
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

// TODO: imrove rendering
const CanvasModel = React.memo(
  ({ product, color, frontPatternUrl, backPatternUrl, view = "front" }: CanvasModelProps) => {
    const canvas = useMemo(() => {
      if (!product) return null;
      const Model = productToModel[product];
      return (
        <Canvas
          shadows
          camera={{ position: [0, 0, 2], fov: 26 }}
          gl={{ preserveDrawingBuffer: true }}
          className="w-full h-full transition-all ease-in aspect-square"
        >
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
                color={color}
                frontPatternUrl={frontPatternUrl}
                backPatternUrl={backPatternUrl}
                view={view}
              />
            </Center>
          </CameraRig>
        </Canvas>
      );
    }, [color, frontPatternUrl, backPatternUrl, product, view]);
    return canvas;
  }
);

CanvasModel.displayName = "CanvasModel";

export default CanvasModel;
