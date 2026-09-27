import React, { useState } from 'react';
import { useRoomStore, STARTER_CATALOG } from '../../store/useRoomStore';
import { ModelCategory } from '../../types';
import { X, Flower2, Activity, Lamp, Armchair, Upload, QrCode, Plus } from 'lucide-react';
import { logger } from '../../utils/logger';

export const CatalogDrawer: React.FC = () => {
  const { isCatalogOpen, setCatalogOpen, spawnModel, setQRScannerOpen, showToast } = useRoomStore();
  const [activeTab, setActiveTab] = useState<'catalog' | 'upload' | 'scan'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | 'all'>('all');

  if (!isCatalogOpen) return null;

  const filteredCatalog = STARTER_CATALOG.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flower2': return <Flower2 className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'Lamp': return <Lamp className="w-6 h-6" />;
      case 'Armchair': return <Armchair className="w-6 h-6" />;
      default: return <Plus className="w-6 h-6" />;
    }
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      logger.info('AssetLoader', `Custom GLB file selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      showToast(`Uploaded ${file.name}`);
      // For custom uploads, spawn a procedural custom fallback placeholder with file name
      spawnModel('plant_potted');
      setCatalogOpen(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/80 rounded-t-3xl p-5 shadow-2xl max-w-xl mx-auto pointer-events-auto transition-transform">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-extrabold text-white">Summon 3D Decor</h3>
          <p className="text-xs text-slate-400">Tap an item to spawn it into your active room</p>
        </div>
        <button
          onClick={() => setCatalogOpen(false)}
          className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 my-4 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeTab === 'catalog' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Curated Catalog
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeTab === 'upload' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Custom Uploads
        </button>
        <button
          onClick={() => {
            setCatalogOpen(false);
            setQRScannerOpen(true);
          }}
          className="flex-1 py-2 rounded-lg text-purple-400 hover:text-purple-300 flex items-center justify-center space-x-1"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan Card</span>
        </button>
      </div>

      {/* Tab 1: Catalog View */}
      {activeTab === 'catalog' && (
        <>
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-1 text-xs">
            {(['all', 'static', 'animated', 'interactive'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full capitalize shrink-0 font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-700 text-sky-400 border border-sky-500/50'
                    : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid List */}
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                onClick={() => spawnModel(item.id)}
                className="p-3.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-sky-500/60 rounded-2xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className="p-2.5 rounded-xl text-slate-950 shrink-0"
                    style={{ backgroundColor: item.previewColor }}
                  >
                    {getIcon(item.iconName)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">{item.category}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tab 2: Custom Uploads View */}
      {activeTab === 'upload' && (
        <div className="p-6 border-2 border-dashed border-slate-800 hover:border-sky-500/50 rounded-2xl text-center bg-slate-950/40 my-4 flex flex-col items-center justify-center space-y-3">
          <Upload className="w-8 h-8 text-sky-400" />
          <div>
            <h4 className="text-sm font-bold text-slate-200">Import Custom 3D Model</h4>
            <p className="text-xs text-slate-400 mt-1">Select binary glTF (.glb) files from your device.</p>
          </div>
          <label className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors">
            Browse .GLB File
            <input type="file" accept=".glb,.gltf" onChange={handleCustomUpload} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
};
