import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Admin hook for managing announcements
 *
 * Endpoints:
 * - GET    /api/admin/announcements              → fetch announcements list
 * - POST   /api/admin/announcements              → create announcement
 * - DELETE /api/admin/announcements/{id}         → delete announcement
 */
export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  /**
   * Fetch announcements list with pagination
   * @param {Object} options
   * @param {number} [options.limit=20]
   * @param {number} [options.offset=0]
   */
  const fetchAnnouncements = useCallback(async (options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        limit: options.limit ?? 20,
        offset: options.offset ?? 0,
      };

      const response = await axios.get('/admin/announcements', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const data = response.data?.data || response.data?.announcements || response.data || [];
      const announcementsList = Array.isArray(data) ? data : [];

      setAnnouncements(announcementsList);

      if (response.data?.pagination) {
        setPagination({
          total: response.data.pagination.total ?? announcementsList.length,
          limit: response.data.pagination.limit ?? params.limit,
          offset: response.data.pagination.offset ?? params.offset,
          hasMore: Boolean(response.data.pagination.hasMore),
        });
      } else {
        setPagination({
          total: announcementsList.length,
          limit: params.limit,
          offset: params.offset,
          hasMore: false,
        });
      }

      return announcementsList;
    } catch (err) {
      console.error('Fetch announcements error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.error ||
              err.response.data?.message ||
              'Failed to fetch announcements'
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      setAnnouncements([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new announcement
   * @param {string} content - Announcement content (required)
   */
  const createAnnouncement = useCallback(async (content) => {
    if (!content || !content.trim()) {
      setError('Content is required');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/admin/announcements', 
        { content: content.trim() },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const createdAnnouncement = response.data?.data || response.data?.announcement || response.data;

      // Add the new announcement to the beginning of the list
      if (createdAnnouncement) {
        setAnnouncements(prev => [createdAnnouncement, ...prev]);

        setPagination(prev => ({
          ...prev,
          total: prev.total + 1,
        }));
      }

      setSuccess('Announcement sent successfully');
      setTimeout(() => setSuccess(null), 3000);

      return createdAnnouncement;
    } catch (err) {
      console.error('Create announcement error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'Content is required');
            break;
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
              'Failed to create announcement'
            );
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
   * Delete an announcement
   * @param {number|string} announcementId - Announcement ID (required)
   */
  const deleteAnnouncement = useCallback(async (announcementId) => {
    if (!announcementId) {
      setError('Announcement ID is required');
      return false;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.delete(`/admin/announcements/${announcementId}`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      // Remove the deleted announcement from local state
      setAnnouncements(prev =>
        prev.filter(
          item => item.id !== Number(announcementId) && item.id !== announcementId
        )
      );

      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      setSuccess('Announcement deleted successfully');
      setTimeout(() => setSuccess(null), 3000);

      return true;
    } catch (err) {
      console.error('Delete announcement error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 404:
            setError('Announcement not found');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
              'Failed to delete announcement'
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Reset error state */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  /** Reset success state */
  const resetSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  /** Clear announcements and pagination */
  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
    setError(null);
    setSuccess(null);
    setPagination({
      total: 0,
      limit: 20,
      offset: 0,
      hasMore: false,
    });
  }, []);

  return {
    announcements,
    isLoading,
    error,
    success,
    pagination,
    fetchAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    resetError,
    resetSuccess,
    clearAnnouncements,
  };
};
