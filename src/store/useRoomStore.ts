import { create } from 'zustand';
import {
  ModelCatalogItem,
  PlacedModelInstance,
  SavedRoomLayout,
  TrackingMode,
  TrackingStatus,
} from '../types';
import { logger } from '../utils/logger';
import { saveRoomLayout, loadRoomLayout } from '../utils/storage';

// Starter Catalog items
export const STARTER_CATALOG: ModelCatalogItem[] = [
  {
    id: 'plant_potted',
    name: 'Aesthetic Potted Monstera',
    category: 'static',
    description: 'Clean modern ceramic pot with lush monstera foliage.',
    previewColor: '#10b981',
    iconName: 'Flower2',
  },
  {
    id: 'kinetic_art',
    name: 'Kinetic Motion Sculpture',
    category: 'animated',
    description: 'Continuous smooth rotating geometric art sculpture.',
    previewColor: '#8b5cf6',
    iconName: 'Activity',
  },
  {
    id: 'ambient_lamp',
    name: 'Interactive Desk Lamp',
    category: 'interactive',
    description: 'Tap to toggle soft warm ambient lighting on and off.',
    previewColor: '#f59e0b',
    iconName: 'Lamp',
  },
  {
    id: 'designer_chair',
    name: 'Modern Lounge Armchair',
    category: 'static',
    description: 'Ergonomic Scandinavian minimalist armchair.',
    previewColor: '#0284c7',
    iconName: 'Armchair',
  },
];

interface RoomState {
  // Navigation & View
  currentView: 'dashboard' | 'calibration' | 'ar';
  activeRoomId: string;
  activeRoomName: string;
  trackingMode: TrackingMode;
  trackingStatus: TrackingStatus;

  // AR Reticle & World Pose
  reticlePosition: [number, number, number];
  reticleRotation: [number, number, number];
  isReticleVisible: boolean;
  gyroPermissionGranted: boolean;

  // Virtual Camera Position Offset (6DoF Walk simulation)
  cameraOffset: [number, number, number]; // [x, y, z]

  // Scene Objects
  placedModels: PlacedModelInstance[];
  selectedModelId: string | null;
  isSnappingEnabled: boolean;

  // UI Drawers & Modals
  isCatalogOpen: boolean;
  isSceneListOpen: boolean;
  isQRScannerOpen: boolean;
  isDebugOverlayOpen: boolean;
  toastMessage: string | null;

  // Actions
  setCurrentView: (view: 'dashboard' | 'calibration' | 'ar') => void;
  setTrackingMode: (mode: TrackingMode) => void;
  setTrackingStatus: (status: TrackingStatus) => void;
  setReticlePose: (position: [number, number, number], rotation: [number, number, number], visible: boolean) => void;
  setGyroPermissionGranted: (granted: boolean) => void;
  requestGyroPermission: () => Promise<boolean>;
  
  // Camera Walk Controls
  moveCameraDistance: (deltaZ: number) => void;
  moveCameraStrafe: (deltaX: number) => void;
  resetCameraOffset: () => void;

  // Model Operations
  spawnModel: (catalogItemId: string) => void;
  updateModelTransform: (
    id: string,
    position?: [number, number, number],
    rotation?: [number, number, number],
    scale?: [number, number, number]
  ) => void;
  rotateSelectedModel: (deltaAngleRad: number) => void;
  scaleSelectedModel: (scaleFactorDelta: number) => void;
  moveSelectedModel: (dx: number, dz: number) => void;
  toggleModelLock: (id: string) => void;
  toggleModelInteractive: (id: string) => void;
  deleteModel: (id: string) => void;
  selectModel: (id: string | null) => void;
  toggleSnapping: () => void;

  // UI Drawers
  setCatalogOpen: (open: boolean) => void;
  setSceneListOpen: (open: boolean) => void;
  setQRScannerOpen: (open: boolean) => void;
  setDebugOverlayOpen: (open: boolean) => void;
  showToast: (message: string) => void;

  // Storage
  saveCurrentRoom: () => Promise<boolean>;
  loadRoom: (roomId: string) => Promise<boolean>;
  createNewRoom: (name: string, mode: TrackingMode) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  currentView: 'dashboard',
  activeRoomId: 'room_desk_1',
  activeRoomName: 'My Work Desk Setup',
  trackingMode: 'freeform',
  trackingStatus: 'searching',

  reticlePosition: [0, 0, -1.5],
  reticleRotation: [0, 0, 0],
  isReticleVisible: false,
  gyroPermissionGranted: false,

  cameraOffset: [0, 0, 0], // Camera walking offset

  placedModels: [],
  selectedModelId: null,
  isSnappingEnabled: true,

