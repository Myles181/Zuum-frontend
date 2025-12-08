import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Admin hook for managing news
 *
 * Endpoints:
 * - GET    /api/admin/news           → fetch news list
 * - POST   /api/admin/news           → create news (multipart/form-data)
 * - PUT    /api/admin/news/{newsId}  → update news (multipart/form-data)
 * - DELETE /api/admin/news/{newsId}  → delete news
 */
export const useNews = () => {
  const [news, setNews] = useState([]);
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
   * Fetch news list with pagination
   * @param {Object} options
   * @param {number} [options.limit=20]
   * @param {number} [options.offset=0]
   */
  const fetchNews = useCallback(async (options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        limit: options.limit ?? 20,
        offset: options.offset ?? 0,
      };

      const response = await axios.get('/admin/news', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const data = response.data?.data || response.data || [];
      const newsList = Array.isArray(data) ? data : [];

      setNews(newsList);

      if (response.data?.pagination) {
        setPagination({
          total: response.data.pagination.total ?? newsList.length,
          limit: response.data.pagination.limit ?? params.limit,
          offset: response.data.pagination.offset ?? params.offset,
          hasMore: Boolean(response.data.pagination.hasMore),
        });
      } else {
        setPagination({
          total: newsList.length,
          limit: params.limit,
          offset: params.offset,
          hasMore: false,
        });
      }

      return newsList;
    } catch (err) {
      console.error('Fetch news error:', err);

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
              'Failed to fetch news'
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      setNews([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new news entry
   * @param {Object} newsData
   * @param {string} newsData.title - News title (required)
   * @param {string} newsData.content - News content (required)
   * @param {File} [newsData.image] - News image file (optional)
   */
  const createNews = useCallback(async (newsData) => {
    if (!newsData.title || !newsData.content) {
      setError('Title and content are required');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('title', newsData.title);
      formData.append('content', newsData.content);

      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      const response = await axios.post('/admin/news', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const createdNews = response.data?.data || response.data;

      // Add the new news to the beginning of the list
      setNews(prev => [createdNews, ...prev]);

      setPagination(prev => ({
        ...prev,
        total: prev.total + 1,
      }));

      setSuccess('News created successfully');
      setTimeout(() => setSuccess(null), 3000);

      return createdNews;
    } catch (err) {
      console.error('Create news error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'Missing required fields');
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
              'Failed to create news'
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
   * Update an existing news entry
   * @param {number|string} newsId - News ID (required)
   * @param {Object} newsData
   * @param {string} [newsData.title] - News title
   * @param {string} [newsData.content] - News content
   * @param {File} [newsData.image] - News image file
   */
  const updateNews = useCallback(async (newsId, newsData) => {
    if (!newsId) {
      setError('News ID is required');
      return null;
    }

    if (!newsData.title && !newsData.content && !newsData.image) {
      setError('At least one field is required to update');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();

      if (newsData.title) {
        formData.append('title', newsData.title);
      }
      if (newsData.content) {
        formData.append('content', newsData.content);
      }
      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      const response = await axios.put(`/admin/news/${newsId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedNews = response.data?.data || response.data;

      // Update the news in the local state
      setNews(prev =>
        prev.map(item =>
          item.id === Number(newsId) || item.id === newsId
            ? { ...item, ...updatedNews }
            : item
        )
      );

      setSuccess('News updated successfully');
      setTimeout(() => setSuccess(null), 3000);

      return updatedNews;
    } catch (err) {
      console.error('Update news error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'No fields to update');
            break;
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 404:
            setError('News not found');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
              'Failed to update news'
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
   * Delete a news entry
   * @param {number|string} newsId - News ID (required)
   */
  const deleteNews = useCallback(async (newsId) => {
    if (!newsId) {
      setError('News ID is required');
      return false;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.delete(`/admin/news/${newsId}`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      // Remove the deleted news from local state
      setNews(prev =>
        prev.filter(
          item => item.id !== Number(newsId) && item.id !== newsId
        )
      );

      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      setSuccess('News deleted successfully');
      setTimeout(() => setSuccess(null), 3000);

      return true;
    } catch (err) {
      console.error('Delete news error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 404:
            setError('News not found');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.message ||
              'Failed to delete news'
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

  /** Clear news and pagination */
  const clearNews = useCallback(() => {
    setNews([]);
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
    news,
    isLoading,
    error,
    success,
    pagination,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    resetError,
    resetSuccess,
    clearNews,
  };
};
