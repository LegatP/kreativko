import { useRef, useMemo, useEffect } from "react";
import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { createDashedBorderTexture } from "../../utils/dashed-border-texture";

// useGLTF.preload("/assets/shirt_baked.glb");

export type ShirtView = "front" | "back";

interface ShirtProps {
  color: string;
  frontPatternUrl?: string;
  backPatternUrl?: string;
  view?: ShirtView;
}

const Shirt = ({
  color,
  frontPatternUrl,
  backPatternUrl,
  view = "front",
}: ShirtProps) => {
  const groupRef = useRef<Group>(null);

  const { gl } = useThree();
  const designRatio = "2:3"; // Default ratio since viewState.designRatio doesn't exist yet

  const { nodes, materials } = useGLTF("/assets/shirt_baked.glb");

  // Create dashed border texture for placeholder
  const dashedBorderTexture = useMemo(() => {
    return createDashedBorderTexture(256, 256, designRatio);
  }, [designRatio]);

  // Load front texture
  const frontLogoTexture = useTexture(
    frontPatternUrl && frontPatternUrl !== "/assets/threejs.png"
      ? frontPatternUrl
      : "/assets/threejs.png"
  );

  // Load back texture
  const backLogoTexture = useTexture(
    backPatternUrl && backPatternUrl !== "/assets/threejs.png"
      ? backPatternUrl
      : "/assets/threejs.png"
  );

  // Use actual texture if available, otherwise use dashed border
  const frontDisplayTexture =
    frontPatternUrl && frontPatternUrl !== "/assets/threejs.png"
      ? frontLogoTexture
      : dashedBorderTexture;

  const backDisplayTexture =
    backPatternUrl && backPatternUrl !== "/assets/threejs.png"
      ? backLogoTexture
      : dashedBorderTexture;

  // Set anisotropy for better texture quality
  useMemo(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    if (frontLogoTexture) {
      frontLogoTexture.anisotropy = maxAnisotropy;
    }
    if (backLogoTexture) {
      backLogoTexture.anisotropy = maxAnisotropy;
    }
  }, [frontLogoTexture, backLogoTexture, gl.capabilities]);

  useFrame((state, delta) => {
    easing.dampC(
      (materials.lambert1 as MeshStandardMaterial).color,
      color,
      0.25,
      delta
    );

    // Smooth rotation animation based on view
    const targetRotationY = view === "back" ? Math.PI : 0;
    if (groupRef.current) {
      easing.damp(groupRef.current.rotation, "y", targetRotationY, 0.3, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        castShadow
        geometry={(nodes.T_Shirt_male as Mesh).geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {/* Front design */}
        {!!frontPatternUrl && (
          <Decal
            position={[0.02, 0.02, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.265}
            map={frontDisplayTexture!}
            depthTest={false}
          />
        )}
        {/* Back design */}
        {!!backPatternUrl && (
          <Decal
            position={[-0.02, 0.02, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={0.25}
            map={backDisplayTexture!}
            depthTest={false}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
