// useMessages.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getSocket } from '../../src/socket';
 // Adjust path as needed

const API_URL = import.meta.env.VITE_API_URL;

// ---------------------
// Get Room ID Hook
// ---------------------
export const useGetRoomId = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const getRoomId = async (profileId1, profileId2) => {
    setLoading(true);
    setError(null);
    setRoomId(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/user/get-room-id`,
        { profileId_1: profileId1, profileId_2: profileId2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Room ID fetched:', response.data.room_id);
        setRoomId(response.data.room_id);
        return response.data.room_id;
      } else {
        setError('An unexpected error occurred');
        console.error('Error fetching room ID:', response);
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Profile IDs missing');
            break;
          case 404:
            setError(err.response.data.message || 'Profile not found');
            break;
          case 500:
            setError('Internal server error');
            break;
          default:
            setError('An unexpected error occurred');
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Failed to get room ID: ' + err.message);
      }
      console.error('Error in getRoomId:', err);
    } finally {
      setLoading(false);
    }
  };

  return { getRoomId, roomId, loading, error };
};



// useMessages.jsx
export const useGetRooms = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);

  const getRooms = async () => {
    setLoading(true);
    setError(null);
    setRooms([]);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/user/get-rooms`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Rooms fetched:', response.data);
        setRooms(response.data);
        return response.data;
      } else {
        setError('An unexpected error occurred');
        console.error('Unexpected response status:', response.status);
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 500:
            setError(err.response.data?.error || 'Internal server error');
            break;
          default:
            setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Failed to fetch rooms: ' + err.message);
      }
      console.error('Error in getRooms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Add automatic refresh capability
  const refreshRooms = useCallback(() => {
    getRooms();
  }, []);

  return { getRooms, rooms, loading, error, refreshRooms };
};
  

// ---------------------
// Join Chat Hook
// ---------------------
const useJoinChat = () => {
  const joinChat = useCallback(
    (userId) => {
      const socket = getSocket();
      if (socket && typeof socket.emit === 'function') {
        socket.emit('joinChat', userId);
        console.log(`joinChat emitted for userId: ${userId}`);
      } else {
        console.error('Socket is not available for joinChat', socket);
      }
    },
    []
  );

  return joinChat;
};

export default useJoinChat;

// ---------------------
// Send Message Hook
// ---------------------
export const useSendMessage = () => {
    const [error, setError] = useState(null);
    const socket = getSocket();
    const isConnected = socket && socket.connected;
  
    const sendMessage = async ({ content, roomId, receiverId, onAckFallback }) => {
      console.log('sendMessage called with:', { content, roomId, receiverId });
      if (!isConnected || !socket) {
        const errMsg = 'Not connected to server';
        console.error(errMsg);
        setError(errMsg);
        return;
      }
  
      if (!content.trim() || !roomId || !receiverId) {
        const errMsg = 'Missing message data';
        console.error(errMsg, { content, roomId, receiverId });
        setError(errMsg);
        return;
      }
  
      setError(null);
  
      try {
        const response = await Promise.race([
          new Promise((resolve, reject) => {
            socket.emit(
              'sendMessage',
              { content, roomId, receiverId },
              (response) => {
                console.log('Ack callback invoked with response:', response);
                if (response?.error) {
                  reject(new Error(response.error));
                } else {
                  resolve(response);
                }
              }
            );
          }),
          new Promise((_, reject) =>
            setTimeout(() => {
              const errMsg = 'Server response timeout';
              console.error(errMsg);
              reject(new Error(errMsg));
            }, 5000)
          )
        ]);
        console.log('sendMessage resolved with:', response);
        return response;
      } catch (err) {
        console.error('sendMessage caught an error:', err);
        setError(err.message);
        if (typeof onAckFallback === 'function') {
          onAckFallback();
        }
        throw err;
      }
    };
  
    return { sendMessage, error, isConnected };
  };
  

// ---------------------
// Fetch Messages Hook
// ---------------------
export const useFetchMessages = (roomId) => {
    const socket = getSocket();
    const [fetchedMessages, setFetchedMessages] = useState([]);
  
    useEffect(() => {
      if (!socket || !roomId) return;
  
      const handleRecentMessages = (messages) => {
        console.log('Backend returned messages:', messages);
        setFetchedMessages(messages);
      };
  
      const handleNewMessage = (message) => {
        if (message.room_id === roomId) {
          setFetchedMessages((prev) => [...prev, message]);
        }
      };
  
      // Listen for messages from the server
      socket.on('recentMessages', handleRecentMessages);
      socket.on('receiveMessage', handleNewMessage);
  
      // Immediately request messages for the room
      socket.emit('fetchMessages', roomId);
  
      // Set up an interval to fetch messages every 2 seconds
      const interval = setInterval(() => {
        socket.emit('fetchMessages', roomId);
        console.log(`Emitted fetchMessages for room: ${roomId}`);
      }, 2000);
  
      // Cleanup on unmount
      return () => {
        socket.off('recentMessages', handleRecentMessages);
        socket.off('receiveMessage', handleNewMessage);
        clearInterval(interval);
      };
    }, [socket, roomId]);
  
    return fetchedMessages;
  };
  

// ---------------------
// Receive Messages Hook
// ---------------------
export const useReceiveMessages = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socket = getSocket();

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleReceiveMessage = (message) => {
      if (message.room_id === roomId) {
        console.log('New message received:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, roomId]);

  return messages;
};
