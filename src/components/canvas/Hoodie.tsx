import React from "react";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAppStateContext } from "../contexts/AppContext";
import { MeshStandardMaterial, Mesh } from "three";

useGLTF.preload("assets/hoodie.glb");
export function Hoodie() {
  const { nodes, materials } = useGLTF("assets/hoodie.glb");
  console.log(nodes);

  const { gl } = useThree();

  const {
    // @ts-expect-error frontPatternUrl not in all products
    currentProductConfig: { color, frontPatternUrl },
  } = useAppStateContext();

  console.log("Front pattern URL:", frontPatternUrl);
  const logoTexture = useTexture(frontPatternUrl || "assets/threejs.png");
  if (logoTexture) {
    logoTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
  }

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
    <group dispose={null}>
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
          {logoTexture && (
            <Decal
              position={[8.5, 145, 4]}
              rotation={[0, 0, 0]}
              scale={17}
              map={logoTexture}
              depthTest={false}
            />
          )}
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
