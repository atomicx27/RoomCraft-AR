import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRoomStore } from '../../store/useRoomStore';
import { Reticle } from './Reticle';
import { ShadowCatcher } from './ShadowCatcher';
import { PlacedModel } from './PlacedModel';
import { CameraFeed } from './CameraFeed';
import { GyroCameraController } from './GyroCameraController';
import { logger } from '../../utils/logger';

// Inner Scene controller for hit testing & raycast targeting
const SceneController: React.FC = () => {
  const { camera, raycaster } = useThree();
  const {
    setReticlePose,
    setTrackingStatus,
    placedModels,
    selectedModelId,
    updateModelTransform,
    isSnappingEnabled,
    isCatalogOpen,
  } = useRoomStore();

  const isDraggingRef = useRef(false);

  useFrame(() => {
    // ONLY update reticle target position if catalog is open or when searching for placement
    if (placedModels.length === 0 || isCatalogOpen) {
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const targetPoint = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(groundPlane, targetPoint)) {
        setReticlePose([targetPoint.x, 0, targetPoint.z], [0, 0, 0], true);
        setTrackingStatus('stable');
      } else {
        setTrackingStatus('searching');
      }
    } else {
      setReticlePose([0, 0, 0], [0, 0, 0], false);
      setTrackingStatus('stable');
    }
  });

  return null;
};

// Common 3D Scene Elements
const SceneElements: React.FC = () => {
  const placedModels = useRoomStore((state) => state.placedModels);
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#0f172a" />

      {/* Gyroscope Motion Camera Controller */}
      <GyroCameraController />

      {/* Scene Controllers */}
      <SceneController />
      <Reticle />
      <ShadowCatcher />

      {/* Render All Placed Models at Locked World Coordinates */}
      {placedModels.map((instance) => (
        <PlacedModel key={instance.id} instance={instance} />
      ))}
    </>
  );
};

export const ARCanvas: React.FC = () => {
  const selectModel = useRoomStore((state) => state.selectModel);
  const showToast = useRoomStore((state) => state.showToast);
  const [hasWebXR, setHasWebXR] = useState(false);

  useEffect(() => {
    logger.info('WebXR', 'Initialized WebAR 3D Canvas Viewport');
    if (typeof navigator !== 'undefined' && 'xr' in navigator && navigator.xr) {
      setHasWebXR(true);
    }
  }, []);

  const handleStartNativeWebXR = async () => {
    logger.info('WebXR', 'User requested native WebXR session check...');
    showToast('Gyroscope & WebAR Camera Anchoring is Active!');
  };

  return (
    <div
      className="w-full h-full relative touch-none select-none overflow-hidden"
      onClick={() => selectModel(null)}
    >
      {/* WebAR Status Button */}
      {hasWebXR && (
        <div className="absolute top-16 right-4 z-40 pointer-events-auto">
          <button
            onClick={handleStartNativeWebXR}
            className="px-3 py-1 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl shadow-lg border border-emerald-400/40 transition-all flex items-center space-x-1.5 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>WebAR Active</span>
          </button>
        </div>
      )}

      {/* Live Camera Video Stream Background */}
      <CameraFeed />

      {/* Transparent Three.js WebGL Canvas Overlay */}
      <Canvas
        shadows
        camera={{ position: [0, 1.4, 2.0], fov: 60 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        className="w-full h-full absolute inset-0 z-10 bg-transparent"
      >
        <SceneElements />
      </Canvas>
    </div>
  );
};
