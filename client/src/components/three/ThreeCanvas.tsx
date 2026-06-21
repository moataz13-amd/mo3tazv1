import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// PARTICLE FIELD
// ============================================
function ParticleField() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.03;
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00BFFF"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// ============================================
// FLOATING ORB
// ============================================
function FloatingOrb({ position, color, scale = 1 }: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.15}
          wireframe={false}
        />
      </mesh>
      <pointLight position={position} color={color} intensity={2} distance={6} />
    </Float>
  );
}

// ============================================
// GEOMETRIC SHAPE
// ============================================
function GeometricShape({ position, color }: {
  position: [number, number, number];
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// ============================================
// MOUSE REACTIVE CAMERA
// ============================================
function CameraController() {
  const { camera } = useThree();

  useFrame((state) => {
    const x = state.mouse.x * 0.3;
    const y = state.mouse.y * 0.2;
    camera.position.x += (x - camera.position.x) * 0.05;
    camera.position.y += (y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ============================================
// GRID LINES
// ============================================
function GridLines() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  const lines = useMemo(() => {
    const arr = [];
    for (let i = -10; i <= 10; i += 2) {
      arr.push(i);
    }
    return arr;
  }, []);

  return (
    <group ref={ref} position={[0, -5, 0]} rotation={[0, 0, 0]}>
      {lines.map((x) => (
        <line key={`v-${x}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([x, 0, -10, x, 0, 10]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00BFFF" opacity={0.08} transparent />
        </line>
      ))}
      {lines.map((z) => (
        <line key={`h-${z}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-10, 0, z, 10, 0, z]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#4F46E5" opacity={0.08} transparent />
        </line>
      ))}
    </group>
  );
}

// ============================================
// MAIN CANVAS COMPONENT
// ============================================
export default function ThreeCanvas() {
  return (
    <div
      id="three-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} color="#00BFFF" intensity={0.5} />
        <pointLight position={[-10, -10, -5]} color="#4F46E5" intensity={0.3} />

        <CameraController />
        <ParticleField />
        <GridLines />

        {/* Floating Orbs */}
        <FloatingOrb position={[-5, 3, -3]} color="#00BFFF" scale={1.5} />
        <FloatingOrb position={[5, -2, -4]} color="#4F46E5" scale={1.2} />
        <FloatingOrb position={[0, 4, -6]} color="#06B6D4" scale={0.8} />
        <FloatingOrb position={[-3, -4, -2]} color="#7C3AED" scale={1} />

        {/* Geometric shapes */}
        <GeometricShape position={[4, 2, -2]} color="#00BFFF" />
        <GeometricShape position={[-4, -1, -3]} color="#4F46E5" />
        <GeometricShape position={[2, -3, -5]} color="#06B6D4" />
        <GeometricShape position={[-2, 3, -4]} color="#7C3AED" />
      </Canvas>
    </div>
  );
}
