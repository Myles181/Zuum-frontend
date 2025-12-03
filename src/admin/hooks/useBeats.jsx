import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling admin beat posts operations
 */
export const useBeats = () => {
  const [beats, setBeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
  });

  /**
   * Fetch all beat posts with optional filtering
   * @param {Object} options - Filter options
   * @param {string} options.status - Filter by status (pending, approved, blocked)
   * @param {number} options.limit - Number of posts to retrieve (default: 50)
   * @param {number} options.offset - Number of posts to skip (default: 0)
   */
  const fetchBeats = useCallback(async (options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        limit: options.limit || 50,
        offset: options.offset || 0
      };

      if (options.status) {
        params.status = options.status;
      }

      const response = await axios.get('/admin/beats', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        params
      });

      // Handle different response formats
      const beatsData = response.data?.data || response.data || [];
      setBeats(Array.isArray(beatsData) ? beatsData : []);

      // Handle pagination data
      if (response.data?.pagination) {
        setPagination({
          total: response.data.pagination.total || 0,
          limit: response.data.pagination.limit || params.limit,
          offset: response.data.pagination.offset || params.offset,
          hasMore: response.data.pagination.hasMore || false
        });
      } else {
        setPagination({
          total: Array.isArray(beatsData) ? beatsData.length : 0,
          limit: params.limit,
          offset: params.offset,
          hasMore: false
        });
      }

      return beatsData;
    } catch (err) {
      console.error('Fetch beats error:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'Invalid request parameters');
            break;
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 403:
            setError('Forbidden – insufficient privileges');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(err.response.data?.error || err.response.data?.message || 'Failed to fetch beat posts');
        }
      } else {
        setError('Network error – please check your connection');
      }
      
      setBeats([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update beat post status
   * @param {number|string} postId - The ID of the beat post
   * @param {string} status - New status (pending, approved, blocked)
   */
  const updateBeatStatus = useCallback(async (postId, status) => {
    if (!postId) {
      setError('Post ID is required');
      return null;
    }

    if (!['pending', 'approved', 'blocked'].includes(status)) {
      setError('Invalid status value. Must be: pending, approved, or blocked');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        `/admin/beats/${postId}/status`,
        { status },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // Handle different response formats
      const updatedBeat = response.data?.data || response.data;

      // Update local state
      setBeats(prev => prev.map(beat => 
        beat.id === parseInt(postId) || beat.id === postId
          ? { ...beat, status, ...updatedBeat }
          : beat
      ));

      return updatedBeat;
    } catch (err) {
      console.error('Update beat status error:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'Invalid status value');
            break;
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 403:
            setError('Forbidden – insufficient privileges');
            break;
          case 404:
            setError('Beat post not found');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(err.response.data?.message || 'Failed to update beat post status');
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
   * Delete a beat post
   * @param {number|string} postId - The ID of the beat post to delete
   */
  const deleteBeat = useCallback(async (postId) => {
    if (!postId) {
      setError('Post ID is required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/admin/beats/${postId}`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      // Remove from local state
      setBeats(prev => prev.filter(beat => 
        beat.id !== parseInt(postId) && beat.id !== postId
      ));

      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));

      return true;
    } catch (err) {
      console.error('Delete beat error:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 403:
            setError('Forbidden – insufficient privileges');
            break;
          case 404:
            setError('Beat post not found');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(err.response.data?.message || 'Failed to delete beat post');
        }
      } else {
        setError('Network error – please check your connection');
      }
      
      return false;
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
   * Clear beats data
   */
  const clearBeats = useCallback(() => {
    setBeats([]);
    setError(null);
    setPagination({
      total: 0,
      limit: 50,
      offset: 0,
      hasMore: false
    });
  }, []);

  return {
    beats,
    isLoading,
    error,
    pagination,
    fetchBeats,
    updateBeatStatus,
    deleteBeat,
    resetError,
    clearBeats
  };
};

