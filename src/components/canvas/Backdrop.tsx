import React, { useRef } from "react";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";

const Backdrop = () => {
  const shadows = useRef(null);

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.19}
      scale={4}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.12]}
      opacity={0.65}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
};

export default Backdrop;

// frames?: number;
// blend?: number;
// limit?: number;
// scale?: number;
// temporal?: boolean;
// opacity?: number;
// alphaTest?: number;
// color?: string;
// colorBlend?: number;
// resolution?: number;
// toneMapped?: boolean;
