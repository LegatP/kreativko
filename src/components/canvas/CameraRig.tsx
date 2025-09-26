"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { Euler, Group, Vector3 } from "three";

interface CameraRigProps {
  children: React.ReactNode;
}

const CameraRig = ({ children }: CameraRigProps) => {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    // const isBreakpoint = window.innerWidth <= 1260;
    // const isMobile = window.innerWidth <= 600;

    // set the initial position of the model
    // let targetPosition = [-0.4, 0, 2];
    // if (snap.intro) {
    //   if (isBreakpoint) targetPosition = [0, 0, 2];
    //   if (isMobile) targetPosition = [0, 0.2, 2.5];
    // } else {
    //   if (isMobile) targetPosition = [0, 0, 2.5];
    //   else targetPosition = [0, 0, 2];
    // }

    const targetPosition = new Vector3(0, -0.075, 2);

    // set model camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // set the model rotation smoothly
    easing.dampE(
      group.current?.rotation || new Euler(0, 0, 0),
      [state.pointer.y / 7, -state.pointer.x / 3, 0],
      0.25,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
