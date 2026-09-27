import React, { useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { PlacedModelInstance } from '../../types';
import { useRoomStore } from '../../store/useRoomStore';
import {
  StaticDecorModel,
  AnimatedKineticModel,
  InteractiveLampModel,
  DesignerChairModel,
} from './ProceduralModels';

interface PlacedModelProps {
  instance: PlacedModelInstance;
}

export const PlacedModel: React.FC<PlacedModelProps> = ({ instance }) => {
  const { selectedModelId, selectModel, updateModelTransform } = useRoomStore();
  const groupRef = useRef<THREE.Group>(null);
  const isSelected = selectedModelId === instance.id;

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    selectModel(instance.id);
  };

  // Render appropriate 3D model component based on modelKey
  const renderModelGeometry = () => {
    switch (instance.modelKey) {
      case 'plant_potted':
        return <StaticDecorModel />;
      case 'kinetic_art':
        return <AnimatedKineticModel />;
      case 'ambient_lamp':
        return <InteractiveLampModel isInteractiveOn={instance.isInteractiveOn} />;
      case 'designer_chair':
        return <DesignerChairModel />;
      default:
        return <StaticDecorModel />;
    }
  };

  return (
    <group
      ref={groupRef}
      position={instance.position}
      rotation={instance.rotation}
      scale={instance.scale}
      onPointerDown={handlePointerDown}
    >
      {renderModelGeometry()}

      {/* Selected Bounding Highlight Ring */}
      {isSelected && (
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.3, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};
