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

  // Detect iOS Safari
  const isIOSSafari = () => {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
  };

  // Enhanced cookie handling for iOS Safari
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Set cookie with iOS Safari compatibility
  const setCookie = (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = cookieString;
  };

  // Main authentication check - fetches profile
  const checkAuth = useCallback(async () => {
    try {
      // For iOS Safari, try to get token from cookie first
      if (isIOSSafari()) {
        const token = getCookie('token');
        if (token) {
          // Set Authorization header for iOS Safari
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await axios.get('/user/profile');
      setProfile(response.data);
      return true;
    } catch (err) {
      console.error('Auth check failed:', err);
      
      // Only clear profile on specific authentication errors
      if (err.response) {
        if (err.response.status === 401) {       // Unauthorized - clear profile
          setProfile(null);
          setPaymentDetails(null);
          return false;
        } else if (err.response.status === 403) {      // Forbidden - clear profile
          setProfile(null);
          setPaymentDetails(null);
          return false;
        }
        // For other server errors (500, 502 etc.), don't clear profile
        // This prevents logout on temporary server issues
        return !!profile; // Return current auth state
      } else if (err.request) {
        // Network error - don't clear profile, return current state
        console.warn('Network error during auth check, keeping current state');
        return !!profile;
      } else {   // Other errors - don't clear profile
        console.warn('Other error during auth check, keeping current state');
        return !!profile;
      }
    }
  }, [profile]);

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
      const response = await axios.post('/auth/login', credentials);
      
      // 2. Handle iOS Safari cookie storage
      if (isIOSSafari()) {
        // Check if token is in response headers or cookies
        const token = response.data?.token || getCookie('token');
        if (token) {
          // Store token in localStorage as backup for iOS Safari
          localStorage.setItem('auth_token', token);
          // Set Authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      
      // 3. Verify auth by fetching profile
      const isAuthenticated = await checkAuth();
      
      if (!isAuthenticated) {
        throw new Error('Login succeeded but authentication failed');
      }

      // 4. Fetch payment details after successful auth
      await fetchPaymentDetails();
    } catch (err) {
      console.error('Login error:', err);
      // setError(err.response?.data?.message || err.message);
      setProfile(null);
      setPaymentDetails(null);
      if (err.response) {
        console.debug("[useLogin] Response status:", err.response.status);
        const { status, data } = err.response;
        console.debug("[useLogin] Response data:", data);
        if (status === 400) {
          setError("Validation errors. Please check your input.");
        } else if (status === 401) {
          setError("Invalid credentials. Please check your email and password.");
        } else if (status === 406) {
          setError("Email is not verified. Please verify your email first.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        console.debug("[useLogin] No response from server, network error:", err.message);
        setError("Network error. Please check your internet connection.");
      }
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
      // Clear stored token for iOS Safari
      if (isIOSSafari()) {
        localStorage.removeItem('auth_token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  };

  // Initial authentication check
  useEffect(() => {
    const initAuth = async () => {
      try {
        // For iOS Safari, try to restore token from localStorage
        if (isIOSSafari()) {
          const storedToken = localStorage.getItem('auth_token');
          if (storedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          }
        }

        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
          await fetchPaymentDetails();
        }
      } catch (err) {
        console.error('Initial auth check failed:', err);
      } finally {
        setInitialCheckDone(true);
        setLoading(false);
      }
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