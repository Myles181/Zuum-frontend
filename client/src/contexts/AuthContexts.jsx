import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // You'll need to install this package

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Function to check token validity
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (err) {
      return false;
    }
  };

  // Function to set logout timer
  const setAutoLogout = (token) => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiresIn = (decoded.exp * 1000) - Date.now();

      // Clear any existing timer
      if (logoutTimer) clearTimeout(logoutTimer);

      // Set new timer
      const timer = setTimeout(() => {
        logout();
        setError('Your session has expired. Please log in again.');
      }, expiresIn);

      setLogoutTimer(timer);
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  };

  // Check authentication on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken) {
      if (isTokenValid(storedToken)) {
        setToken(storedToken);
        setAutoLogout(storedToken);
      } else {
        localStorage.removeItem('authToken');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials
      );

      if (response.status === 200) {
        const { token } = response.data;
        
        if (isTokenValid(token)) {
          setToken(token);
          localStorage.setItem('authToken', token);
          setAutoLogout(token);
        } else {
          throw new Error('Received invalid token');
        }
      }
    } catch (err) {
      // Error handling remains the same as your original code
      if (err.response) {
        const { status } = err.response;
        if (status === 400) setError('Validation errors. Please check your input.');
        else if (status === 401) setError('Invalid credentials.');
        else if (status === 406) setError('Email not verified.');
        else if (status === 500) setError('Server error. Please try again later.');
        else setError('An unexpected error occurred.');
      } else {
        setError('Network error. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
  };

  // Verify token on each request (optional)
  const verifyToken = async () => {
    if (!token) return false;
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.status === 200;
    } catch (err) {
      logout();
      return false;
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [logoutTimer]);

  const value = {
    token,
    loading,
    error,
    login,
    logout,
    verifyToken,
    isAuthenticated: !!token && isTokenValid(token)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};