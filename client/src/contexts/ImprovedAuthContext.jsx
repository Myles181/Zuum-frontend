import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

const ImprovedAuthContext = createContext();

export const ImprovedAuthProvider = ({ children }) => {
  // Core authentication states
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Progressive loading states
  const [loadingStates, setLoadingStates] = useState({
    initialCheck: true,
    profile: false,
    payment: false,
    preferences: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    auth: null,
    profile: null,
    payment: null
  });
  
  // Loading progress
  const [loadingProgress, setLoadingProgress] = useState({
    currentStep: 1,
    totalSteps: 4,
    progress: 0,
    stepMessages: [
      "Initializing Zuum...",
      "Loading your profile...",
      "Setting up your workspace...",
      "Almost ready..."
    ]
  });

  // Detect iOS devices
  const isIOSDevice = () => {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua);
  };

  // Get authentication headers
  const getAuthHeaders = () => {
    const headers = {};
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Update loading progress
  const updateProgress = useCallback((step, progress) => {
    setLoadingProgress(prev => ({
      ...prev,
      currentStep: step,
      progress
    }));
  }, []);

  // Check initial authentication
  const checkInitialAuth = useCallback(async () => {
    try {
      updateProgress(1, 25);
      
      const headers = getAuthHeaders();
      const response = await axios.get('/user/profile', {
        headers,
        withCredentials: true
      });

      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        updateProgress(2, 50);
        return true;
      }
    } catch (error) {
      console.error('Initial auth check failed:', error);
      setErrors(prev => ({ ...prev, auth: 'Authentication failed' }));
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoadingStates(prev => ({ ...prev, initialCheck: false }));
    }
    return false;
  }, [updateProgress]);

  // Load user profile
  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, profile: true }));
      updateProgress(2, 50);
      
      const headers = getAuthHeaders();
      const response = await axios.get('/user/profile', {
        headers,
        withCredentials: true
      });

      setUser(response.data);
      updateProgress(3, 75);
    } catch (error) {
      console.error('Profile loading failed:', error);
      setErrors(prev => ({ ...prev, profile: 'Failed to load profile' }));
    } finally {
      setLoadingStates(prev => ({ ...prev, profile: false }));
    }
  }, [isAuthenticated, updateProgress]);

  // Load payment details
  const loadPaymentDetails = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, payment: true }));
      updateProgress(3, 75);
      
      const headers = getAuthHeaders();
      const response = await axios.get('/user/payment-details', {
        headers,
        withCredentials: true
      });

      // Store payment details in user object
      setUser(prev => prev ? { ...prev, paymentDetails: response.data } : null);
      updateProgress(4, 100);
    } catch (error) {
      console.error('Payment details loading failed:', error);
      setErrors(prev => ({ ...prev, payment: 'Failed to load payment details' }));
    } finally {
      setLoadingStates(prev => ({ ...prev, payment: false }));
    }
  }, [isAuthenticated, updateProgress]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoadingStates(prev => ({ ...prev, initialCheck: true }));
      setErrors({ auth: null, profile: null, payment: null });
      updateProgress(1, 25);

      const response = await axios.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      // Check authentication
      const authSuccess = await checkInitialAuth();
      
      if (authSuccess) {
        // Load additional data progressively
        await loadProfile();
        await loadPaymentDetails();
      }

      return authSuccess;
    } catch (error) {
      console.error('Login failed:', error);
      setErrors(prev => ({ 
        ...prev, 
        auth: error.response?.data?.message || 'Login failed' 
      }));
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, initialCheck: false }));
    }
  }, [checkInitialAuth, loadProfile, loadPaymentDetails, updateProgress]);

  // Signup function
  const signup = useCallback(async (userData) => {
    try {
      setLoadingStates(prev => ({ ...prev, initialCheck: true }));
      setErrors({ auth: null, profile: null, payment: null });
      updateProgress(1, 25);

      const response = await axios.post('/auth/signup', userData);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      // Check authentication
      const authSuccess = await checkInitialAuth();
      
      if (authSuccess) {
        // Load additional data progressively
        await loadProfile();
        await loadPaymentDetails();
      }

      return authSuccess;
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors(prev => ({ 
        ...prev, 
        auth: error.response?.data?.message || 'Signup failed' 
      }));
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, initialCheck: false }));
    }
  }, [checkInitialAuth, loadProfile, loadPaymentDetails, updateProgress]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
      setErrors({ auth: null, profile: null, payment: null });
      setLoadingProgress({
        currentStep: 1,
        totalSteps: 4,
        progress: 0,
        stepMessages: [
          "Initializing Zuum...",
          "Loading your profile...",
          "Setting up your workspace...",
          "Almost ready..."
        ]
      });
    }
  }, []);

  // Retry function
  const retry = useCallback(async () => {
    setErrors({ auth: null, profile: null, payment: null });
    setLoadingProgress(prev => ({ ...prev, progress: 0 }));
    
    const authSuccess = await checkInitialAuth();
    if (authSuccess) {
      await loadProfile();
      await loadPaymentDetails();
    }
  }, [checkInitialAuth, loadProfile, loadPaymentDetails]);

  // Initial authentication check
  useEffect(() => {
    checkInitialAuth();
  }, [checkInitialAuth]);

  // Calculate overall loading state
  const isLoading = Object.values(loadingStates).some(state => state);
  const hasErrors = Object.values(errors).some(error => error);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loadingStates,
    loadingProgress,
    errors,
    hasErrors,
    login,
    signup,
    logout,
    retry,
    updateProgress
  };

  return (
    <ImprovedAuthContext.Provider value={value}>
      {children}
    </ImprovedAuthContext.Provider>
  );
};

export const useImprovedAuth = () => {
  const context = useContext(ImprovedAuthContext);
  if (!context) {
    throw new Error('useImprovedAuth must be used within an ImprovedAuthProvider');
  }
  return context;
}; 