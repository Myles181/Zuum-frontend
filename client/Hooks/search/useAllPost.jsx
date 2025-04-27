// useUserPosts.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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
      type: type.toLowerCase() // Ensure consistent type naming
    }));
  };

  // Fetch functions for each post type
  const fetchUserBeats = async () => {
    try {
      setLoading(prev => ({ ...prev, beats: true }));
      setError(prev => ({ ...prev, beats: null }));
      
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token missing');

      const response = await axios.get(`${API_URL}/beat/user-posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle both array and object response formats
      let beatsData = Array.isArray(response.data) ? response.data : 
                     response.data.posts || response.data.data || [];
      
      // Add type to each beat
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
      
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(`${API_URL}/video/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle both array and object response formats
      let videoPosts = Array.isArray(response.data) ? response.data : 
                      response.data.posts || response.data.data || [];
      
      // Add type to each video
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
      
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(`${API_URL}/audio/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle both array and object response formats
      let audioPosts = Array.isArray(response.data) ? response.data : 
                      response.data.posts || response.data.data || [];
      
      // Add type to each audio
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
 * Custom hook for promoting posts (audio, video, or beats)
 * 
 * @returns {Object} An object containing the promotePost function and related state
 */
export const usePromotePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [requestData, setRequestData] = useState(null);

  /**
   * Promotes a post by sending a request to the promotion API
   * 
   * @param {string} postId - The ID of the post to promote
   * @param {string} type - The type of post ('audio', 'video', or 'beat')
   * @returns {Promise<Object|undefined>} The response data if successful
   */
  const promotePost = async (postId, type) => {
    console.debug('[usePromotePost] Starting promotion with parameters:', { postId, type });
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponseData(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Validate post type
      const validTypes = ['audio', 'video', 'beat'];
      if (!validTypes.includes(type)) {
        setError('Invalid post type');
        console.error('[usePromotePost] Invalid post type:', type);
        return;
      }
      
      // Create payload with current timestamp
      const payload = {
        postId: String(postId), // Ensure postId is a string
        type,
        timeline: new Date().toISOString()
      };
      
      // Store and log the request data for debugging
      setRequestData(payload);
      console.log('[usePromotePost] Sending request with payload:', payload);
      console.log('[usePromotePost] API URL:', `${API_URL}/payment/promote`);
      console.log('[usePromotePost] Auth token exists:', !!token);
      
      const response = await axios.post(
        `${API_URL}/payment/promote`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('[usePromotePost] Response received:', response);

      setSuccess(true);
      setResponseData(response.data);
      return response.data;
      
    } catch (err) {
      console.error('[usePromotePost] Error caught:', err);

      // Log request details for debugging
      console.log('[usePromotePost] Request that failed:', {
        url: `${API_URL}/payment/promote`,
        payload: requestData
      });

      if (err.response) {
        console.error('[usePromotePost] Server response error details:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });

        // Handle specific error cases
        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Invalid post type');
            break;
          case 404:
            setError('Post not found');
            break;
          case 406:
            setError('Insufficient funds to promote this post');
            break;
          case 500:
            setError('Server error: The promotion service encountered an issue. Please check your data and try again later.');
            break;
          default:
            setError(`Error ${err.response.status}: ${err.response.data.message || 'An unexpected error occurred'}`);
        }
      } else if (err.request) {
        console.error('[usePromotePost] No response received:', err.request);
        setError('Network error: Unable to connect to the server. Please check your internet connection.');
      } else {
        console.error('[usePromotePost] Request setup error:', err.message);
        setError(`Failed to promote post: ${err.message}`);
      }
      
      // Return the error to allow component-level handling
      return { error: err.message, details: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the hook state
   */
  const reset = () => {
    setError(null);
    setSuccess(false);
    setResponseData(null);
    setRequestData(null);
  };

  return { 
    promotePost, 
    loading, 
    error, 
    success, 
    responseData,
    requestData, // Expose request data for debugging
    reset
  };
};