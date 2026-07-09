"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface FloatingLogoProps {
  scale?: number;
  position?: [number, number, number];
}

export default function FloatingLogo({ scale = 2.5, position = [0, 0.5, 0] }: FloatingLogoProps) {
  const outerMeshRef = useRef<THREE.Mesh>(null!);
  const innerMeshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    
    if (outerMeshRef.current) {
      // Rotation animation
      outerMeshRef.current.rotation.y = elapsed * 0.45;
      outerMeshRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.3;
    }
    
    if (innerMeshRef.current) {
      // Opposite rotation for the core
      innerMeshRef.current.rotation.y = -elapsed * 0.75;
      innerMeshRef.current.rotation.x = Math.cos(elapsed * 0.3) * 0.4;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.8} floatIntensity={1.2}>
      <group position={position} scale={scale}>
        {/* Outer glass crystal (Burgundy tint) */}
        <mesh ref={outerMeshRef}>
          <octahedronGeometry args={[0.7, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.45}
            roughness={0.08}
            transmission={0.95}
            ior={1.6}
            chromaticAberration={0.06}
            anisotropy={0.2}
            distortion={0.15}
            distortionScale={0.25}
            temporalDistortion={0.05}
            color="var(--accent-dark)"
          />
        </mesh>
        
        {/* Inner glowing core crystal (Warm Red) */}
        <mesh ref={innerMeshRef}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshBasicMaterial color="#FCA5A5" wireframe transparent opacity={0.85} />
        </mesh>
      </group>
    </Float>
  );
}

