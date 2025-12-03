import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContexts';
import SubscriptionPopup from '../components/subscription/Popup';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSubscribed, setIsSubscribed] = useState(null); // null = not checked yet
  const [showPopup, setShowPopup] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [lastPathname, setLastPathname] = useState('');

  // Check subscription status from profile
  const checkSubscriptionStatus = useCallback(() => {
    if (!profile) {
      console.log('[SubscriptionContext] No profile yet');
      setIsSubscribed(null);
      return;
    }

    console.log('[SubscriptionContext] Checking subscription status:', {
      subscription_status: profile.subscription_status,
      subscriptionStatus: profile.subscriptionStatus,
      is_subscribed: profile.is_subscribed,
      isSubscribed: profile.isSubscribed,
      subscription_plan_id: profile.subscription_plan_id,
      subscriptionPlanId: profile.subscriptionPlanId,
      subscription: profile.subscription,
    });

    // Check various possible subscription fields in profile
    // User is subscribed ONLY if subscription_status is explicitly 'active'
    // If subscription_status is null, undefined, 'inactive', or any other value, user is NOT subscribed
    const hasSubscription = Boolean(
      profile.subscription_status === 'active' ||
      profile.subscriptionStatus === 'active' ||
      profile.is_subscribed === true ||
      profile.isSubscribed === true ||
      (profile.subscription_plan_id !== null && profile.subscription_plan_id !== undefined && profile.subscription_plan_id !== '') ||
      (profile.subscriptionPlanId !== null && profile.subscriptionPlanId !== undefined && profile.subscriptionPlanId !== '') ||
      (profile.subscription !== null && profile.subscription !== undefined) ||
      (profile.subscription && profile.subscription.status === 'active')
    );

    // Explicitly set to false if subscription_status is null or any non-active value
    const isSubscribedValue = hasSubscription ? true : false;

    console.log('[SubscriptionContext] Has subscription:', hasSubscription);
    console.log('[SubscriptionContext] Setting isSubscribed to:', isSubscribedValue);

    // Always set the status to a boolean (true or false)
    setIsSubscribed(isSubscribedValue);
    setLastChecked(Date.now());

    // Get subscription plan details if available
    if (profile.subscription || profile.subscription_plan || profile.paymentDetails) {
      const plan = profile.subscription?.plan || 
                   profile.subscription_plan || 
                   profile.paymentDetails?.plan ||
                   profile.paymentDetails;
      setSubscriptionPlan(plan);
    }
  }, [profile]);

  // Check subscription status when profile changes
  useEffect(() => {
    if (profile) {
      console.log('[SubscriptionContext] Profile available, checking subscription status');
      checkSubscriptionStatus();
    } else {
      console.log('[SubscriptionContext] Profile not available yet');
      setIsSubscribed(null);
    }
  }, [profile, checkSubscriptionStatus]);

  // List of paths where popup should not show at all
  const excludedPaths = [
    '/subscribe',
    '/login',
    '/signup',
    '/forgot',
    '/reset',
    '/verify',
    '/start',
    '/',
    '/adlog',
    '/adsin',
    '/adver',
  ];

  // Only show subscription popup logic on the Jet page
  const isJetPage = location.pathname === '/jet';

  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Show popup if user is not subscribed and tries to access a page
  useEffect(() => {
    console.log('[SubscriptionContext] Location changed:', {
      pathname: location.pathname,
      isSubscribed,
      lastPathname,
      showPopup,
      isAdminRoute,
      isJetPage,
    });

    // Only consider showing popup on the Jet page
    // Also never show on excluded paths, admin routes, or if already subscribed
    if (
      !isJetPage ||
      excludedPaths.includes(location.pathname) ||
      isAdminRoute ||
      isSubscribed === true
    ) {
      console.log(
        '[SubscriptionContext] Hiding popup - not Jet page, excluded path, admin route, or subscribed'
      );
      setShowPopup(false);
      setLastPathname(location.pathname);
      return;
    }

    // Don't show popup if status hasn't been checked yet
    if (isSubscribed === null) {
      console.log('[SubscriptionContext] Status not checked yet');
      return;
    }

    // Show popup if not subscribed (either on initial load or pathname change)
    if (isSubscribed === false) {
      // Show on initial load (lastPathname is empty) or when pathname changes on Jet page
      if (lastPathname === '' || location.pathname !== lastPathname) {
        console.log('[SubscriptionContext] Showing popup on Jet page - not subscribed');
        setShowPopup(true);
        setLastPathname(location.pathname);
      }
    }
  }, [location.pathname, isSubscribed, lastPathname, showPopup, isAdminRoute, isJetPage]);


  // Handle popup close
  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  // Handle navigation to subscribe page
  const handleSubscribeClick = useCallback(() => {
    setShowPopup(false);
    navigate('/subscribe');
  }, [navigate]);

  // Force check subscription status (useful after subscription changes)
  const refreshSubscriptionStatus = useCallback(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const value = {
    isSubscribed,
    showPopup,
    subscriptionPlan,
    handleClosePopup,
    handleSubscribeClick,
    refreshSubscriptionStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
      {showPopup && (
        <SubscriptionPopup 
          onClose={handleClosePopup}
          details={subscriptionPlan || { name: 'premium' }}
        />
      )}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

