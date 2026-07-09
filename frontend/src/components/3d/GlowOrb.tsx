"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface GlowOrbProps {
  position?: [number, number, number];
  color?: string;
  scale?: number;
  distort?: number;
  speed?: number;
}

export default function GlowOrb({
  position = [2.5, 0.5, -2],
  color = "var(--teal)",
  scale = 1.2,
  distort = 0.4,
  speed = 2,
}: GlowOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.z = t * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={speed}
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  );
}

