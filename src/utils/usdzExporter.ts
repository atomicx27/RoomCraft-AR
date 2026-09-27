import * as THREE from 'three';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js';
import { PlacedModelInstance } from '../types';
import { logger } from './logger';

// Helper to construct 3D meshes matching our procedural catalog items for USDZ export
function createMeshForModel(instance: PlacedModelInstance): THREE.Object3D {
  const group = new THREE.Group();
  group.position.set(instance.position[0], instance.position[1], instance.position[2]);
  group.rotation.set(instance.rotation[0], instance.rotation[1], instance.rotation[2]);
  group.scale.set(instance.scale[0], instance.scale[1], instance.scale[2]);

  const pbrColor = '#10b981';

  if (instance.modelKey.includes('plant') || instance.name.toLowerCase().includes('monstera')) {
    // Pot
    const potGeo = new THREE.CylinderGeometry(0.25, 0.2, 0.4, 32);
    const potMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.y = 0.2;
    group.add(pot);

    // Soil
    const soilGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.05, 32);
    const soilMat = new THREE.MeshStandardMaterial({ color: '#292524', roughness: 0.9 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = 0.38;
    group.add(soil);

    // Leaves
    const leafMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.3, metalness: 0.1 });
    for (let i = 0; i < 3; i++) {
      const leafGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i * Math.PI * 2) / 3;
      leaf.position.set(Math.sin(angle) * 0.15, 0.55 + i * 0.08, Math.cos(angle) * 0.15);
      group.add(leaf);
    }
  } else if (instance.modelKey.includes('chair') || instance.name.toLowerCase().includes('chair')) {
    // Seat
    const seatGeo = new THREE.BoxGeometry(0.6, 0.08, 0.6);
    const seatMat = new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.5 });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.y = 0.45;
    group.add(seat);

    // Backrest
    const backGeo = new THREE.BoxGeometry(0.6, 0.5, 0.08);
    const back = new THREE.Mesh(backGeo, seatMat);
    back.position.set(0, 0.7, -0.26);
    group.add(back);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8, roughness: 0.2 });
    const positions = [
      [-0.25, 0.225, -0.25],
      [0.25, 0.225, -0.25],
      [-0.25, 0.225, 0.25],
      [0.25, 0.225, 0.25],
    ];
    positions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      group.add(leg);
    });
  } else if (instance.modelKey.includes('lamp') || instance.name.toLowerCase().includes('lamp')) {
    // Base
    const baseGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.04, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.9, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.02;
    group.add(base);

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 16);
    const pole = new THREE.Mesh(poleGeo, baseMat);
    pole.position.y = 0.7;
    group.add(pole);

    // Shade
    const shadeGeo = new THREE.ConeGeometry(0.25, 0.35, 32, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.3 });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = 1.35;
    group.add(shade);
  } else {
    // Sculpture / Default kinetic item
    const coreGeo = new THREE.TorusKnotGeometry(0.25, 0.08, 64, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: pbrColor, metalness: 0.9, roughness: 0.1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.4;
    group.add(core);

    const pedestalGeo = new THREE.BoxGeometry(0.4, 0.1, 0.4);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.3 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.05;
    group.add(pedestal);
  }

  return group;
}

export async function exportRoomToUSDZ(placedModels: PlacedModelInstance[]): Promise<Uint8Array> {
  logger.info('WebXR', `Packaging ${placedModels.length} room models into unified iOS USDZ scene...`);

  const exportScene = new THREE.Scene();
  // Add lighting for QuickLook rendering
  const ambient = new THREE.AmbientLight(0xffffff, 1.0);
  exportScene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(5, 10, 7);
  exportScene.add(sun);

  // Add all placed models to export scene
  placedModels.forEach((instance) => {
    const meshGroup = createMeshForModel(instance);
    exportScene.add(meshGroup);
  });

  const exporter = new USDZExporter();
  const output = await exporter.parseAsync(exportScene);
  logger.info('WebXR', 'Successfully compiled USDZ binary room layout');
  return output;
}

export async function launchNativeQuickLookAR(placedModels: PlacedModelInstance[]): Promise<boolean> {
  if (placedModels.length === 0) {
    return false;
  }

  try {
    const usdzUint8Array = await exportRoomToUSDZ(placedModels);
    const blob = new Blob([new Uint8Array(usdzUint8Array)], { type: 'model/vnd.usdz+zip' });
    const blobUrl = URL.createObjectURL(blob);

    // Create QuickLook anchor element for iOS Safari
    const anchor = document.createElement('a');
    anchor.setAttribute('rel', 'ar');
    anchor.setAttribute('href', blobUrl);
    anchor.style.display = 'none';

    const img = document.createElement('img');
    img.src = '/favicon.svg';
    img.width = 1;
    img.height = 1;
    anchor.appendChild(img);

    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    }, 5000);

    return true;
  } catch (err: any) {
    logger.error('WebXR', 'Failed to launch Native iOS AR QuickLook', { error: err?.message || String(err) });
    return false;
  }
}
