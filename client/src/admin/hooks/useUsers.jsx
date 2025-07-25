import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // Enable cookie authentication

/**
 * Custom hook for handling admin-related API operations
 */
export const useAdmins = () => {
  // User data states
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 0
  });
  const [deactivationSuccess, setDeactivationSuccess] = useState(false);

  /**
   * Fetch all users with pagination
   */
  const fetchUsers = useCallback(async (page = 1) => {
    console.log('Fetching users for page:', page);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Making API call to /admin/users');
      const response = await axios.get('/admin/users', {
        params: { page },
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('API response:', response);
      
      if (response.status === 200) {
        setUsers(response.data.users || response.data);
        
        // Set pagination if available in response
        if (response.data.currentPage && response.data.total && response.data.totalPages) {
          setPagination({
            currentPage: response.data.currentPage,
            total: response.data.total,
            totalPages: response.data.totalPages
          });
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle API errors with appropriate messages
   */
  const handleApiError = useCallback((err) => {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        switch (err.response.status) {
          case 400: setError('Validation error: Invalid request'); break;
          case 401: setError('Unauthorized - Please login again'); break;
          case 403: setError('Forbidden - You lack necessary permissions'); break;
          case 500: setError('Server error - Please try again later'); break;
          default: setError('Failed to fetch users');
        }
      } else {
        setError('Network error - Could not connect to server');
      }
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  /**
   * Deactivate a user
   */
  const deactivateUser = useCallback(async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        '/admin/auth/deactivate',
        { userId },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.status === 200) {
        setDeactivationSuccess(true);
        
        // After successful deactivation, refetch the users
        setTimeout(() => {
          fetchUsers(pagination.currentPage);
          setDeactivationSuccess(false);
        }, 2000);
        
        return true;
      }
      return false;
    } catch (err) {
      handleApiError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers, pagination.currentPage, handleApiError]);

  /**
   * Reset any API errors
   */
  const resetError = useCallback(() => setError(null), []);

  // Initial fetch when hook is first used
  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  return { 
    users, 
    isLoading, 
    error, 
    pagination, 
    deactivationSuccess,
    fetchUsers,
    deactivateUser,
    resetError
  };
};