"use client";

import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface GridFloorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

export default function GridFloor({
  position = [0, -2, 0],
  rotation = [0, 0, 0],
  color = "var(--teal)",
}: GridFloorProps) {
  const gridRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!gridRef.current) return;
    // Slow scrolling effect
    gridRef.current.position.z = (gridRef.current.position.z + delta * 0.5) % 1;
  });

  return (
    <group ref={gridRef} position={position} rotation={rotation}>
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={color}
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor={color}
        fadeDistance={15}
        fadeStrength={1}
        infiniteGrid
      />
    </group>
  );
}

