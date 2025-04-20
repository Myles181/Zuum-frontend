import { useEffect, useState, useRef, useCallback } from 'react';
import useProfile from './useProfile';
import { usePaymentAccount } from './subscription/useCreateAccount';

export const usePreloadEssentialData = () => {
  // Track mounted state to prevent memory leaks
  const isMounted = useRef(true);
  // Track if we've attempted payment preload
  const paymentPreloadAttempted = useRef(false);
  // Track forced refresh attempts
  const forceRefreshCounter = useRef(0);

  // Initialize hooks
  const { 
    profile: authProfile, 
    loading: authLoading, 
    error: authError,
    refreshProfile  // Assuming this exists or needs to be added to useProfile
  } = useProfile();

  const { 
    paymentDetails, 
    loading: paymentLoading, 
    error: paymentError,
    fetchPaymentDetails,
    resetError: resetPaymentError
  } = usePaymentAccount();

  const [preloadState, setPreloadState] = useState({
    isPreloading: true,
    errors: null
  });

  // Debug logs - remove in production
  useEffect(() => {
    console.log('Auth loading:', authLoading);
    console.log('Payment loading:', paymentLoading);
    console.log('Preload state:', preloadState);
    console.log('Auth profile:', authProfile);
    console.log('Refresh counter:', forceRefreshCounter.current);
  }, [authLoading, paymentLoading, preloadState, authProfile]);

  useEffect(() => {
    return () => {
      isMounted.current = false; // Cleanup on unmount
    };
  }, []);

  // Complete retry function with proper error handling
  const retryPreload = useCallback(async () => {
    if (!isMounted.current) return;
    
    console.log('Retrying preload - refresh attempt #', forceRefreshCounter.current + 1);
    forceRefreshCounter.current += 1;
    
    // Set loading state
    setPreloadState({ isPreloading: true, errors: null });
    
    try {
      // First refresh auth profile - await this to ensure it completes
      await refreshProfile();
      
      // Reset payment error and flags
      resetPaymentError();
      paymentPreloadAttempted.current = false;
      
      // Then fetch payment details
      await fetchPaymentDetails();
      
      if (isMounted.current) {
        // Successfully loaded everything
        setPreloadState({
          isPreloading: false,
          errors: null  // Clear all errors if successful
        });
      }
    } catch (error) {
      console.error('Complete retry preload error:', error);
      if (isMounted.current) {
        setPreloadState({
          isPreloading: false,
          errors: { 
            ...(authError && { auth: authError }),
            ...(error && { payment: error.message })
          }
        });
      }
    }
  }, [refreshProfile, resetPaymentError, fetchPaymentDetails, authError]);

  // Effect to handle initial preloading state
  useEffect(() => {
    // Only update if auth is complete
    if (!authLoading && !paymentPreloadAttempted.current) {
      if (authProfile || authError) {
        setPreloadState(prev => ({ ...prev, isPreloading: false }));
      }
    }
  }, [authLoading, authProfile, authError]);

  // Effect to handle payment preloading
  useEffect(() => {
    // Only attempt payment preload once we have auth status
    if ((authProfile || authError) && !paymentPreloadAttempted.current) {
      paymentPreloadAttempted.current = true;
      
      const loadPaymentData = async () => {
        try {
          if (isMounted.current) {
            setPreloadState(prev => ({ ...prev, isPreloading: true }));
          }

          await fetchPaymentDetails();

          if (isMounted.current) {
            setPreloadState({
              isPreloading: false,
              errors: authError ? { auth: authError } : null
            });
          }
        } catch (error) {
          console.error('Payment preload error:', error);
          if (isMounted.current) {
            setPreloadState({
              isPreloading: false,
              errors: { 
                ...(authError && { auth: authError }),
                payment: error.message 
              }
            });
          }
        }
      };

      loadPaymentData();
    }
  }, [authProfile, authError, fetchPaymentDetails]);

  // Force update preloading state if both auth and payment are done
  useEffect(() => {
    if (!authLoading && !paymentLoading && paymentPreloadAttempted.current && preloadState.isPreloading) {
      setPreloadState(prev => ({ ...prev, isPreloading: false }));
    }
  }, [authLoading, paymentLoading, preloadState.isPreloading]);

  // Handle login refresh trigger from localStorage
  useEffect(() => {
    const checkForRefreshSignal = () => {
      const needsRefresh = localStorage.getItem('needsDataRefresh') === 'true';
      if (needsRefresh) {
        console.log('Found refresh signal from login');
        localStorage.removeItem('needsDataRefresh');
        retryPreload();
      }
    };

    // Check on mount and whenever auth status changes
    checkForRefreshSignal();
    
    // Also set up storage event listener for changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'needsDataRefresh' && e.newValue === 'true') {
        checkForRefreshSignal();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [retryPreload]);

  // Combined loading state with safety check
  const isLoading = authLoading || 
                    (paymentLoading && paymentPreloadAttempted.current) || 
                    preloadState.isPreloading;

  return {
    authProfile,
    paymentDetails,
    isLoading,
    errors: preloadState.errors,
    authLoading,
    paymentLoading,
    preloadIsLoading: preloadState.isPreloading,
    refreshCounter: forceRefreshCounter.current,  // Expose for debugging
    retryPreload
  };
};