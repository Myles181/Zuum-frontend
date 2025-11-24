// // useSocket.js
// import { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// // Module-level variable to hold the singleton socket instance
// let socketInstance = null;

// const useSocket = () => {
//   const [socket, setSocket] = useState(socketInstance);
//   const [isConnected, setIsConnected] = useState(socketInstance ? socketInstance.connected : false);

//   useEffect(() => {
//     // If there's no instance yet, create one.
//     if (!socketInstance) {
//       socketInstance = io(SOCKET_SERVER_URL, {
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//       });

//       socketInstance.on('connect', () => {
//         console.log(`Socket connected: ${socketInstance.id}`);
//         setIsConnected(true);
//       });

//       socketInstance.on('disconnect', (reason) => {
//         console.log('Socket disconnected:', reason);
//         setIsConnected(false);
//       });

//       socketInstance.on('connect_error', (err) => {
//         console.error('Connection error:', err);
//       });
//     }

//     // Set local state with the singleton instance
//     setSocket(socketInstance);

//     // Do not disconnect on unmount to preserve the singleton
//     return () => {
//       // Optionally, remove any listeners specific to a component here.
//     };
//   }, []);

//   return { socket, isConnected };
// };

// export default useSocket;
