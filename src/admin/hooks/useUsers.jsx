import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_PAGE_SIZE = 200;

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
    totalPages: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [deactivationSuccess, setDeactivationSuccess] = useState(false);

  /**
   * Fetch all users with pagination
   */
  const fetchUsers = useCallback(async (page = 1, limit = DEFAULT_PAGE_SIZE) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/admin/users`, {
        withCredentials: true,
        params: { page, limit }
      });

      if (response.status === 200) {
        const payloadUsers = response.data.users || [];
        const apiPagination = response.data.pagination || {};
        const total = apiPagination.total ?? payloadUsers.length ?? 0;
        const resolvedLimit = apiPagination.pageSize ?? limit;
        const derivedTotalPages = apiPagination.totalPages ?? Math.max(1, Math.ceil(total / resolvedLimit || 1));

        setUsers(payloadUsers);
        setPagination({
          currentPage: apiPagination.currentPage ?? page,
          total,
          totalPages: derivedTotalPages,
          pageSize: resolvedLimit,
        });
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Failed to fetch users');
      } else {
        setError('Network error - please try again');
      }
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
          fetchUsers(
            pagination.currentPage,
            pagination.pageSize || DEFAULT_PAGE_SIZE
          );
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

  useEffect(() => {
    fetchUsers(1, DEFAULT_PAGE_SIZE);
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