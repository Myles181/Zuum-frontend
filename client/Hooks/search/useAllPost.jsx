import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
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
      
      const response = await axios.get('/beat/user-posts');

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
      
      const response = await axios.get('/video/user');

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
      
      const response = await axios.get('/audio/user');

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
      const response = await axios.post('/payment/promote', payload);

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
      const response = await axios.post('/user/distribution-request', submitData);

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








