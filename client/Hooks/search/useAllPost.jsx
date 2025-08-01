import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Detect iOS devices (including Chrome iOS)
const isIOSDevice = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
};

// Utility function to get authenticated headers
const getAuthHeaders = () => {
  const headers = {};
  // For iOS devices, try to get token from localStorage as backup
  if (isIOSDevice()) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // Enable cookie authentication

export const useUserPosts = () => {
  const [posts, setPosts] = useState({
    beats: [],
    videos: [],
    audios: [],
    allPosts: []
  });
  const [loading, setLoading] = useState({
    beats: true,
    videos: true,
    audios: true
  });
  const [error, setError] = useState({
    beats: null,
    videos: null,
    audios: null
  });

  // Helper function to add type to posts
  const addTypeToPosts = (postsArray, type) => {
    return postsArray.map(post => ({
      ...post,
      type: type.toLowerCase()
    }));
  };

  // Fetch functions for each post type
  const fetchUserBeats = async () => {
    try {
      setLoading(prev => ({ ...prev, beats: true }));
      setError(prev => ({ ...prev, beats: null }));
      
      const response = await axios.get('/beat/user-posts', {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      // Handle both array and object response formats
      let beatsData = Array.isArray(response.data) ? response.data : 
                     response.data.posts || response.data.data || [];
      
      beatsData = addTypeToPosts(beatsData, 'beat');
      
      setPosts(prev => ({
        ...prev,
        beats: beatsData,
        allPosts: [...prev.videos, ...prev.audios, ...beatsData]
      }));
    } catch (err) {
      setError(prev => ({
        ...prev,
        beats: err.response?.data?.error || err.message || 'Failed to fetch beats'
      }));
      console.error('Error fetching beats:', err);
    } finally {
      setLoading(prev => ({ ...prev, beats: false }));
    }
  };

  const fetchUserVideos = async () => {
    try {
      setLoading(prev => ({ ...prev, videos: true }));
      setError(prev => ({ ...prev, videos: null }));
      
      const response = await axios.get('/video/user', {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      let videoPosts = Array.isArray(response.data) ? response.data : 
                      response.data.posts || response.data.data || [];
      
      videoPosts = addTypeToPosts(videoPosts, 'video');
      
      setPosts(prev => ({
        ...prev,
        videos: videoPosts,
        allPosts: [...prev.beats, ...videoPosts, ...prev.audios]
      }));
    } catch (err) {
      setError(prev => ({
        ...prev,
        videos: err.response?.data?.message || err.message || 'Failed to fetch videos'
      }));
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(prev => ({ ...prev, videos: false }));
    }
  };

  const fetchUserAudios = async () => {
    try {
      setLoading(prev => ({ ...prev, audios: true }));
      setError(prev => ({ ...prev, audios: null }));
      
      const response = await axios.get('/audio/user', {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      let audioPosts = Array.isArray(response.data) ? response.data : 
                      response.data.posts || response.data.data || [];
      
      audioPosts = addTypeToPosts(audioPosts, 'audio');
      
      setPosts(prev => ({
        ...prev,
        audios: audioPosts,
        allPosts: [...prev.beats, ...prev.videos, ...audioPosts]
      }));
    } catch (err) {
      setError(prev => ({
        ...prev,
        audios: err.response?.data?.message || err.message || 'Failed to fetch audios'
      }));
      console.error('Error fetching audios:', err);
    } finally {
      setLoading(prev => ({ ...prev, audios: false }));
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUserBeats();
    fetchUserVideos();
    fetchUserAudios();
  }, []);

  // Combined loading state
  const isLoading = loading.beats || loading.videos || loading.audios;

  // Combined error state
  const hasError = error.beats || error.videos || error.audios;

  // Combined empty state
  const isEmpty = !isLoading && 
                 !hasError && 
                 posts.beats.length === 0 && 
                 posts.videos.length === 0 && 
                 posts.audios.length === 0;

  // Refetch all
  const refetchAll = async () => {
    await Promise.all([fetchUserBeats(), fetchUserVideos(), fetchUserAudios()]);
  };

  return {
    // Individual post collections
    beats: posts.beats,
    videos: posts.videos,
    audios: posts.audios,
    
    // Combined collection (all posts mixed together)
    allPosts: posts.allPosts,
    
    // Loading states
    loading: {
      beats: loading.beats,
      videos: loading.videos,
      audios: loading.audios,
      all: isLoading
    },
    
    // Error states
    error: {
      beats: error.beats,
      videos: error.videos,
      audios: error.audios,
      any: hasError
    },
    
    // Utility states
    isEmpty,
    
    // Refetch functions
    refetch: {
      beats: fetchUserBeats,
      videos: fetchUserVideos,
      audios: fetchUserAudios,
      all: refetchAll
    }
  };
};















/**
 * Hook for promoting posts (audio, video, or beats)
 * @returns {Object} Promotion functions and state
 */
export const usePromotePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);

  /**
   * Promote a post
   * @param {string} postId - ID of post to promote
   * @param {'audio'|'video'|'beat'} type - Type of post
   * @returns {Promise<Object>} Response data
   */
  const promotePost = async (postId, type) => {
    // Validate input
    if (!postId || !type) {
      const errMsg = 'Missing required parameters';
      console.error('[usePromotePost] Validation error:', errMsg);
      throw new Error(errMsg);
    }

    const validTypes = ['audio', 'video', 'beat'];
    if (!validTypes.includes(type)) {
      const errMsg = `Invalid type: ${type}. Must be one of: ${validTypes.join(', ')}`;
      console.error('[usePromotePost] Validation error:', errMsg);
      throw new Error(errMsg);
    }

    const payload = {
      postId: String(postId),
      type,
      timeline: new Date().toISOString()
    };

    console.log('[usePromotePost] Starting promotion with payload:', payload);

    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponseData(null);

    try {
      console.log('[usePromotePost] Sending request to /payment/promote');
      const response = await axios.post('/payment/promote', payload, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      console.log('[usePromotePost] Promotion successful:', response.data);
      setSuccess(true);
      setResponseData(response.data);
      return response.data;

    } catch (err) {
      let errorDetails = {
        timestamp: new Date().toISOString(),
        payload,
        error: null
      };

      if (err.response) {
        // Server responded with error status
        errorDetails = {
          ...errorDetails,
          status: err.response.status,
          responseData: err.response.data,
          headers: err.response.headers
        };

        console.error('[usePromotePost] Server error response:', errorDetails);

        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Invalid request');
            break;
          case 404:
            setError('Post not found');
            break;
          case 406:
            setError('Insufficient funds');
            break;
          case 500:
            setError('Server error: ' + (err.response.data.message || 'Please try again later'));
            break;
          default:
            setError(`Error ${err.response.status}: ${err.response.data.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        // No response received
        errorDetails.error = 'No response from server';
        console.error('[usePromotePost] Network error:', errorDetails);
        setError('Network error: Could not connect to server');
      } else {
        // Request setup error
        errorDetails.error = err.message;
        console.error('[usePromotePost] Request error:', errorDetails);
        setError('Request failed: ' + err.message);
      }

      // Log complete error to error tracking service if available
      // logErrorToService(errorDetails);

      throw err; // Re-throw for component to handle
    } finally {
      setLoading(false);
      console.log('[usePromotePost] Request completed');
    }
  };

  /**
   * Reset hook state
   */
  const reset = () => {
    setError(null);
    setSuccess(false);
    setResponseData(null);
  };

  return {
    promotePost,
    loading,
    error,
    success,
    responseData,
    reset
  };
};

















/**
 * Hook for submitting music distribution requests with specific error handling
 * @returns {Object} Distribution functions and state
 */
export const useDistributionRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);

  /**
   * Submit a distribution request with enhanced error handling
   * @param {Object} formData - Complete distribution form data
   * @returns {Promise<Object>} Response data
   */
  const submitDistributionRequest = async (formData) => {
    console.groupCollapsed('[Distribution] Submission Started');
    console.log('Form data:', formData);
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponseData(null);

    try {
      // Validate required files before submission
      if (!formData.coverArt) {
        throw { code: 'MISSING_COVER', message: 'Cover art is required' };
      }

      if (formData.releaseType === 'single' && !formData.audioFile) {
        throw { code: 'MISSING_AUDIO', message: 'Audio file is required for singles' };
      }

      if (formData.releaseType === 'album' && formData.tracks.some(t => !t.audioFile)) {
        throw { code: 'MISSING_TRACKS', message: 'All album tracks require audio files' };
      }

      const submitData = new FormData();
      // Build form data (same as before)
      // ... [previous form data construction code] ...

      console.log('Submitting to /user/distribution-request');
      const response = await axios.post('/user/distribution-request', submitData, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (response.data.message === "Music Distribution request successful") {
        console.log('Distribution successful:', response.data);
        setSuccess(true);
        setResponseData(response.data);
        return response.data;
      } else {
        throw { 
          code: 'UNEXPECTED_RESPONSE', 
          message: 'Received unexpected success response',
          response 
        };
      }

    } catch (err) {
      let errorMessage = 'Submission failed';
      let errorCode = 'UNKNOWN_ERROR';

      // Handle axios errors
      if (err.response) {
        console.error('Server responded with error:', err.response.data);
        
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data.message || 'Required fields missing';
            errorCode = 'VALIDATION_ERROR';
            break;
            
          case 406:
            errorMessage = err.response.data.message || 'Invalid file format or metadata';
            errorCode = 'INVALID_FORMAT';
            
            // Special handling for specific 406 messages
            if (err.response.data.message.includes('MP3')) {
              errorCode = 'INVALID_AUDIO_FORMAT';
            } else if (err.response.data.message.includes('cover photo')) {
              errorCode = 'INVALID_COVER_FORMAT';
            }
            break;
            
          case 409:
            errorMessage = 'Insufficient funds for distribution';
            errorCode = 'INSUFFICIENT_FUNDS';
            break;
            
          case 500:
            errorMessage = err.response.data.error || 'Internal server error';
            errorCode = 'SERVER_ERROR';
            break;
            
          default:
            errorMessage = `Error ${err.response.status}: ${err.response.data.message || 'Unknown error'}`;
        }
      } 
      // Handle network errors
      else if (err.request) {
        errorMessage = 'Network error: Could not connect to server';
        errorCode = 'NETWORK_ERROR';
        console.error('No response received:', err.request);
      } 
      // Handle custom validation errors
      else if (err.code) {
        errorMessage = err.message;
        errorCode = err.code;
      }
      // Handle all other errors
      else {
        errorMessage = err.message || 'Unknown error occurred';
        console.error('Unexpected error:', err);
      }

      setError({ message: errorMessage, code: errorCode });
      throw { code: errorCode, message: errorMessage, originalError: err };
      
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  return {
    submitDistributionRequest,
    loading,
    error,
    success,
    responseData,
    reset: () => {
      setError(null);
      setSuccess(false);
      setResponseData(null);
    }
  };
};











export const usePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/packages', {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      // Handle both array and object response formats
      let packagesData = Array.isArray(response.data) ? response.data : 
                       response.data.packages || response.data.data || [];
      
      setPackages(packagesData);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    error,
    refetch: fetchPackages // Option to manually refetch
  };
};






export const useMassPromotion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createPromotion = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      // Validate category first
      const validCategories = ['print', 'tv', 'radio', 'chart', 'digital', 'playlist', 'international'];
      if (!formData.category || !validCategories.includes(formData.category)) {
        throw new Error('Invalid category');
      }

      // Prepare form data for file uploads
      const postData = new FormData();
      
      // Add common fields
      postData.append('category', formData.category);
      postData.append('package_id', formData.package_id);

      // Add category-specific fields
      switch (formData.category) {
        case 'print':
        case 'international':
          postData.append('title', formData.title);
          postData.append('body', formData.body);
          if (formData.description) postData.append('description', formData.description);
          postData.append('image', formData.image);
          break;
        case 'tv':
          postData.append('title', formData.title);
          postData.append('biography', formData.biography);
          postData.append('hd_video', formData.hd_video);
          break;
        case 'radio':
        case 'chart':
        case 'playlist':
          postData.append('song_link', formData.song_link);
          break;
        case 'digital':
          postData.append('artist_name', formData.artist_name);
          postData.append('biography', formData.biography);
          postData.append('artist_photo', formData.artist_photo);
          break;
        default:
          throw new Error('Unsupported category');
      }

            const response = await axios.post('/promotions/mass', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });
          // Cookies will be sent automatically if withCredentials is true
        },
        withCredentials: true // This ensures cookies are included
      });

      setData(response.data);
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Failed to create promotion';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPromotion,
    loading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    }
  };
};












export const useUserPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0
  });

  const fetchPromotions = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/packages/myPromotions', {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
        params: {
          limit: pagination.limit,
          offset: pagination.offset,
          ...params
        },
        withCredentials: true
      });

      setPromotions(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const refetch = (params) => {
    fetchPromotions(params);
  };

  const loadMore = () => {
    if (pagination.offset + pagination.limit < pagination.total) {
      setPagination(prev => ({
        ...prev,
        offset: prev.offset + prev.limit
      }));
      fetchPromotions();
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [pagination.offset, pagination.limit]);

  return {
    promotions,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
    setLimit: (limit) => setPagination(prev => ({ ...prev, limit, offset: 0 }))
  };
};