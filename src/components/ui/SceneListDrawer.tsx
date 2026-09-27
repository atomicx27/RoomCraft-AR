import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { X, Layers, Lock, Unlock, Trash2, Focus, Sparkles } from 'lucide-react';
import { launchNativeQuickLookAR } from '../../utils/usdzExporter';

export const SceneListDrawer: React.FC = () => {
  const {
    isSceneListOpen,
    setSceneListOpen,
    placedModels,
    selectedModelId,
    selectModel,
    toggleModelLock,
    deleteModel,
    clearRoom,
    showToast,
  } = useRoomStore();

  if (!isSceneListOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/80 rounded-t-3xl p-5 shadow-2xl max-w-xl mx-auto pointer-events-auto transition-transform">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-extrabold text-white">Scene Inventory</h3>
          <span className="text-xs text-slate-400">({placedModels.length} objects)</span>
        </div>
        <div className="flex items-center space-x-2">
          {placedModels.length > 0 && (
            <button
              onClick={clearRoom}
              className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 hover:bg-slate-800 rounded-lg"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setSceneListOpen(false)}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Object List */}
      <div className="my-4 max-h-64 overflow-y-auto space-y-2 font-sans">
        {placedModels.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs italic">
            No 3D objects placed in room yet. Open catalog to summon decor!
          </div>
        ) : (
          placedModels.map((item) => {
            const isSelected = item.id === selectedModelId;
            return (
              <div
                key={item.id}
                onClick={() => selectModel(item.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-500 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl text-xs font-bold uppercase ${
                    item.category === 'interactive' ? 'bg-amber-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.category[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      Pos: [{item.position.map((n) => n.toFixed(1)).join(',')}]
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => selectModel(item.id)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-sky-400 rounded-lg"
                    title="Focus object"
                  >
                    <Focus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleModelLock(item.id)}
                    className={`p-1.5 rounded-lg ${
                      item.isLocked ? 'text-amber-400 bg-amber-950/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={item.isLocked ? 'Unlock transform' : 'Lock in place'}
                  >
                    {item.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteModel(item.id)}
                    className="p-1.5 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg"
                    title="Delete object"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer 6DoF AR QuickLook Export Action */}
      {placedModels.length > 0 && (
        <div className="pt-3 border-t border-slate-800 flex justify-center">
          <button
            onClick={async () => {
              setSceneListOpen(false);
              showToast('Exporting Room Layout to iOS 6DoF AR...');
              const success = await launchNativeQuickLookAR(placedModels);
              if (!success) {
                showToast('Failed to open QuickLook AR scene');
              }
            }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 text-white font-bold text-xs rounded-xl shadow-lg border border-purple-400/30 flex items-center justify-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch Entire Room in Native iOS 6DoF AR </span>
          </button>
        </div>
      )}
    </div>
  );
};
