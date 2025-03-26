// socketService.js
import io from 'socket.io-client';

const API_SOCKET_URL = 'https://zuum-backend-qs8x.onrender.com/';

let socket;

export const initializeSocket = (userId) => {
  // Only initialize if not already created
  if (!socket) {
    socket = io(API_SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: false,
    });
    
    // Setup basic event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      if (userId) {
        socket.emit('joinChat', userId);
        console.log('joinChat emitted with userId:', userId);
      }
    });
    
    socket.on('connect_error', (err) => console.error('Connect error:', err.message));
    socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
  } else if (userId) {
    // Socket already exists so just join the chat with new userId if necessary
    socket.emit('joinChat', userId);
    console.log('Socket already initialized, joinChat emitted for userId:', userId);
  }
  
  return socket;
};

export const getSocket = () => {
  return socket;
};
