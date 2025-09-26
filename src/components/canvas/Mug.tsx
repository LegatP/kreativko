import React from "react";
import { useGLTF } from "@react-three/drei";

const Mug = () => {
  // const {
  //   currentProductConfig: { color, frontPatternUrl },
  // } = useAppStateContext();

  // const { gl } = useThree();

  const { scene } = useGLTF("assets/mug.glb");
  console.log("Mug scene:", scene);

  // console.log("Front pattern URL:", frontPatternUrl);
  // const logoTexture = useTexture(frontPatternUrl || "assets/threejs.png");
  // if (logoTexture) {
  //   logoTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
  // }

  // useFrame((state, delta) =>
  //   easing.dampC(materials.lambert1.color, color, 0.25, delta)
  // );

  return (
    <group>
      <primitive
        object={scene}
        scale={0.012}
        position-y={-0.19}
        position-x={0}
        // position-y={-1}
        // rotation-y={Math.PI}
      />
      {/* <mesh
        castShadow
        geometry={nodes}
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
      </mesh> */}
    </group>
  );
};

export default Mug;
