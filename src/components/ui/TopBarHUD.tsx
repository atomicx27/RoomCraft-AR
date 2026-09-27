import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { Save, Terminal, ArrowLeft, Compass, Anchor, Footprints, AlertTriangle, Sparkles } from 'lucide-react';
import { launchNativeQuickLookAR } from '../../utils/usdzExporter';

export const TopBarHUD: React.FC = () => {
  const {
    activeRoomName,
    trackingStatus,
    placedModels,
    setCurrentView,
    saveCurrentRoom,
    setDebugOverlayOpen,
    isDebugOverlayOpen,
    requestGyroPermission,
    gyroPermissionGranted,
    moveCameraDistance,
    resetCameraOffset,
    showToast,
  } = useRoomStore();

  const handleLockAnchorOrigin = () => {
    showToast('Room Anchor (0,0,0) Locked to Current Location');
  };

  const getStatusBadge = () => {
    switch (trackingStatus) {
      case 'stable':
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-800/60 rounded-full text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Surface Locked</span>
          </span>
        );
      case 'searching':
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-950/80 border border-amber-800/60 rounded-full text-amber-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Searching Surface...</span>
          </span>
        );
      case 'lost':
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-red-950/80 border border-red-800/60 rounded-full text-red-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Tracking Lost</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-full text-slate-400 text-xs font-semibold">
            <span>Initializing</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-gradient-to-b from-slate-950/95 to-transparent pointer-events-auto flex items-center justify-between">
      {/* Back to Dashboard & Active Room */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-200 shadow backdrop-blur-md transition-colors"
          title="Return to Spaces Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-sm font-bold text-white drop-shadow truncate max-w-[120px] sm:max-w-xs">{activeRoomName}</h2>
          <div className="mt-0.5">{getStatusBadge()}</div>
        </div>
      </div>

      {/* Action Buttons: Walk Controls, Gyro Permission, Save Room & Debug Overlay Toggle */}
      <div className="flex items-center space-x-1.5">
        {/* Walk Camera Distance Buttons */}
        <div className="flex items-center space-x-1 bg-slate-900/90 border border-slate-700 p-1 rounded-xl backdrop-blur-md">
          <button
            onClick={() => moveCameraDistance(-0.4)}
            className="px-2 py-1 bg-slate-800 hover:bg-sky-600 active:bg-sky-700 text-white rounded text-[10px] font-bold"
            title="Step Closer to Object"
          >
            Walk In
          </button>
          <button
            onClick={() => moveCameraDistance(0.4)}
            className="px-2 py-1 bg-slate-800 hover:bg-sky-600 active:bg-sky-700 text-white rounded text-[10px] font-bold"
            title="Step Back from Object"
          >
            Walk Out
          </button>
        </div>

        {/* Gyro Scope Permission Button */}
        <button
          onClick={() => requestGyroPermission()}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all ${
            gyroPermissionGranted
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
              : 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
          }`}
          title="Calibrate Phone Gyroscope for Spatial Anchoring"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{gyroPermissionGranted ? 'Gyro Active' : 'Calibrate Gyro'}</span>
        </button>

        <button
          onClick={() => setDebugOverlayOpen(!isDebugOverlayOpen)}
          className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
            isDebugOverlayOpen
              ? 'bg-purple-900/80 border-purple-500 text-purple-300'
              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300'
          }`}
          title="Toggle Terminal Diagnostics HUD"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Launch Native iOS 6DoF QuickLook AR Button */}
        {placedModels.length > 0 && (
          <button
            onClick={async () => {
              showToast('Generating USDZ Room Scene for iOS AR...');
              const success = await launchNativeQuickLookAR(placedModels);
              if (!success) {
                showToast('Failed to open QuickLook AR scene');
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 text-white font-bold text-xs rounded-xl shadow-lg border border-purple-400/30 transition-all animate-pulse"
            title="View entire room with all placed items in native iOS 6DoF AR"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">View Room 6DoF AR </span>
            <span className="sm:hidden">6DoF AR </span>
          </button>
        )}

        <button
          onClick={() => saveCurrentRoom()}
          className="flex items-center space-x-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-lg border border-sky-400/30 transition-all"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>
    </div>
  );
};
