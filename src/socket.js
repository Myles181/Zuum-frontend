// socketService.js
import io from 'socket.io-client';

// Allow a dedicated socket URL + path so we can match the backend config exactly.
// Fallback to VITE_API_URL and default Socket.IO path if not provided.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || '/socket.io';

let socket;

export const initializeSocket = (userId) => {
  // Only initialize if not already created
  if (!socket) {
    console.log('[Socket] Initializing Socket.IO client', {
      SOCKET_URL,
      SOCKET_PATH,
    });

    socket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: false,
    });
    
    // Setup basic event listeners
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      if (userId) {
        socket.emit('joinChat', userId);
        console.log('[Socket] joinChat emitted with userId:', userId);
      }
    });
    
    socket.on('connect_error', (err) => {
      console.error('[Socket] Connect error:', err?.message || err);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', socket.id, 'Reason:', reason);
    });
  } else if (userId) {
    // Socket already exists so just join the chat with new userId if necessary
    socket.emit('joinChat', userId);
    console.log('[Socket] Socket already initialized, joinChat emitted for userId:', userId);
  }
  
  return socket;
};

export const getSocket = () => {
  return socket;
};
