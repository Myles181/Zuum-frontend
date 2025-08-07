import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling promotions API operations
 */
export const usePromotions = () => {
  // Data states
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 0
  });

  /**
   * Fetch promotions with filtering and pagination
   */
  const fetchPromotions = useCallback(async (status = null, category = null, limit = 10, offset = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        limit,
        offset
      };
      
      if (status) {
        params.status = status;
      }
      
      if (category) {
        params.category = category;
      }

      const response = await axios.get(`${API_URL}/admin/promotions`, {
        withCredentials: true,
        params
      });

      if (response.status === 200) {
        // Handle different possible response formats
        let promotionsData = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            promotionsData = response.data;
          } else if (response.data.results && Array.isArray(response.data.results)) {
            promotionsData = response.data.results;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            promotionsData = response.data.data;
          } else if (response.data.promotions && Array.isArray(response.data.promotions)) {
            promotionsData = response.data.promotions;
          }
        }
        
        setPromotions(promotionsData);
        
        // Handle pagination data
        if (response.data && response.data.pagination) {
          setPagination(response.data.pagination);
        } else if (response.data && response.data.meta) {
          setPagination({
            currentPage: response.data.meta.current_page || 1,
            total: response.data.meta.total || promotionsData.length,
            totalPages: response.data.meta.last_page || 1
          });
        } else {
          // Default pagination if none provided
          setPagination({
            currentPage: 1,
            total: promotionsData.length,
            totalPages: 1
          });
        }
      }
    } catch (err) {
      console.error('Promotions fetch error:', err);
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Invalid status or category');
            break;
          case 500:
            setError('Internal server error');
            break;
          default:
            setError(err.response.data?.message || 'Failed to fetch promotions');
        }
      } else {
        setError('Network error - please try again');
      }
      
      // If API is not available, use mock data for development
      if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
        console.log('API not available, using mock data for development');
        const mockPromotions = [
          {
            id: 'PROM001',
            title: 'Summer Chart Boost',
            category: 'chart',
            status: 'active',
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            budget: 499.99,
            created_at: '2024-06-15T10:30:00Z',
            start_date: '2024-06-16T00:00:00Z',
            end_date: '2024-07-16T23:59:59Z'
          },
          {
            id: 'PROM002',
            title: 'TikTok Viral Campaign',
            category: 'tiktok',
            status: 'pending',
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com',
            budget: 299.99,
            created_at: '2024-06-14T15:45:00Z',
            start_date: '2024-06-17T00:00:00Z',
            end_date: '2024-07-01T23:59:59Z'
          },
          {
            id: 'PROM003',
            title: 'Radio Airplay',
            category: 'radio',
            status: 'completed',
            customer_name: 'Mike Johnson',
            customer_email: 'mike@example.com',
            budget: 999.99,
            created_at: '2024-06-13T09:15:00Z',
            start_date: '2024-06-01T00:00:00Z',
            end_date: '2024-06-10T23:59:59Z'
          }
        ];
        
        setPromotions(mockPromotions);
        setPagination({
          currentPage: 1,
          total: mockPromotions.length,
          totalPages: 1
        });
        setError('Using demo data - API not available');
      } else {
        // Set empty array to prevent filter errors
        setPromotions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update promotion status
   */
  const updatePromotionStatus = useCallback(async (promotionId, category, status) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${API_URL}/admin/promotions`,
        {
          promotion_id: promotionId,
          category,
          status
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.status === 200) {
        setUpdateSuccess(true);
        
        // Update the local state to reflect the change
        setPromotions(prev => prev.map(p => 
          p.id === promotionId ? { ...p, status } : p
        ));
        
        // Clear success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000);
        
        return true;
      }
      return false;
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Invalid status or category');
            break;
          case 404:
            setError('Promotion not found');
            break;
          case 500:
            setError('Internal server error');
            break;
          default:
            setError(err.response.data?.message || 'Failed to update promotion status');
        }
      } else {
        setError('Network error - please try again');
      }
      return false;
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
          case 404: setError('Promotion not found'); break;
          case 500: setError('Server error - Please try again later'); break;
          default: setError('Failed to fetch promotions');
        }
      } else {
        setError('Network error - Could not connect to server');
      }
    } else {
      setError('An unexpected error occurred');
    }
  }, []);

  /**
   * Reset any API errors
   */
  const resetError = useCallback(() => setError(null), []);

  // Initial fetch when hook is first used
  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return {
    promotions,
    isLoading,
    error,
    pagination,
    updateSuccess,
    fetchPromotions,
    updatePromotionStatus,
    resetError
  };
}; 