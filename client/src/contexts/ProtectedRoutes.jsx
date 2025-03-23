import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContexts';
import Spinner from '../components/Spinner';


const ProtectedRoute = () => {
  const { token, loading } = useAuth(); // Check if the user is authenticated

  if (loading) {
    return <div><Spinner /></div>; // Show a loading spinner while checking auth state
  }

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if the user is not authenticated
  }

  return <Outlet />; // Render the child routes if the user is authenticated
};

export default ProtectedRoute;