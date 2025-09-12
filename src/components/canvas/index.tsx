import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";

import Shirt from "./Shirt";
import Backdrop from "./Backdrop";
import CameraRig from "./CameraRig";

const CanvasModel = React.memo(() => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 22 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full transition-all ease-in aspect-square"
    >
      <ambientLight intensity={0.5} />
      <Environment path="/assets/" files="potsdamer_platz_1k.hdr" />

      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
});

CanvasModel.displayName = "CanvasModel";

export default CanvasModel;
