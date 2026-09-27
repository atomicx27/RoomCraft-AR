import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRoomStore } from '../../store/useRoomStore';

export const Reticle: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { reticlePosition, reticleRotation, isReticleVisible, trackingStatus } = useRoomStore();

  useFrame(() => {
    if (meshRef.current) {
      // Linear Interpolation (lerp factor = 0.15) for smooth reticle gliding
      meshRef.current.position.lerp(new THREE.Vector3(...reticlePosition), 0.15);
      meshRef.current.rotation.set(...reticleRotation);
    }
  });

  if (!isReticleVisible) return null;

  const ringColor = trackingStatus === 'stable' ? '#10b981' : '#f59e0b'; // Emerald if locked, Amber if searching

  return (
    <group ref={meshRef} position={reticlePosition} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Targeted Ring */}
      <mesh receiveShadow>
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      {/* Inner Center Dot */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.03, 32]} />
        <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};
