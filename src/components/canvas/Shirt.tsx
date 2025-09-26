import React from "react";
import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAppStateContext } from "../contexts/AppContext";
import { Mesh, MeshStandardMaterial } from "three";

// useGLTF.preload("/assets/shirt_baked.glb");
const Shirt = () => {
  const {
    // @ts-expect-error frontPatternUrl not in all products
    currentProductConfig: { color, frontPatternUrl },
  } = useAppStateContext();

  const { gl } = useThree();

  const { nodes, materials } = useGLTF("/assets/shirt_baked.glb");

  console.log("Front pattern URL:", frontPatternUrl);
  const logoTexture = useTexture(frontPatternUrl || "/assets/threejs.png");
  if (logoTexture) {
    logoTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
  }

  useFrame((state, delta) =>
    easing.dampC(
      (materials.lambert1 as MeshStandardMaterial).color,
      color,
      0.25,
      delta
    )
  );

  return (
    <group>
      <mesh
        castShadow
        geometry={(nodes.T_Shirt_male as Mesh).geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {logoTexture && (
          <Decal
            position={[0.02, 0.02, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.265}
            map={logoTexture}
            depthTest={false}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
