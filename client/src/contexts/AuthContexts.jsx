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

  // Main authentication check - fetches profile
  const checkAuth = useCallback(async () => {
    try {
              // For iOS devices, try to get token from cookie first
        if (isIOSDevice()) {
          const token = getCookie('token');
          if (token) {
            // Ensure cookie is set for iOS devices
            setCookie('token', token, 7);
            delete axios.defaults.headers.common['Authorization'];
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
      
      // Show debug info in production (remove this after debugging)
      if (isIOSDevice()) {
        alert(`Debug Info: ${JSON.stringify(debugInfo, null, 2)}`);
      }
      
      // Show complete response data for debugging
      if (isIOSDevice()) {
        const fullResponseData = {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
          cookies: document.cookie,
          localStorage: localStorage.getItem('auth_token')
        };
        alert(`FULL RESPONSE DATA:\n${JSON.stringify(fullResponseData, null, 2)}`);
      }
      
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
          // Try to extract token from response body if it exists
          if (response.data && typeof response.data === 'object') {
            console.debug('[AuthContext] Response data keys:', Object.keys(response.data));
            // Look for common token field names
            const possibleTokenFields = ['token', 'access_token', 'auth_token', 'jwt', 'accessToken'];
            for (const field of possibleTokenFields) {
              if (response.data[field]) {
                console.debug('[AuthContext] Found token in field:', field, response.data[field]);
                localStorage.setItem('auth_token', response.data[field]);
                setCookie('token', response.data[field], 7);
                delete axios.defaults.headers.common['Authorization'];
                break;
              }
            }
          }
        }
      }
      
      // 3. Verify auth by fetching profile
      const isAuthenticated = await checkAuth();
      
      if (!isAuthenticated) {
        // WORKAROUND: Try direct profile fetch since server should have set auth cookies
        console.debug('[AuthContext] Auth check failed, trying direct profile fetch with server cookies');
        try {
          // Make a fresh request that should include the cookies set by the server
          const profileResponse = await axios.get('/user/profile', {
            withCredentials: true // Ensure cookies are sent
          });
          if (profileResponse.data) {
            console.debug('[AuthContext] Direct profile fetch succeeded - server cookies worked');
            setProfile(profileResponse.data);
            // If this worked, the server must have set auth cookies properly
            await fetchPaymentDetails();
            return; // Success, don't throw error
          }
        } catch (profileErr) {
          console.debug('[AuthContext] Direct profile fetch also failed:', profileErr);
          
          // Try one more approach - make request with explicit cookie
          if (isIOSDevice() && response.data?.token) {
            console.debug('[AuthContext] Trying request with explicit cookie header');
            try {
              const profileResponse2 = await axios.get('/user/profile', {
                headers: {
                  'Cookie': `token=${response.data.token}`
                },
                withCredentials: true
              });
              if (profileResponse2.data) {
                console.debug('[AuthContext] Profile fetch with explicit cookie succeeded');
                setProfile(profileResponse2.data);
                await fetchPaymentDetails();
                return;
              }
            } catch (explicitErr) {
              console.debug('[AuthContext] Explicit cookie approach also failed:', explicitErr);
            }
          }
          
          // Show error to user about iOS cookie issue
          if (isIOSDevice()) {
            alert('iOS Cookie Issue: The server sets authentication cookies, but iOS has restrictions. Please try using Safari or contact support.');
          }
        }
        
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