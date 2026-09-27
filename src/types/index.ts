export type TrackingMode = 'anchor' | 'freeform';

export type TrackingStatus = 'searching' | 'stable' | 'lost' | 'unsupported';

export type ModelCategory = 'static' | 'animated' | 'interactive';

export interface ModelCatalogItem {
  id: string;
  name: string;
  category: ModelCategory;
  description: string;
  previewColor: string;
  glbUrl?: string; // Optional GLB path
  iconName: string;
}

export interface PlacedModelInstance {
  id: string;
  modelKey: string;
  name: string;
  category: ModelCategory;
  position: [number, number, number];
  rotation: [number, number, number]; // Euler angles [x, y, z] in radians
  scale: [number, number, number];
  isLocked: boolean;
  isInteractiveOn?: boolean; // For lamp/interactive models
}

export interface SavedRoomLayout {
  id: string;
  name: string;
  updatedAt: string;
  trackingMode: TrackingMode;
  objects: PlacedModelInstance[];
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export type LogTag = 
  | 'System' 
  | 'WebXR' 
  | 'HitTest' 
  | 'AssetLoader' 
  | 'Gesture' 
  | 'QRScanner' 
  | 'IndexedDB' 
  | 'Memory';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  tag: LogTag;
  message: string;
  details?: Record<string, unknown>;
}
