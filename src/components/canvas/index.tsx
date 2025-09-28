import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Center, OrbitControls } from "@react-three/drei";

import Shirt from "./Shirt";
import Backdrop from "./Backdrop";
import CameraRig from "./CameraRig";
import { Umbrella } from "./Umbrella";
import { Hoodie } from "./Hoodie";
import { Product } from "@/types/product.types";
import { Configuration } from "@/db/configurations";

const productToModel = {
  [Product.Shirt]: Shirt,
  [Product.Umbrella]: Umbrella,
  [Product.Hoodie]: Hoodie,
};

interface CanvasModelProps {
  state: Configuration;
}

const CanvasModel = React.memo(({ state }: CanvasModelProps) => {
  if (!state.selectedProduct) return null;

  const Model = productToModel[state.selectedProduct];
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 26 }}
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
          <Model />
        </Center>
      </CameraRig>
      {/* <OrbitControls /> */}
    </Canvas>
  );
});

CanvasModel.displayName = "CanvasModel";

export default CanvasModel;
