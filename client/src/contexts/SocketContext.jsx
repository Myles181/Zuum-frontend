import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContexts";
import { io } from "socket.io-client"; // Make sure this import is included

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      const newSocket = io("http://localhost:3000", {
        query: { userId: profile.uid }, // Optional: pass userId as query param
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [profile]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
