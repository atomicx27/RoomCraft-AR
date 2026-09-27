import { get, set, del, keys } from 'idb-keyval';
import { SavedRoomLayout } from '../types';
import { logger } from './logger';

const ROOM_STORAGE_PREFIX = 'roomcraft_room_';

export async function saveRoomLayout(room: SavedRoomLayout): Promise<boolean> {
  const storageKey = `${ROOM_STORAGE_PREFIX}${room.id}`;
  try {
    const dataToSave = {
      ...room,
      updatedAt: new Date().toISOString(),
    };
    await set(storageKey, dataToSave);
    logger.info('IndexedDB', `Room "${room.name}" saved successfully (${room.objects.length} objects)`, {
      roomId: room.id,
      objectCount: room.objects.length,
    });
    return true;
  } catch (err) {
    logger.error('IndexedDB', `Failed to save room "${room.name}"`, { error: String(err) });
    return false;
  }
}

export async function loadRoomLayout(roomId: string): Promise<SavedRoomLayout | null> {
  const storageKey = `${ROOM_STORAGE_PREFIX}${roomId}`;
  try {
    const room = await get<SavedRoomLayout>(storageKey);
    if (room) {
      logger.info('IndexedDB', `Loaded room "${room.name}" (${room.objects.length} objects restored)`, { roomId });
      return room;
    } else {
      logger.warn('IndexedDB', `No saved data found for room ID: ${roomId}`);
      return null;
    }
  } catch (err) {
    logger.error('IndexedDB', `Failed to load room ID: ${roomId}`, { error: String(err) });
    return null;
  }
}

export async function listSavedRooms(): Promise<SavedRoomLayout[]> {
  try {
    const allKeys = await keys();
    const roomKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith(ROOM_STORAGE_PREFIX));
    
    const rooms: SavedRoomLayout[] = [];
    for (const key of roomKeys) {
      const room = await get<SavedRoomLayout>(key);
      if (room) {
        rooms.push(room);
      }
    }

    logger.info('IndexedDB', `Found ${rooms.length} saved rooms in IndexedDB`);
    return rooms;
  } catch (err) {
    logger.error('IndexedDB', 'Failed to list saved rooms', { error: String(err) });
    return [];
  }
}

export async function deleteRoomLayout(roomId: string): Promise<boolean> {
  const storageKey = `${ROOM_STORAGE_PREFIX}${roomId}`;
  try {
    await del(storageKey);
    logger.info('IndexedDB', `Deleted room layout ID: ${roomId}`);
    return true;
  } catch (err) {
    logger.error('IndexedDB', `Failed to delete room ID: ${roomId}`, { error: String(err) });
    return false;
  }
}
