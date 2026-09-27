import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelProps {
  isInteractiveOn?: boolean;
}

// 1. Static Decor Model: Aesthetic Potted Monstera Plant
export const StaticDecorModel: React.FC<ModelProps> = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Ceramic Pot Base */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.3, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Pot Soil */}
      <mesh position={[0, 0.29, 0]} receiveShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 32]} />
        <meshStandardMaterial color="#331800" roughness={0.9} />
      </mesh>
      {/* Plant Stems & Foliage Leaves */}
      {[0, 72, 144, 216, 288].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.12;
        const z = Math.sin(rad) * 0.12;
        return (
          <group key={idx} position={[x, 0.3, z]} rotation={[0.2, rad, 0.3]}>
            {/* Leaf Stem */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.015, 0.3, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.4} />
            </mesh>
            {/* Leaf Blade */}
            <mesh position={[0, 0.3, 0.05]} rotation={[0.5, 0, 0]} castShadow>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#16a34a" roughness={0.3} metalness={0.1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// 2. Animated Model: Kinetic Motion Sculpture
export const AnimatedKineticModel: React.FC<ModelProps> = () => {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerCubeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * 0.8;
      outerRingRef.current.rotation.x += delta * 0.4;
    }
    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.y -= delta * 1.5;
      innerCubeRef.current.rotation.z += delta * 1.0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Metallic Pedestal Base */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.16, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Rotating Outer Kinetic Ring */}
      <group ref={outerRingRef} position={[0, 0.45, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.25, 0.025, 16, 64]} />
          <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>
      {/* Rotating Inner Glowing Core */}
      <mesh ref={innerCubeRef} position={[0, 0.45, 0]} castShadow>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color="#c084fc" roughness={0.2} metalness={0.8} emissive="#7e22ce" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
};

// 3. Interactive Object: Tap-to-Toggle illuminated Desk Lamp
export const InteractiveLampModel: React.FC<ModelProps> = ({ isInteractiveOn = true }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Lamp Base */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.16, 0.06, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Curved Arm */}
      <mesh position={[0, 0.25, -0.05]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 16]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Lamp Shade Dome */}
      <mesh position={[0, 0.45, 0.08]} rotation={[-0.3, 0, 0]} castShadow>
        <coneGeometry args={[0.14, 0.15, 32, 1, true]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Glowing Light Bulb Element */}
      <mesh position={[0, 0.42, 0.08]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={isInteractiveOn ? '#fef08a' : '#475569'}
          emissive={isInteractiveOn ? '#f59e0b' : '#000000'}
          emissiveIntensity={isInteractiveOn ? 2.5 : 0}
        />
      </mesh>
      {/* Cast Dynamic Spotlight Illumination onto Surface */}
      {isInteractiveOn && (
        <spotLight
          position={[0, 0.42, 0.08]}
          target-position={[0, 0, 0.2]}
          angle={Math.PI / 4}
          penumbra={0.5}
          intensity={3.5}
          color="#fef08a"
          castShadow
        />
      )}
    </group>
  );
};

// 4. Designer Armchair Model
export const DesignerChairModel: React.FC<ModelProps> = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Seat Cushion */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.1, 0.45]} />
        <meshStandardMaterial color="#0284c7" roughness={0.6} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.5, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.4, 0.08]} />
        <meshStandardMaterial color="#0369a1" roughness={0.6} />
      </mesh>
      {/* Wooden Legs */}
      {[-0.18, 0.18].map((x) =>
        [-0.18, 0.18].map((z) => (
          <mesh key={`${x}_${z}`} position={[x, 0.1, z]} rotation={[x * 0.5, 0, z * -0.5]} castShadow>
            <cylinderGeometry args={[0.015, 0.01, 0.22, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        ))
      )}
    </group>
  );
};
