"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

function FloatingShape() {
  const reducedMotion = usePrefersReducedMotion();
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;
    groupRef.current.rotation.y += reducedMotion ? 0 : delta * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.35;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={meshRef} scale={1.45}>
          <torusKnotGeometry args={[0.8, 0.25, 180, 24]} />
          <meshPhysicalMaterial
            color="#8c1233"
            emissive="#4d0617"
            emissiveIntensity={0.18}
            metalness={0.18}
            roughness={0.3}
            transparent
            opacity={0.45}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Particles() {
  const points = useMemo(() => {
    const count = 1300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return positions;
  }, []);

  return (
    <Points positions={points} stride={3} frustumCulled={false}>
      <PointMaterial transparent size={0.015} sizeAttenuation depthWrite={false} color="#c98b38" opacity={0.45} />
    </Points>
  );
}

export function ParticleHero() {
  const reducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleVisibility = () => setPaused(document.visibilityState !== "visible");
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  if (!mounted || reducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-80" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={Math.min(window.devicePixelRatio || 1, 1.6)}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 2, 4]} intensity={0.9} color="#c98b38" />
        <directionalLight position={[-3, -1, 2]} intensity={0.4} color="#8c1233" />
        <group scale={0.95}>
          {!paused && <FloatingShape />}
          <Particles />
        </group>
      </Canvas>
    </div>
  );
}
