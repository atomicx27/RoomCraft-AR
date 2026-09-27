import React, { useEffect } from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { X, QrCode } from 'lucide-react';
import { logger } from '../../utils/logger';

export const QRScannerModal: React.FC = () => {
  const { isQRScannerOpen, setQRScannerOpen, spawnModel, showToast } = useRoomStore();

  useEffect(() => {
    if (!isQRScannerOpen) return;

    let scannerInstance: any = null;

    // Dynamically import html5-qrcode only when QR scanner modal is opened
    import('html5-qrcode')
      .then(({ Html5QrcodeScanner }) => {
        logger.info('QRScanner', 'Initializing camera QR reader stream...');

        scannerInstance = new Html5QrcodeScanner(
          'qr-reader-container',
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0,
          },
          /* verbose= */ false
        );

        scannerInstance.render(
          (decodedText: string) => {
            logger.info('QRScanner', `QR Code successfully scanned: "${decodedText}"`);

            if (decodedText.includes('LAMP') || decodedText.includes('ambient_lamp')) {
              spawnModel('ambient_lamp');
            } else if (decodedText.includes('PLANT') || decodedText.includes('plant_potted')) {
              spawnModel('plant_potted');
            } else if (decodedText.includes('KINETIC') || decodedText.includes('kinetic_art')) {
              spawnModel('kinetic_art');
            } else if (decodedText.includes('CHAIR') || decodedText.includes('designer_chair')) {
              spawnModel('designer_chair');
            } else {
              spawnModel('plant_potted');
              showToast(`Unlocked item from QR: ${decodedText}`);
            }

            if (scannerInstance) {
              scannerInstance.clear().catch(() => {});
            }
            setQRScannerOpen(false);
          },
          () => {
            // Ignore continuous non-match frames
          }
        );
      })
      .catch((err) => {
        logger.error('QRScanner', 'Failed to load html5-qrcode module', { error: String(err) });
      });

    return () => {
      if (scannerInstance) {
        scannerInstance.clear().catch(() => {});
      }
    };
  }, [isQRScannerOpen]);

  if (!isQRScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Scan Item QR Code</h3>
          </div>
          <button
            onClick={() => setQRScannerOpen(false)}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center">
          Point camera at physical collectible QR cards, stickers, or packaging to materialize 3D items.
        </p>

        {/* Camera Scanner Viewport Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 min-h-[250px]">
          <div id="qr-reader-container" className="w-full"></div>
        </div>
      </div>
    </div>
  );
};
