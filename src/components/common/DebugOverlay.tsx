import React, { useEffect, useState } from 'react';
import { logger } from '../../utils/logger';
import { LogEntry } from '../../types';
import { useRoomStore } from '../../store/useRoomStore';
import { Terminal, X, Trash2, ChevronDown, ChevronUp, Cpu, Compass, Layers } from 'lucide-react';

export const DebugOverlay: React.FC = () => {
  const { isDebugOverlayOpen, setDebugOverlayOpen, trackingStatus, reticlePosition, placedModels } = useRoomStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    // Initial logs
    setLogs(logger.getHistory());

    // Subscribe to new logs
    const unsubscribe = logger.subscribe((newEntry) => {
      setLogs((prev) => [newEntry, ...prev.slice(0, 199)]);
    });

    // FPS Counter loop
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calcFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };

    animId = requestAnimationFrame(calcFps);

    return () => {
      unsubscribe();
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isDebugOverlayOpen) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-lg mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl text-slate-200 overflow-hidden font-mono text-xs pointer-events-auto transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/90 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-slate-100">Live WebAR Terminal Logs</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            fps >= 50 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
          }`}>
            {fps} FPS
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              logger.clearHistory();
              setLogs([]);
            }}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDebugOverlayOpen(false)}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Real-time Telemetry Dashboard */}
          <div className="grid grid-cols-3 gap-2 p-2 bg-slate-950/60 border-b border-slate-800/80 text-[11px]">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>Status: <strong className="text-white capitalize">{trackingStatus}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300 truncate">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">Reticle: <strong className="text-white">{reticlePosition.map(n => n.toFixed(1)).join(',')}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Models: <strong className="text-white">{placedModels.length}/15</strong></span>
            </div>
          </div>

          {/* Log List View */}
          <div className="max-h-60 overflow-y-auto p-2.5 space-y-1.5 font-mono text-[11px] leading-relaxed">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic text-center py-4">No log output recorded yet...</div>
            ) : (
              logs.map((entry) => {
                const badgeColors: Record<string, string> = {
                  DEBUG: 'bg-slate-800 text-slate-400 border-slate-700',
                  INFO: 'bg-sky-950/80 text-sky-400 border-sky-800/50',
                  WARN: 'bg-amber-950/80 text-amber-400 border-amber-800/50',
                  ERROR: 'bg-red-950/80 text-red-400 border-red-800/50',
                };
                return (
                  <div key={entry.id} className="flex items-start space-x-2 border-b border-slate-800/40 pb-1">
                    <span className="text-slate-500 shrink-0 select-all">{entry.timestamp}</span>
                    <span className={`px-1 py-0.2 rounded border text-[9px] font-bold shrink-0 ${badgeColors[entry.level] || ''}`}>
                      {entry.level}
                    </span>
                    <span className="text-purple-400 font-bold shrink-0">[{entry.tag}]</span>
                    <span className="text-slate-200 break-all">{entry.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};
