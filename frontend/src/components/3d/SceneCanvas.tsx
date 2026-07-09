"use client";

import React, { Suspense, useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  public state = { hasError: false };

  public static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Canvas error caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(109,0,26,0.08) 0%, transparent 70%), #0A0A0B",
          pointerEvents: "none",
        }} />
      );
    }
    return this.props.children;
  }
}

interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  cameraPosition?: [number, number, number];
}

export default function SceneCanvas({
  children,
  className,
  style,
  cameraPosition = [0, 0, 5],
}: SceneCanvasProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebglSupported(support);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(109,0,26,0.08) 0%, transparent 70%), #0A0A0B",
          pointerEvents: "none",
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      <CanvasErrorBoundary>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: cameraPosition, fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ pointerEvents: "auto" }}
        >
          <Suspense fallback={null}>
            {children}
            <Preload all />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
