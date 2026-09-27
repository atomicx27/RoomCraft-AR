import React, { useEffect, useState } from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { listSavedRooms, deleteRoomLayout } from '../../utils/storage';
import { SavedRoomLayout, TrackingMode } from '../../types';
import { Box, Plus, Trash2, ArrowRight, Download, Sparkles, FolderKanban } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { setCurrentView, loadRoom, createNewRoom, showToast } = useRoomStore();
  const [savedRooms, setSavedRooms] = useState<SavedRoomLayout[]>([]);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomMode, setNewRoomMode] = useState<TrackingMode>('freeform');

  const fetchRooms = async () => {
    const list = await listSavedRooms();
    setSavedRooms(list);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEnterRoom = async (roomId: string) => {
    const ok = await loadRoom(roomId);
    if (ok) {
      setCurrentView('ar');
    }
  };

  const handleDeleteRoom = async (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    await deleteRoomLayout(roomId);
    showToast('Room deleted');
    fetchRooms();
  };

  const handleCreateNewRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    createNewRoom(newRoomName.trim(), newRoomMode);
    setShowNewRoomModal(false);
    setNewRoomName('');
    setCurrentView('calibration');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-8 max-w-5xl mx-auto font-sans select-none overflow-y-auto">
      {/* Header Banner */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 mb-1">
            <Box className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest font-semibold">WebAR Interior Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">RoomCraft AR</h1>
          <p className="text-slate-400 text-sm mt-1">Summon 3D decor, animated sculptures, and interactive items directly into your room.</p>
        </div>

        <button
          onClick={() => setShowNewRoomModal(true)}
          className="flex items-center justify-center space-x-2 px-5 py-3 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Space</span>
        </button>
      </header>

      {/* Room Spaces Grid */}
      <section className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center space-x-2 text-slate-200">
            <FolderKanban className="w-5 h-5 text-purple-400" />
            <span>Your Living Spaces</span>
          </h2>
          <span className="text-xs text-slate-500">{savedRooms.length} saved rooms</span>
        </div>

        {savedRooms.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 border-dashed text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Sparkles className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">No Custom Spaces Saved Yet</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-md">Start by creating your first room or launching instant free-form AR mode.</p>
            </div>
            <button
              onClick={() => {
                createNewRoom('My Work Desk Setup', 'freeform');
                setCurrentView('ar');
              }}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium rounded-xl border border-slate-700 flex items-center space-x-2 transition-all"
            >
              <span>Instant Start AR Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleEnterRoom(room.id)}
                className="group relative p-5 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition-all shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition-colors">{room.name}</h3>
                    <button
                      onClick={(e) => handleDeleteRoom(e, room.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete Space"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-slate-400 space-y-1">
                    <p>Objects Placed: <strong className="text-slate-200">{room.objects.length} items</strong></p>
                    <p>Tracking Mode: <span className="capitalize text-slate-300">{room.trackingMode}</span></p>
                    <p>Last Saved: {new Date(room.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-xs text-sky-400 font-semibold group-hover:underline flex items-center space-x-1">
                    <span>Enter AR Space</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Printable Anchor Card Download Utility */}
      <footer className="mt-12 p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-800 rounded-xl text-sky-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">Printable Physical Room Anchor</h4>
            <p className="text-xs text-slate-400">Download printable QR anchor card for precise spatial room memory calibration.</p>
          </div>
        </div>
        <a
          href="data:text/plain;charset=utf-8,ROOMCRAFT_ROOM_ANCHOR_CARD"
          download="RoomCraft_AR_Anchor_Card.txt"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 shrink-0 transition-colors"
        >
          Download Anchor Reference
        </a>
      </footer>

      {/* New Room Modal */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Create New AR Living Space</h3>
            <form onSubmit={handleCreateNewRoomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaming Corner / Bedroom Shelf"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tracking Calibration</label>
                <select
                  value={newRoomMode}
                  onChange={(e) => setNewRoomMode(e.target.value as TrackingMode)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="freeform">Free-Form Markerless Surface Mode</option>
                  <option value="anchor">Anchor-Based Precision QR Mode</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewRoomModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white rounded-xl shadow transition-all"
                >
                  Create & Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
