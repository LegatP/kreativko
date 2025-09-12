import React, { useContext } from "react";
import { easing } from "maath";
// import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAppContext } from "../contexts/AppContext";

const Shirt = () => {
  // const snap = {
  // intro: true,
  // color: "#EFBD48",
  // isLogoTexture: false,
  // isFullTexture: false,
  // logoDecal: "assets/threejs.png",
  // fullDecal: "assets/threejs.png",
  // };
  const {
    state: { color },
  } = useAppContext();

  const { gl } = useThree();

  const { nodes, materials } = useGLTF("assets/shirt_baked.glb");

  const logoTexture = useTexture("assets/threejs.png");
  if (logoTexture) {
    logoTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
  }
  // const fullTexture = useTexture(snap.fullDecal);

  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, color, 0.25, delta)
  );

  // const stateString = JSON.stringify(snap);

  return (
    <group key="">
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {/* {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )} */}

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
