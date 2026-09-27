import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if running in standalone mode (already installed on Home Screen)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

    // Show prompt only on iOS Safari when not already in standalone mode
    if (isIos && !isStandalone) {
      const dismissed = localStorage.getItem('roomcraft_pwa_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('roomcraft_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 p-4 bg-slate-900/95 border border-amber-500/40 backdrop-blur-xl rounded-2xl shadow-2xl text-slate-100 flex flex-col gap-3 animate-fade-in max-w-md mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
            AR
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Install RoomCraft AR</h3>
            <p className="text-xs text-slate-400">Run as a native app on your iPhone Home Screen</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">1</span>
          <span>Tap the <strong className="text-amber-400 inline-flex items-center gap-1">Share <Share size={13} className="inline" /></strong> button in Safari toolbar.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">2</span>
          <span>Scroll down and select <strong className="text-amber-400 inline-flex items-center gap-1">Add to Home Screen <PlusSquare size={13} className="inline" /></strong>.</span>
        </div>
      </div>
    </div>
  );
};
