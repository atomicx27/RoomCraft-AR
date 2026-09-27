import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, ShieldAlert, RefreshCw } from 'lucide-react';
import { logger } from '../../utils/logger';

export const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInsecureContext, setIsInsecureContext] = useState<boolean>(false);

  const startCamera = async () => {
    setErrorMessage(null);
    const isSecure = window.isSecureContext || window.location.hostname === 'localhost' || window.location.protocol === 'https:';
    
    if (!isSecure) {
      setIsInsecureContext(true);
      setHasPermission(false);
      setErrorMessage('iOS Safari & Android Chrome block camera access on HTTP (Not Secure). Please open the HTTPS link: https://' + window.location.host);
      logger.warn('WebXR', 'Insecure context detected! Mobile browsers block camera on HTTP.');
      return;
    }

    logger.info('WebXR', 'Requesting camera stream access (facingMode: environment)...');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera MediaDevices API not supported or insecure context');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Required for iOS Safari inline playback
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        await videoRef.current.play();
        setHasPermission(true);
        logger.info('WebXR', 'Camera feed successfully playing in background');
      }
    } catch (err: any) {
      logger.error('WebXR', 'Failed to activate camera feed stream', { error: err?.message || String(err) });
      setHasPermission(false);
      setErrorMessage(err?.message || 'Camera permission denied or camera not found.');
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        logger.info('WebXR', 'Stopped background camera video stream tracks');
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
      {/* Background HTML5 Video Feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Permission Denied / Insecure Context Error Prompt Overlay */}
      {hasPermission === false && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans pointer-events-auto">
          <div className="p-4 bg-red-950/80 border border-red-800/80 rounded-full text-red-400">
            {isInsecureContext ? <ShieldAlert className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white">
              {isInsecureContext ? 'HTTPS Security Required for Camera' : 'Camera Access Required'}
            </h3>
            <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
              {isInsecureContext
                ? 'Mobile browsers (iOS Safari & Chrome) strictly disable camera permissions over HTTP connections.'
                : 'RoomCraft AR needs camera permission to project 3D models into your physical room.'}
            </p>

            {isInsecureContext && (
              <div className="mt-4 p-3 bg-sky-950/80 border border-sky-800/60 rounded-xl text-xs text-sky-200 font-mono text-left space-y-1">
                <p className="font-bold text-sky-400">Switch to HTTPS:</p>
                <a
                  href={'https://' + window.location.hostname + ':' + window.location.port + window.location.pathname}
                  className="text-sky-400 underline font-semibold break-all"
                >
                  https://{window.location.hostname}:{window.location.port}
                </a>
              </div>
            )}

            {errorMessage && !isInsecureContext && (
              <p className="text-[11px] text-amber-400 font-mono mt-2 bg-slate-900 p-2 rounded border border-slate-800">
                {errorMessage}
              </p>
            )}
          </div>

          {!isInsecureContext ? (
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Enable Camera Stream</span>
            </button>
          ) : (
            <a
              href={'https://' + window.location.hostname + ':' + window.location.port + window.location.pathname}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all"
            >
              <span>Open in HTTPS Mode</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};
