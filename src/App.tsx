import React, { useEffect } from 'react';
import { useRoomStore } from './store/useRoomStore';
import { Dashboard } from './components/ui/Dashboard';
import { CalibrationModal } from './components/ui/CalibrationModal';
import { ARCanvas } from './components/ar/ARCanvas';
import { TopBarHUD } from './components/ui/TopBarHUD';
import { BottomDock } from './components/ui/BottomDock';
import { CatalogDrawer } from './components/ui/CatalogDrawer';
import { SceneListDrawer } from './components/ui/SceneListDrawer';
import { QRScannerModal } from './components/ui/QRScannerModal';
import { DebugOverlay } from './components/common/DebugOverlay';
import { Toast } from './components/common/Toast';
import { logger } from './utils/logger';

import { PwaInstallPrompt } from './components/ui/PwaInstallPrompt';

export const App: React.FC = () => {
  const { currentView } = useRoomStore();

  useEffect(() => {
    logger.info('System', 'RoomCraft AR Application Started', {
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
    });
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none relative">
      {/* Global Toast Notifications */}
      <Toast />

      {/* PWA iOS Installation Guidance Prompt */}
      <PwaInstallPrompt />

      {/* View Switcher */}
      {currentView === 'dashboard' && <Dashboard />}

      {currentView === 'calibration' && <CalibrationModal />}

      {currentView === 'ar' && (
        <div className="w-full h-full relative">
          <TopBarHUD />
          <ARCanvas />
          <BottomDock />
          <CatalogDrawer />
          <SceneListDrawer />
          <QRScannerModal />
          <DebugOverlay />
        </div>
      )}
    </div>
  );
};

export default App;
