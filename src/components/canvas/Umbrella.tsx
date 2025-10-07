import React, { useRef } from "react";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useAppStateContext } from "../contexts/AppContext";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { Group, Mesh, MeshStandardMaterial } from "three";

// useGLTF.preload("/assets/umbrella.glb");

export function Umbrella() {
  const groupRef = useRef<Group>(null);
  const { nodes, materials } = useGLTF("assets/umbrella.glb");

  const { gl } = useThree();
  const { state } = useAppStateContext();

  const {
    // @ts-expect-error frontPatternUrl not in all products
    currentProductConfig: { color, frontPatternUrl },
  } = useAppStateContext();

  const targetRotation = state.viewState?.umbrellaRotation || 0;

  console.log("Front pattern URL:", frontPatternUrl);
  const logoTexture = useTexture(frontPatternUrl || "assets/threejs.png");
  if (logoTexture) {
    logoTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
  }

  useFrame((state, delta) => {
    easing.dampC(
      (materials.DefaultMaterial as MeshStandardMaterial).color,
      color,
      0.25,
      delta
    );

    // Smooth rotation animation for umbrella
    if (groupRef.current) {
      easing.damp(groupRef.current.rotation, "y", targetRotation, 0.3, delta);
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <mesh
        geometry={(nodes.Umbrella as Mesh).geometry}
        material={materials.DefaultMaterial}
        rotation={[-Math.PI * 2.1, 0.35, 0]}
        scale={0.38}
        // position={}
      >
        {logoTexture && (
          <Decal
            position={[0, 0.6, 1.2]}
            rotation={[0, 0, 0]}
            scale={0.265}
            map={logoTexture}
            depthTest={false}
          />
        )}
      </mesh>
    </group>
  );
}
