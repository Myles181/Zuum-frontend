import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for fetching a user by ID (admin only)
 */
export const useUserById = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user by ID
   * @param {string|number} userId - The ID of the user to fetch
   */
  const fetchUserById = useCallback(async (userId) => {
    if (!userId) {
      setError('User ID is required');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setUser(null);

    try {
      const response = await axios.get(`/admin/users/${userId}`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      // Handle different response formats
      const userData = response.data?.data || response.data?.user || response.data;
      
      if (userData) {
        setUser(userData);
        return userData;
      } else {
        setError('User not found');
        return null;
      }
    } catch (err) {
      console.error('Fetch user by ID error:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'Validation errors');
            break;
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 403:
            setError('Forbidden – insufficient privileges');
            break;
          case 404:
            setError('User not found');
            break;
          case 406:
            setError(err.response.data?.message || 'Email already exists');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(err.response.data?.message || 'Failed to fetch user');
        }
      } else {
        setError('Network error – please check your connection');
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear user data
   */
  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    fetchUserById,
    resetError,
    clearUser
  };
};

