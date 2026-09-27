import React from 'react';
import * as THREE from 'three';

export const ShadowCatcher: React.FC = () => {
  return (
    <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial opacity={0.35} color="#0f172a" />
    </mesh>
  );
};
