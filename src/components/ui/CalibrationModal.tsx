import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { ScanLine, Smartphone, QrCode, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TrackingMode } from '../../types';

export const CalibrationModal: React.FC = () => {
  const { trackingMode, setTrackingMode, setCurrentView, activeRoomName, requestGyroPermission } = useRoomStore();

  const handleStartAR = async (mode: TrackingMode) => {
    setTrackingMode(mode);
    // Explicit user tap gesture trigger for iOS Safari Gyroscope permission
    await requestGyroPermission();
    setCurrentView('ar');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 max-w-xl mx-auto font-sans select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full shadow-2xl flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="px-3 py-1 bg-sky-950 text-sky-400 text-xs font-semibold rounded-full border border-sky-800/50 inline-block mb-2">
            Step 2: Tracking Calibration
          </span>
          <h2 className="text-2xl font-extrabold text-white">Prepare Your AR Viewport</h2>
          <p className="text-slate-400 text-sm mt-1">Calibrating space: <strong className="text-slate-200">{activeRoomName}</strong></p>
        </div>

        {/* Tracking Options Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Free-Form Surface Option */}
          <div
            onClick={() => handleStartAR('freeform')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
              trackingMode === 'freeform'
                ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="p-3 bg-sky-900/40 text-sky-400 rounded-xl shrink-0 mt-1">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-base">Free-Form Surface Placement</h3>
                {trackingMode === 'freeform' && <CheckCircle2 className="w-5 h-5 text-sky-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Slowly pan camera feed over your table or floor. The gliding reticle will detect flat surfaces instantly.
              </p>
            </div>
          </div>

          {/* Anchor Mode Option */}
          <div
            onClick={() => handleStartAR('anchor')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
              trackingMode === 'anchor'
                ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="p-3 bg-purple-900/40 text-purple-400 rounded-xl shrink-0 mt-1">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-base">Physical QR Anchor Memory Mode</h3>
                {trackingMode === 'anchor' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Point camera at your printed anchor card on desk/wall to lock room origin (0,0,0) across visits.
              </p>
            </div>
          </div>
        </div>

        {/* Scanning Guide Animation Box */}
        <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center space-x-3 text-xs text-slate-400">
          <ScanLine className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
          <span>Move device gently in a figure-8 motion to let camera detect depth and floor surfaces.</span>
        </div>

        {/* Enter AR Launch Action */}
        <button
          onClick={() => handleStartAR(trackingMode)}
          className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
        >
          <span>Launch Camera Viewport</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
