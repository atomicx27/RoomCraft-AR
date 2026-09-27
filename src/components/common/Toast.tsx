import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const toastMessage = useRoomStore((state) => state.toastMessage);

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-full shadow-lg text-slate-100 text-sm flex items-center space-x-2 animate-bounce">
      <Info className="w-4 h-4 text-sky-400 shrink-0" />
      <span className="font-medium">{toastMessage}</span>
    </div>
  );
};
