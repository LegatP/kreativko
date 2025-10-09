import React, { useRef, useMemo } from "react";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useAppStateContext } from "../contexts/AppContext";
import { Group, MeshStandardMaterial, Mesh } from "three";
import { easing } from "maath";
import { createDashedBorderTexture } from "../../utils/dashed-border-texture";

// useGLTF.preload("/assets/hoodie.glb");
export function Hoodie() {
  const groupRef = useRef<Group>(null);
  const { nodes, materials } = useGLTF("assets/hoodie.glb");
  console.log(nodes);

  const { gl } = useThree();
  const { state } = useAppStateContext();

  const {
    // @ts-expect-error frontPatternUrl not in all products
    currentProductConfig: { color, frontPatternUrl },
  } = useAppStateContext();

  const currentView = state.viewState?.currentView || "front";
  const designRatio = "2:3"; // Default ratio

  console.log("Front pattern URL:", frontPatternUrl);
  
  // Create dashed border texture for placeholder
  const dashedBorderTexture = useMemo(() => {
    return createDashedBorderTexture(256, 256, designRatio);
  }, [designRatio]);

  // Load actual texture only if frontPatternUrl exists and is not the default
  const logoTexture = useTexture(
    frontPatternUrl && frontPatternUrl !== "assets/threejs.png" 
      ? frontPatternUrl 
      : "assets/threejs.png"
  );

  // Use actual texture if available, otherwise use dashed border
  const displayTexture = frontPatternUrl && frontPatternUrl !== "assets/threejs.png" 
    ? logoTexture 
    : dashedBorderTexture;
    
  if (logoTexture) {
    logoTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
  }

  useFrame((state, delta) => {
    // Smooth rotation animation
    const targetRotationY = currentView === "back" ? Math.PI : 0;
    if (groupRef.current) {
      easing.damp(groupRef.current.rotation, "y", targetRotationY, 0.3, delta);
    }
  });

  console.log("Materials:", materials, color);
  // useFrame((state, delta) => {
  //   if (color) {
  // easing.dampC(
  //   materials.Cotton_Heavy_Canvas_FRONT_2475.color,
  //   color,
  //   1,
  //   delta
  // );
  // easing.dampC(materials.Rib_1X1_486gsm_FRONT_2463.color, color, 10, delta);
  // easing.dampC(materials.Fabric249846_FRONT_6945.color, color, 0.25, delta);
  // easing.dampC(materials.Fabric249846_SIDE_6945.color, color, 0.25, delta);
  // easing.dampC(
  //   materials.Knit_Fleece_Terry_FRONT_2452.color,
  //   color,
  //   1,
  //   delta
  // );
  // materials.Cotton_Heavy_Canvas_FRONT_2475.color.set(color);
  // materials.Knit_Fleece_Terry_FRONT_2452.color.set(color);
  // }
  // });

  return (
    <group ref={groupRef} dispose={null}>
      <group scale={0.0095}>
        {/* <Sphere
          args={[0.1, 32, 32]}
          position={[0.04, 0.4, 0.4]}
          rotation={[Math.PI, Math.PI, 0]}
          scale={1}
        /> */}
        <mesh
          geometry={(nodes.Hands_down_FBX_1 as Mesh).geometry}
          material={new MeshStandardMaterial({ color })}
        >
          {/* Always show either the design or the placeholder */}
          <Decal
            position={[8.5, 145, 4]}
            rotation={[0, 0, 0]}
            scale={17}
            map={displayTexture}
            depthTest={false}
          />
        </mesh>
        <mesh
          geometry={(nodes.Hands_down_FBX_2 as Mesh).geometry}
          material={materials.Rib_1X1_486gsm_FRONT_2463}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_3 as Mesh).geometry}
          material={materials.Fabric249846_FRONT_6945}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_4 as Mesh).geometry}
          material={materials.Fabric249846_SIDE_6945}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_5 as Mesh).geometry}
          material={materials.Cotton_Heavy_Canvas_FRONT_2475}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_6 as Mesh).geometry}
          material={materials.Material2816632}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_7 as Mesh).geometry}
          material={materials.Material2816644}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_8 as Mesh).geometry}
          material={materials.Material249697}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_9 as Mesh).geometry}
          material={materials.Material249861}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_10 as Mesh).geometry}
          material={materials.Material249863}
        />
        <mesh
          geometry={(nodes.Hands_down_FBX_11 as Mesh).geometry}
          material={materials.Material249865}
        />
      </group>
    </group>
  );
}
