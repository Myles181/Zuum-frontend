import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContexts';
import Spinner from '../components/Spinner';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, profile, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Additional verification on protected route mount
    const verifyAuth = async () => {
      if (!loading) {
        await checkAuth();
      }
    };
    verifyAuth();
  }, [checkAuth, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;