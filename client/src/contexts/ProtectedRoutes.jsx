import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContexts';
import Spinner from '../components/Spinner';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check if we're coming from login (flag set in sessionStorage)
    const fromLogin = sessionStorage.getItem('fromLogin') === 'true';
    
    if (token && fromLogin && !loading) {
      // Clear the flag and force full page refresh
      sessionStorage.removeItem('fromLogin');
      window.location.reload();
    }
  }, [token, loading]);

  if (loading) {
    return <div><Spinner /></div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;