  isCatalogOpen: false,
  isSceneListOpen: false,
  isQRScannerOpen: false,
  isDebugOverlayOpen: false,
  toastMessage: null,

  setCurrentView: (view) => {
    logger.info('System', `Navigation view changed to: ${view}`);
    set({ currentView: view });
  },

  setTrackingMode: (mode) => {
    logger.info('WebXR', `Tracking mode set to: ${mode}`);
    set({ trackingMode: mode });
  },

  setTrackingStatus: (status) => {
    const prev = get().trackingStatus;
    if (prev !== status) {
      logger.info('HitTest', `Tracking status updated: ${prev} -> ${status}`);
      set({ trackingStatus: status });
    }
  },

  setReticlePose: (position, rotation, visible) => {
    set({
      reticlePosition: position,
      reticleRotation: rotation,
      isReticleVisible: visible,
    });
  },

  setGyroPermissionGranted: (granted) => set({ gyroPermissionGranted: granted }),

  requestGyroPermission: async () => {
    logger.info('WebXR', 'Requesting Gyroscope & Motion orientation sensor permissions...');
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-ignore
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        // @ts-ignore
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          set({ gyroPermissionGranted: true });
          logger.info('WebXR', 'Gyroscope orientation permission GRANTED by iOS Safari user tap');
          get().showToast('Gyroscope Room Anchoring Enabled');
          return true;
        } else {
          logger.warn('WebXR', 'Gyroscope orientation permission DENIED on iOS Safari');
          get().showToast('Gyro Permission Denied');
          return false;
        }
      } catch (err) {
        logger.error('WebXR', 'Error requesting DeviceOrientation permission', { error: String(err) });
        return false;
      }
    } else {
      set({ gyroPermissionGranted: true });
      logger.info('WebXR', 'Gyroscope orientation active (standard browser)');
      return true;
    }
  },

  moveCameraDistance: (deltaZ) => {
    const [cx, cy, cz] = get().cameraOffset;
    const newZ = Math.min(Math.max(cz + deltaZ, -5.0), 5.0);
    set({ cameraOffset: [cx, cy, newZ] });
    logger.debug('Gesture', `Walk camera distance z: ${newZ.toFixed(2)}`);
  },

  moveCameraStrafe: (deltaX) => {
    const [cx, cy, cz] = get().cameraOffset;
    const newX = Math.min(Math.max(cx + deltaX, -5.0), 5.0);
    set({ cameraOffset: [newX, cy, cz] });
  },

  resetCameraOffset: () => {
    set({ cameraOffset: [0, 0, 0] });
    get().showToast('Camera position reset');
  },

  spawnModel: (catalogItemId) => {
    const catalogItem = STARTER_CATALOG.find((item) => item.id === catalogItemId);
    if (!catalogItem) {
      logger.error('AssetLoader', `Unknown catalog item ID: ${catalogItemId}`);
      return;
    }

    const state = get();
    if (state.placedModels.length >= 15) {
      logger.warn('Memory', 'Maximum scene capacity of 15 items reached');
      state.showToast('Maximum 15 items reached for mobile performance');
      return;
    }

    // Default spawn at reticle position or 1.5m in front of camera
    const spawnPos: [number, number, number] = state.isReticleVisible
      ? [...state.reticlePosition]
      : [0, 0, -1.5];

    if (state.isSnappingEnabled) {
      spawnPos[1] = 0;
    }

    const newInstance: PlacedModelInstance = {
      id: 'inst_' + Math.random().toString(36).substring(2, 9),
      modelKey: catalogItem.id,
      name: catalogItem.name,
      category: catalogItem.category,
      position: spawnPos,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      isLocked: false,
      isInteractiveOn: catalogItem.category === 'interactive' ? true : undefined,
    };

    set((s) => ({
      placedModels: [...s.placedModels, newInstance],
      selectedModelId: newInstance.id,
      isCatalogOpen: false,
    }));

    logger.info('System', `Spawned 3D object "${newInstance.name}" [${newInstance.id}]`, {
      modelKey: newInstance.modelKey,
      position: spawnPos,
    });
    state.showToast(`Summoned ${newInstance.name}`);
  },

  updateModelTransform: (id, position, rotation, scale) => {
    set((state) => ({
      placedModels: state.placedModels.map((item) => {
        if (item.id !== id || item.isLocked) return item;
        return {
          ...item,
          position: position ? position : item.position,
          rotation: rotation ? rotation : item.rotation,
          scale: scale ? scale : item.scale,
        };
      }),
    }));
  },

  rotateSelectedModel: (deltaAngleRad) => {
    const selectedId = get().selectedModelId;
    if (!selectedId) return;
    set((state) => ({
      placedModels: state.placedModels.map((item) => {
        if (item.id !== selectedId || item.isLocked) return item;
        const [rx, ry, rz] = item.rotation;
        return { ...item, rotation: [rx, ry + deltaAngleRad, rz] };
      }),
    }));
  },

  scaleSelectedModel: (scaleFactorDelta) => {
    const selectedId = get().selectedModelId;
    if (!selectedId) return;
    set((state) => ({
      placedModels: state.placedModels.map((item) => {
        if (item.id !== selectedId || item.isLocked) return item;
        const currentS = item.scale[0];
        const newS = Math.min(Math.max(currentS + scaleFactorDelta, 0.2), 3.0);
        return { ...item, scale: [newS, newS, newS] };
      }),
    }));
  },

  moveSelectedModel: (dx, dz) => {
    const selectedId = get().selectedModelId;
    if (!selectedId) return;
    set((state) => ({
      placedModels: state.placedModels.map((item) => {
        if (item.id !== selectedId || item.isLocked) return item;
        const [px, py, pz] = item.position;
        return { ...item, position: [px + dx, py, pz + dz] };
      }),
    }));
  },

  toggleModelLock: (id) => {
    set((state) => ({
      placedModels: state.placedModels.map((item) => {
        if (item.id !== id) return item;
        const newLock = !item.isLocked;
        logger.info('Gesture', `Model [${id}] lock state set to: ${newLock}`);
        return { ...item, isLocked: newLock };
      }),
    }));
  },

  toggleModelInteractive: (id) => {
    set((state) => ({
      placedModels: state.placedModels.map((item) => {
        if (item.id !== id || item.category !== 'interactive') return item;
        const newInteractiveState = !item.isInteractiveOn;
        logger.info('System', `Model [${id}] interactive state toggled to: ${newInteractiveState}`);
        return { ...item, isInteractiveOn: newInteractiveState };
      }),
    }));
  },

  deleteModel: (id) => {
    const itemToDelete = get().placedModels.find((m) => m.id === id);
    set((state) => ({
      placedModels: state.placedModels.filter((m) => m.id !== id),
      selectedModelId: state.selectedModelId === id ? null : state.selectedModelId,
    }));
    if (itemToDelete) {
      logger.info('Memory', `Deleted model instance [${id}] "${itemToDelete.name}"`);
    }
  },

  selectModel: (id) => {
    set({ selectedModelId: id });
    if (id) {
      logger.debug('Gesture', `Selected model instance: ${id}`);
    }
  },

  toggleSnapping: () => {
    const next = !get().isSnappingEnabled;
    set({ isSnappingEnabled: next });
    logger.info('Gesture', `Surface snapping toggled: ${next ? 'ON' : 'OFF'}`);
    get().showToast(`Surface Snapping ${next ? 'ON' : 'OFF'}`);
  },

  setCatalogOpen: (open) => set({ isCatalogOpen: open }),
  setSceneListOpen: (open) => set({ isSceneListOpen: open }),
  setQRScannerOpen: (open) => set({ isQRScannerOpen: open }),
  setDebugOverlayOpen: (open) => set({ isDebugOverlayOpen: open }),

  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => {
      if (get().toastMessage === message) {
        set({ toastMessage: null });
      }
    }, 2500);
  },

  saveCurrentRoom: async () => {
    const { activeRoomId, activeRoomName, trackingMode, placedModels, showToast } = get();
    const layout: SavedRoomLayout = {
      id: activeRoomId,
      name: activeRoomName,
      updatedAt: new Date().toISOString(),
      trackingMode,
      objects: placedModels,
    };
    const success = await saveRoomLayout(layout);
    if (success) {
      showToast('Room layout saved successfully!');
    } else {
      showToast('Failed to save room layout.');
    }
    return success;
  },

  loadRoom: async (roomId) => {
    const layout = await loadRoomLayout(roomId);
    if (layout) {
      set({
        activeRoomId: layout.id,
        activeRoomName: layout.name,
        trackingMode: layout.trackingMode,
        placedModels: layout.objects,
      });
      get().showToast(`Restored room: ${layout.name}`);
      return true;
    }
    return false;
  },

  createNewRoom: (name, mode) => {
    const newId = 'room_' + Math.random().toString(36).substring(2, 9);
    set({
      activeRoomId: newId,
      activeRoomName: name,
      trackingMode: mode,
      placedModels: [],
      selectedModelId: null,
    });
    logger.info('System', `Created new room "${name}" [${newId}]`);
  },

  clearRoom: () => {
    set({ placedModels: [], selectedModelId: null });
    logger.info('Memory', 'Cleared all objects from active room');
  },
}));
