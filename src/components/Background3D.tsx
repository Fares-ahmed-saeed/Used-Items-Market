
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars({ count = 5000 }) {
  const points = useRef<THREE.Points>(null);
  
  // Generate random star positions
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
    }
    return positions;
  }, [count]);
  
  // Generate random star sizes
  const sizes = useMemo(() => {
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizes[i] = Math.random() * 0.5 + 0.1; // size between 0.1 and 0.6
    }
    return sizes;
  }, [count]);
  
  // Create color array for stars with vibrant colors matching our theme
  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const starColors = [
      new THREE.Color(0xda9dff), // Purple
      new THREE.Color(0xffffff), // White
      new THREE.Color(0xffb3ff), // Pink
      new THREE.Color(0xff88ee), // Bright Pink
      new THREE.Color(0xc088ff), // Bright Purple
      new THREE.Color(0xa4a4ff), // Light Blue
    ];
    
    for (let i = 0; i < count; i++) {
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      color.toArray(colors, i * 3);
    }
    return colors;
  }, [count]);
  
  useFrame((state) => {
    if (!points.current) return;
    
    // Slow rotation to create a gentle drift effect
    points.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.05) * 0.02;
    points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    
    // Subtle pulsating effect for stars
    const sizes = points.current.geometry.attributes.size;
    for (let i = 0; i < count; i++) {
      sizes.array[i] = Math.abs(Math.sin(i + state.clock.elapsedTime)) * 0.3 + 0.3;
    }
    sizes.needsUpdate = true;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        alphaMap={new THREE.TextureLoader().load('/star.png')}
        alphaTest={0.01}
      />
    </points>
  );
}

function GalacticNebula() {
  const nebula = useRef<THREE.Mesh>(null);
  const nebula2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!nebula.current || !nebula2.current) return;
    nebula.current.rotation.z += 0.0005;
    nebula.current.rotation.y += 0.0002;
    
    nebula2.current.rotation.z -= 0.0003;
    nebula2.current.rotation.x += 0.0001;
  });
  
  // Nebula texture with colors that match our theme
  const texture1 = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient with more vibrant colors
    const gradient = ctx.createRadialGradient(
      64, 64, 0, 64, 64, 64
    );
    
    gradient.addColorStop(0, 'rgba(220, 100, 255, 0.5)');
    gradient.addColorStop(0.4, 'rgba(180, 90, 240, 0.3)');
    gradient.addColorStop(0.8, 'rgba(140, 120, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(100, 80, 200, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  // Second nebula texture with complementary colors
  const texture2 = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient with complementary colors
    const gradient = ctx.createRadialGradient(
      64, 64, 0, 64, 64, 64
    );
    
    gradient.addColorStop(0, 'rgba(255, 120, 220, 0.4)');
    gradient.addColorStop(0.4, 'rgba(240, 100, 200, 0.25)');
    gradient.addColorStop(0.8, 'rgba(200, 80, 180, 0.15)');
    gradient.addColorStop(1, 'rgba(150, 60, 150, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  return (
    <>
      <mesh ref={nebula} position={[0, 0, -20]} rotation={[Math.PI / 6, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={texture1} transparent={true} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={nebula2} position={[-15, -5, -25]} rotation={[Math.PI / 4, Math.PI / 8, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial map={texture2} transparent={true} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Stars count={3000} />
        <GalacticNebula />
      </Canvas>
    </div>
  );
}
