import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Admin hook for managing audio posts
 *
 * Endpoints:
 * - GET    /api/admin/audio                 → fetch audio posts
 * - PATCH  /api/admin/audio/{postId}/status → update status
 * - DELETE /api/admin/audio/{postId}        → delete post
 */
export const useAudio = () => {
  const [audioPosts, setAudioPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  /**
   * Fetch audio posts with optional filters
   * @param {Object} options
   * @param {'pending'|'approved'|'blocked'|string} [options.status]
   * @param {string} [options.type] - e.g. "music"
   * @param {number} [options.limit=50]
   * @param {number} [options.offset=0]
   */
  const fetchAudioPosts = useCallback(async (options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        limit: options.limit ?? 50,
        offset: options.offset ?? 0,
      };

      if (options.status) params.status = options.status;
      if (options.type) params.type = options.type;

      const response = await axios.get('/admin/audio', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const data = response.data?.data || response.data || [];
      const posts = Array.isArray(data) ? data : [];

      setAudioPosts(posts);

      if (response.data?.pagination) {
        setPagination({
          total: response.data.pagination.total ?? posts.length,
          limit: response.data.pagination.limit ?? params.limit,
          offset: response.data.pagination.offset ?? params.offset,
          hasMore: Boolean(response.data.pagination.hasMore),
        });
      } else {
        setPagination({
          total: posts.length,
          limit: params.limit,
          offset: params.offset,
          hasMore: false,
        });
      }

      return posts;
    } catch (err) {
      console.error('Fetch audio posts error:', err);

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
            setError(
              err.response.data?.error ||
                err.response.data?.message ||
                'Failed to fetch audio posts',
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      setAudioPosts([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update audio post status
   * @param {number|string} postId
   * @param {'pending'|'approved'|'blocked'|string} status
   */
  const updateAudioStatus = useCallback(async (postId, status) => {
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
        `/admin/audio/${postId}/status`,
        { status },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const updated = response.data?.data || response.data;

      setAudioPosts(prev =>
        prev.map(post =>
          post.id === Number(postId) || post.id === postId
            ? { ...post, status, ...updated }
            : post,
        ),
      );

      return updated;
    } catch (err) {
      console.error('Update audio status error:', err);

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
            setError('Audio post not found');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
                'Failed to update audio post status',
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
   * Delete an audio post
   * @param {number|string} postId
   */
  const deleteAudioPost = useCallback(async postId => {
    if (!postId) {
      setError('Post ID is required');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axios.delete(`/admin/audio/${postId}`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      setAudioPosts(prev =>
        prev.filter(
          post => post.id !== Number(postId) && post.id !== postId,
        ),
      );

      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      return true;
    } catch (err) {
      console.error('Delete audio post error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 403:
            setError('Forbidden – insufficient privileges');
            break;
          case 404:
            setError('Audio post not found');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
                'Failed to delete audio post',
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

  /** Clear posts and pagination */
  const clearAudioPosts = useCallback(() => {
    setAudioPosts([]);
    setError(null);
    setPagination({
      total: 0,
      limit: 50,
      offset: 0,
      hasMore: false,
    });
  }, []);

  return {
    audioPosts,
    isLoading,
    error,
    pagination,
    fetchAudioPosts,
    updateAudioStatus,
    deleteAudioPost,
    resetError,
    clearAudioPosts,
  };
};


