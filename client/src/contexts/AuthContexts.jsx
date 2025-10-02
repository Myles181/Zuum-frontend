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

  // Detect iOS devices (including Chrome iOS)
  const isIOSDevice = () => {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua);
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

  // Utility function to get authenticated headers for API requests
  const getAuthHeaders = () => {
    const headers = {};
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Main authentication check - fetches profile
  const checkAuth = useCallback(async () => {
    try {
      // Debug: Show what we're sending to profile endpoint
      console.debug('[AuthContext] Checking auth - cookies:', document.cookie);
      console.debug('[AuthContext] Checking auth - localStorage token:', localStorage.getItem('auth_token'));
      
      // Get token from localStorage for iOS devices
      const token = localStorage.getItem('auth_token');
      
      // Set up request headers
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // For iOS devices, try to get token from cookie first
      if (isIOSDevice()) {
        const cookieToken = getCookie('token');
        if (cookieToken) {
          // Ensure cookie is set for iOS devices
          setCookie('token', cookieToken, 7);
        }
      }

      const response = await axios.get('/user/profile', {
        headers: headers,
        withCredentials: true // Ensure cookies are sent
      });
      setProfile(response.data);
      return true;
    } catch (err) {
      console.error('Auth check failed:', err);
      
      // Debug: Show what error we got
      console.debug('[AuthContext] Auth check failed:', err);
      
      // Debug: Show what we're actually sending
      console.debug('[AuthContext] Profile request details:', {
        cookies: document.cookie,
        localStorageToken: localStorage.getItem('auth_token'),
        axiosHeaders: axios.defaults.headers.common,
        withCredentials: axios.defaults.withCredentials
      });
      
      if (isIOSDevice()) {
        // Try manual Authorization header approach
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          console.debug('[AuthContext] Trying manual Authorization header with token');
          
          // Try profile request with manual Authorization header
          try {
            const manualResponse = await axios.get('/user/profile', {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });
            
            if (manualResponse.data) {
              console.debug('[AuthContext] Manual Authorization header worked!');
              setProfile(manualResponse.data);
              return true;
            }
          } catch (manualErr) {
            console.error('[AuthContext] Manual Authorization failed:', manualErr);
          }
        }
      }
      
      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.status === 401) {
          setError("Unauthorized: Invalid or missing token");
        } else if (err.response.status === 404) {
          setError("Profile not found");
        } else {
          setError("An unexpected error occurred");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network error: No response from server");
      } else {
        // Something happened in setting up the request
        setError("Failed to fetch profile: " + err.message);
      }
    } finally {
      setLoading(false); // Mark loading as complete
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
      console.debug('[AuthContext] Attempting login with email:', credentials.email);
      
      // 1. Send login request
      const response = await axios.post('/auth/login', credentials);
      
      // Debug: Show login response
      console.debug('[AuthContext] Login response received:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : []
      });
      
      // Debug logging for production
      const debugInfo = {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        hasHeaders: !!response.headers,
        headerKeys: response.headers ? Object.keys(response.headers) : [],
        hasCookies: !!getCookie('token'),
        isIOS: isIOSDevice()
      };
      
      console.debug('[AuthContext] Debug Info:', debugInfo);
      
      // Debug cookie setting
      if (isIOSDevice() && response.data?.token) {
        console.debug('[AuthContext] Setting cookie for iOS device');
        console.debug('[AuthContext] Token to set:', response.data.token);
        console.debug('[AuthContext] Current cookies before setting:', document.cookie);
        
        // Try multiple cookie setting approaches for iOS
        try {
          // Approach 1: Basic cookie
          setCookie('token', response.data.token, 7);
          console.debug('[AuthContext] Cookie set with basic approach');
          
          // Approach 2: Manual cookie setting with iOS-compatible attributes
          const expires = new Date();
          expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
          document.cookie = `token=${response.data.token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
          console.debug('[AuthContext] Cookie set with manual approach');
          
          // Approach 3: Try without SameSite for iOS
          document.cookie = `token=${response.data.token}; expires=${expires.toUTCString()}; path=/`;
          console.debug('[AuthContext] Cookie set without SameSite');
          
        } catch (err) {
          console.error('[AuthContext] Error setting cookie:', err);
        }
        
        console.debug('[AuthContext] Current cookies after setting:', document.cookie);
      }
      
      console.debug('[AuthContext] Login response:', response);
      console.debug('[AuthContext] Response headers:', response.headers);
      console.debug('[AuthContext] Response data:', response.data);
      
      // 2. Handle iOS device cookie storage
      if (isIOSDevice()) {
        console.debug('[AuthContext] iOS device detected, handling token storage');
        // Check multiple sources for token
        const cookieToken = getCookie('token');
        const responseToken = response.data?.token;
        const headerToken = response.headers['authorization'] || response.headers['Authorization'];
        const token = responseToken || cookieToken || headerToken?.replace('Bearer ', '');
        
        console.debug('[AuthContext] Token sources - cookie:', cookieToken, 'response:', responseToken, 'header:', headerToken);
        
        if (token) {
          console.debug('[AuthContext] Token found for iOS device:', token);
          // Store token in localStorage as backup for iOS devices
          localStorage.setItem('auth_token', token);
          // Set token as cookie instead of Authorization header
          setCookie('token', token, 7);
          // Remove Authorization header since backend expects cookies
          delete axios.defaults.headers.common['Authorization'];
        } else {
          console.warn('[AuthContext] No token found in any source for iOS device');
        }
      } else {
        // Non-iOS devices: Use standard cookie approach
        console.debug('[AuthContext] Non-iOS device, using standard cookie approach');
        if (response.data?.token) {
          localStorage.setItem('auth_token', response.data.token);
          setCookie('token', response.data.token, 7);
        }
      }
      
      // 3. Check authentication status
const authSuccess = await checkAuth();
    if (authSuccess) {
      return { success: true };
    } else {
      return { success: false, errorCode: 'auth_failed' };
    }

  } catch (err) {
    console.error('[AuthContext] Login error:', err);

    if (err.response) {
      return { 
        success: false, 
        errorCode: err.response.status,
        message: err.response.data?.message || ''
      };
    } else if (err.request) {
      return { success: false, errorCode: 'network_error', message: 'Network error' };
    } else {
      return { success: false, errorCode: 'unknown_error', message: err.message };
    }
  } finally {
    setLoading(false);
  }

  }

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setProfile(null);
      setPaymentDetails(null);
              // Clear stored token for iOS devices
        if (isIOSDevice()) {
          localStorage.removeItem('auth_token');
          delete axios.defaults.headers.common['Authorization'];
          // Clear the cookie
          setCookie('token', '', -1); // Expire the cookie
        }
    }
  };

  // Initial authentication check
  useEffect(() => {
    const initAuth = async () => {
      try {
        // For iOS devices, try to restore token from localStorage
        if (isIOSDevice()) {
          const storedToken = localStorage.getItem('auth_token');
          if (storedToken) {
            setCookie('token', storedToken, 7);
            delete axios.defaults.headers.common['Authorization'];
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