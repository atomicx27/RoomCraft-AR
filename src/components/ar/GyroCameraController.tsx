import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRoomStore } from '../../store/useRoomStore';
import { logger } from '../../utils/logger';

export const GyroCameraController: React.FC = () => {
  const { camera } = useThree();
  const cameraOffset = useRoomStore((state) => state.cameraOffset);
  const targetQuaternionRef = useRef(new THREE.Quaternion());
  const isGyroActiveRef = useRef(false);

  // Canonical Three.js DeviceOrientation transformation vectors
  const zee = useRef(new THREE.Vector3(0, 0, 1)).current;
  const euler = useRef(new THREE.Euler()).current;
  const q0 = useRef(new THREE.Quaternion()).current;
  const q1 = useRef(new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5))).current;

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha === null || event.beta === null || event.gamma === null) return;

      if (!isGyroActiveRef.current) {
        isGyroActiveRef.current = true;
        logger.info('WebXR', 'DeviceOrientation motion sensors active with 3D camera transformation');
      }

      const alpha = event.alpha ? THREE.MathUtils.degToRad(event.alpha) : 0; // Z
      const beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0; // X'
      const gamma = event.gamma ? THREE.MathUtils.degToRad(event.gamma) : 0; // Y''
      const orient = window.orientation ? THREE.MathUtils.degToRad(window.orientation as number) : 0; // O

      // Canonical Three.js DeviceOrientation quaternion calculation
      euler.set(beta, alpha, -gamma, 'YXZ');
      targetQuaternionRef.current.setFromEuler(euler);
      targetQuaternionRef.current.multiply(q1);
      targetQuaternionRef.current.multiply(q0.setFromAxisAngle(zee, -orient));
    };

    const requestGyroPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        // @ts-ignore
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        try {
          // @ts-ignore
          const response = await DeviceOrientationEvent.requestPermission();
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
          }
        } catch (err) {
          logger.error('WebXR', 'Error requesting DeviceOrientation permission', { error: String(err) });
        }
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
      }
    };

    requestGyroPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  useFrame(() => {
    // Apply camera walking position offset [cx, cy, cz]
    const [cx, cy, cz] = cameraOffset;
    const targetPos = new THREE.Vector3(cx, 1.4 + cy, 2.0 + cz);
    camera.position.lerp(targetPos, 0.15);

    if (isGyroActiveRef.current) {
      // Smooth slerp (0.15) camera rotation
      camera.quaternion.slerp(targetQuaternionRef.current, 0.15);
    }
  });

  return null;
};
