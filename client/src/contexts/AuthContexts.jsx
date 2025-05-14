import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // Crucial for cookies

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Main authentication check - fetches profile
  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get('/user/profile');
      setProfile(response.data);
      return true;
    } catch (err) {
      setProfile(null);
      setPaymentDetails(null);
      return false;
    }
  }, []);

  // Payment functions
  const fetchPaymentDetails = useCallback(async () => {
    try {
      const res = await axios.get('/payment/create');
      setPaymentDetails(res.data);
      return res.data;
    } catch (err) {
      console.error('Payment fetch failed', err);
      setPaymentDetails(null);
      throw err;
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Send login request
      await axios.post('/auth/login', credentials);
      
      // 2. Verify auth by fetching profile
      const isAuthenticated = await checkAuth();
      
      if (!isAuthenticated) {
        throw new Error('Login succeeded but authentication failed');
      }

      // 3. Fetch payment details after successful auth
      await fetchPaymentDetails();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message);
      setProfile(null);
      setPaymentDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setProfile(null);
      setPaymentDetails(null);
    }
  };

  // Initial authentication check
  useEffect(() => {
    const initAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await fetchPaymentDetails();
      }
      setInitialCheckDone(true);
      setLoading(false);
    };
    
    if (!initialCheckDone) {
      initAuth();
    }
  }, [checkAuth, fetchPaymentDetails, initialCheckDone]);

  const value = {
    loading,
    error,
    profile,
    paymentDetails,
    login,
    logout,
    isAuthenticated: !!profile,
    checkAuth,
    fetchPaymentDetails
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};