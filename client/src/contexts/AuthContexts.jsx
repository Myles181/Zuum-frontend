import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [profile, setProfile] = useState(null);

  // ======= TOKEN HELPERS =======
  const isTokenValid = (tok) => {
    try {
      const decoded = jwtDecode(tok);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const setAutoLogout = (tok) => {
    try {
      const decoded = jwtDecode(tok);
      const expiresIn = decoded.exp * 1000 - Date.now();
      if (logoutTimer) clearTimeout(logoutTimer);
      const timer = setTimeout(() => {
        logout();
        setError('Session expired. Please log in again.');
      }, expiresIn);
      setLogoutTimer(timer);
    } catch (err) {
      console.error('Auto-logout setup failed', err);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  // ======= FETCH HELPERS =======
  const fetchPaymentImmediately = async (tok) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/payment/create`, {
        headers: { Authorization: `Bearer ${tok}` }
      });
      setPaymentDetails(res.data);
    } catch (err) {
      console.error('Payment fetch failed', err);
    }
  };

  console.log(paymentDetails, 'payment details from auth context');
  

  const fetchProfileInBackground = async (tok) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${tok}` }
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Profile fetch failed', err);
    }
  };

  // ======= INITIAL LOAD =======
  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    if (stored && isTokenValid(stored)) {
      setToken(stored);
      setAutoLogout(stored);
      fetchPaymentImmediately(stored);
      fetchProfileInBackground(stored);
    } else {
      localStorage.removeItem('authToken');
    }
    setLoading(false);
  }, []);

  // ======= LOGIN =======
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`, credentials
      );
      const { token: tok } = data;
      if (!isTokenValid(tok)) throw new Error('Invalid token');
      setToken(tok);
      localStorage.setItem('authToken', tok);
      setAutoLogout(tok);
      // Immediately load payment, profile in background
      await fetchPaymentImmediately(tok);
      fetchProfileInBackground(tok);
    } catch (err) {
      console.error('Login error', err);
      if (err.response) {
        const { status } = err.response;
        if (status === 401) setError('Invalid credentials.');
        else setError('Login failed.');
      } else {
        setError('Network error.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ======= CLEANUP =======
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
    isAuthenticated: !!token && isTokenValid(token),
    paymentDetails,
    profile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
