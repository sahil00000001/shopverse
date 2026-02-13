"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

// Floating shape with varied geometry
function FloatingShape({
  position,
  color,
  speed,
  size = 1,
  geometry = "sphere"
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  size?: number;
  geometry?: "sphere" | "box" | "octahedron" | "icosahedron";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * speed) * 0.4;
    meshRef.current.rotation.y = Math.cos(time * speed * 0.7) * 0.4;
    meshRef.current.position.y = position[1] + Math.sin(time * speed * 0.5) * 0.8;
  });

  const GeometryComponent = () => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[size * 1.5, size * 1.5, size * 1.5, 16, 16, 16]} />;
      case "octahedron":
        return <octahedronGeometry args={[size, 1]} />;
      case "icosahedron":
        return <icosahedronGeometry args={[size, 0]} />;
      default:
        return <sphereGeometry args={[size, 32, 32]} />;
    }
  };

  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} castShadow>
        <GeometryComponent />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.6}
          speed={2.5}
          roughness={0.0}
          metalness={1.0}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Rotating Torus Knot for more interesting geometry
function RotatingTorusKnot({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.4;
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.z = time * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusKnotGeometry args={[1.2, 0.3, 64, 16]} />
      <meshStandardMaterial
        color="#8b5cf6"
        metalness={1.0}
        roughness={0.0}
        emissive="#a855f7"
        emissiveIntensity={1.0}
      />
    </mesh>
  );
}

// Enhanced particle field with more particles
function ParticleField({ isDark }: { isDark: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 25;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();
    particlesRef.current.rotation.y = time * 0.08;
    particlesRef.current.rotation.x = Math.sin(time * 0.15) * 0.15;
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.12}
        color={isDark ? "#c084fc" : "#8b5cf6"}
        transparent
        opacity={isDark ? 1.0 : 0.9}
        sizeAttenuation
      />
    </points>
  );
}

// Theme-aware scene
function Scene({ isDark }: { isDark: boolean }) {
  // Different colors and configurations for light and dark themes
  const lightThemeShapes = [
    { position: [-4, 0, -5] as [number, number, number], color: "#6366f1", size: 1.2, speed: 0.5, geometry: "sphere" as const },
    { position: [4, -2, -3] as [number, number, number], color: "#8b5cf6", size: 1.5, speed: 0.7, geometry: "box" as const },
    { position: [0, 3, -6] as [number, number, number], color: "#a855f7", size: 1.0, speed: 0.6, geometry: "octahedron" as const },
    { position: [-6, -1, -4] as [number, number, number], color: "#c026d3", size: 1.3, speed: 0.8, geometry: "icosahedron" as const },
    { position: [6, 2, -7] as [number, number, number], color: "#e879f9", size: 1.1, speed: 0.4, geometry: "sphere" as const },
    { position: [-2, -3, -5] as [number, number, number], color: "#d946ef", size: 0.9, speed: 0.6, geometry: "box" as const },
    { position: [3, 1, -4] as [number, number, number], color: "#7c3aed", size: 1.4, speed: 0.5, geometry: "octahedron" as const },
  ];

  const darkThemeShapes = [
    { position: [-4, 0, -4] as [number, number, number], color: "#8b5cf6", size: 1.3, speed: 0.5, geometry: "sphere" as const },
    { position: [4, -2, -3] as [number, number, number], color: "#a855f7", size: 1.6, speed: 0.7, geometry: "box" as const },
    { position: [0, 3, -5] as [number, number, number], color: "#c084fc", size: 1.1, speed: 0.6, geometry: "octahedron" as const },
    { position: [-6, -1, -3] as [number, number, number], color: "#d946ef", size: 1.4, speed: 0.8, geometry: "icosahedron" as const },
    { position: [6, 2, -6] as [number, number, number], color: "#f0abfc", size: 1.2, speed: 0.4, geometry: "sphere" as const },
    { position: [-2, -3, -4] as [number, number, number], color: "#e879f9", size: 1.0, speed: 0.6, geometry: "box" as const },
    { position: [3, 1, -3] as [number, number, number], color: "#9333ea", size: 1.5, speed: 0.5, geometry: "octahedron" as const },
  ];

  const shapes = isDark ? darkThemeShapes : lightThemeShapes;

  return (
    <>
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={isDark ? 1.5 : 1.2} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 3 : 2.5} color={isDark ? "#a855f7" : "#ffffff"} />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 2.5 : 2} color="#8b5cf6" />
      <pointLight position={[0, 10, 5]} intensity={isDark ? 2 : 1.5} color="#6366f1" />
      <pointLight position={[5, -5, 0]} intensity={isDark ? 2 : 1.5} color="#c026d3" />

      {/* Multiple varied shapes */}
      {shapes.map((shape, i) => (
        <FloatingShape
          key={i}
          position={shape.position}
          color={shape.color}
          size={shape.size}
          speed={shape.speed}
          geometry={shape.geometry}
        />
      ))}

      {/* Rotating Torus Knot */}
      <RotatingTorusKnot position={[0, 0, -7]} />

      {/* Enhanced Particle Field */}
      <ParticleField isDark={isDark} />
    </>
  );
}

export function HeroBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        className={isDark ? "opacity-90" : "opacity-85"}
      >
        <Scene isDark={isDark} />
      </Canvas>

      {/* Lighter gradient overlay for better visibility */}
      <div className={isDark
        ? "absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/70"
        : "absolute inset-0 bg-gradient-to-b from-transparent via-background/25 to-background/75"
      } />
    </div>
  );
}
