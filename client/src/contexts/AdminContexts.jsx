// src/contexts/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // Enable cookie authentication

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);

  const checkAdminAuth = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        withCredentials: true,
        params: { limit: 1 }
      });
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setIsAuthenticated(false);
      setAdmin(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove the automatic auth check on mount
  // useEffect(() => {
  //   checkAdminAuth();
  // }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/admin/auth/login`, credentials, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setAdmin(response.data.admin);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/admin/auth/logout`, {}, {
        withCredentials: true
      });
      setAdmin(null);
      setIsAuthenticated(false);
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{ 
      admin, 
      isAuthenticated, 
      loading, 
      error, 
      login, 
      logout,
      checkAdminAuth
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);