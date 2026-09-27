import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import {
  Plus,
  QrCode,
  Magnet,
  Layers,
  Lock,
  Trash2,
  Repeat,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

export const BottomDock: React.FC = () => {
  const {
    isCatalogOpen,
    setCatalogOpen,
    isSceneListOpen,
    setSceneListOpen,
    setQRScannerOpen,
    isSnappingEnabled,
    toggleSnapping,
    selectedModelId,
    placedModels,
    rotateSelectedModel,
    scaleSelectedModel,
    moveSelectedModel,
    toggleModelLock,
    toggleModelInteractive,
    deleteModel,
    selectModel,
  } = useRoomStore();

  const selectedModel = placedModels.find((m) => m.id === selectedModelId);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-3 pointer-events-none flex flex-col items-center space-y-3">
      {/* Floating Pill Overlay for Selected Object Touch Manipulation */}
      {selectedModel && (
        <div className="pointer-events-auto bg-slate-900/95 border border-slate-700 backdrop-blur-xl rounded-2xl p-3 shadow-2xl flex flex-col items-center space-y-2 max-w-sm w-full animate-fade-in text-xs">
          {/* Header Info */}
          <div className="flex items-center justify-between w-full pb-1.5 border-b border-slate-800">
            <span className="font-bold text-sky-400 truncate max-w-[150px]">{selectedModel.name}</span>
            <div className="flex items-center space-x-1">
              {selectedModel.category === 'interactive' && (
                <button
                  onClick={() => toggleModelInteractive(selectedModel.id)}
                  className={`p-1 rounded transition-colors ${
                    selectedModel.isInteractiveOn ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Toggle Lamp Light"
                >
                  <Repeat className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => toggleModelLock(selectedModel.id)}
                className={`p-1 rounded transition-colors ${
                  selectedModel.isLocked ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                }`}
                title={selectedModel.isLocked ? 'Unlock Transform' : 'Lock in Place'}
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteModel(selectedModel.id)}
                className="p-1 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded transition-colors"
                title="Delete Item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => selectModel(null)}
                className="text-[10px] text-slate-400 hover:text-white underline pl-1"
              >
                Done
              </button>
            </div>
          </div>

          {/* Tactile Transform Controls Row */}
          {!selectedModel.isLocked && (
            <div className="flex items-center justify-between w-full gap-1 pt-1">
              {/* Rotate Controls */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => rotateSelectedModel(-Math.PI / 8)}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-300 active:bg-sky-600 active:text-white"
                  title="Rotate Left"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-slate-500 font-mono">Rotate</span>
                <button
                  onClick={() => rotateSelectedModel(Math.PI / 8)}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-300 active:bg-sky-600 active:text-white"
                  title="Rotate Right"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Scale Controls */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => scaleSelectedModel(-0.1)}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-300 active:bg-sky-600 active:text-white"
                  title="Scale Smaller"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-slate-500 font-mono">Size</span>
                <button
                  onClick={() => scaleSelectedModel(0.1)}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-300 active:bg-sky-600 active:text-white"
                  title="Scale Larger"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Move D-Pad Controls */}
              <div className="grid grid-cols-3 gap-0.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <div />
                <button
                  onClick={() => moveSelectedModel(0, -0.1)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 active:bg-sky-600"
                  title="Move Forward"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <div />
                <button
                  onClick={() => moveSelectedModel(-0.1, 0)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 active:bg-sky-600"
                  title="Move Left"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveSelectedModel(0, 0.1)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 active:bg-sky-600"
                  title="Move Back"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveSelectedModel(0.1, 0)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300 active:bg-sky-600"
                  title="Move Right"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Bottom Dock */}
      <div className="pointer-events-auto bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl flex items-center space-x-2 max-w-md w-full justify-around">
        {/* Summon Catalog */}
        <button
          onClick={() => setCatalogOpen(!isCatalogOpen)}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl text-sky-400 hover:bg-slate-800/80 active:bg-slate-800 transition-all font-semibold text-[11px]"
        >
          <div className="p-2 bg-sky-600/20 text-sky-400 rounded-xl mb-1">
            <Plus className="w-5 h-5" />
          </div>
          <span>+ Catalog</span>
        </button>

        {/* Scan Item QR */}
        <button
          onClick={() => setQRScannerOpen(true)}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl text-purple-400 hover:bg-slate-800/80 active:bg-slate-800 transition-all font-semibold text-[11px]"
        >
          <div className="p-2 bg-purple-600/20 text-purple-400 rounded-xl mb-1">
            <QrCode className="w-5 h-5" />
          </div>
          <span>Scan Item</span>
        </button>

        {/* Snapping Toggle */}
        <button
          onClick={toggleSnapping}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all font-semibold text-[11px] ${
            isSnappingEnabled ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className={`p-2 rounded-xl mb-1 ${isSnappingEnabled ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
            <Magnet className="w-5 h-5" />
          </div>
          <span>Snap: {isSnappingEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Scene Inventory List */}
        <button
          onClick={() => setSceneListOpen(!isSceneListOpen)}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl text-slate-300 hover:bg-slate-800/80 active:bg-slate-800 transition-all font-semibold text-[11px] relative"
        >
          <div className="p-2 bg-slate-800 text-slate-300 rounded-xl mb-1">
            <Layers className="w-5 h-5" />
          </div>
          <span>Scene ({placedModels.length})</span>
          {placedModels.length > 0 && (
            <span className="absolute top-2 right-3 w-2 h-2 rounded-full bg-sky-400" />
          )}
        </button>
      </div>
    </div>
  );
};
