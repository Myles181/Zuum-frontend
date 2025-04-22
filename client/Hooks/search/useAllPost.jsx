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








export const usePromotePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const promotePost = async (postId, type) => {
    console.debug('[usePromotePost] Starting promotion', { postId, type });
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponseData(null);

    try {
      const token = localStorage.getItem('authToken');
      console.debug('[usePromotePost] Retrieved token:', token);

      // Validate post type
      const validTypes = ['audio', 'video', 'beat'];
      if (!validTypes.includes(type)) {
        throw new Error('Invalid post type');
      }

      const response = await axios.post(
        `${API_URL}/payment/promote`,
        { postId, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.debug('[usePromotePost] Response received:', response);

      if (response.status === 200) {
        setSuccess(true);
        setResponseData(response.data);
        console.debug('[usePromotePost] Post promoted successfully:', response.data);
        return response.data;
      } else {
        setError('An unexpected response was received');
        console.error('[usePromotePost] Unexpected status code:', response.status, response.data);
      }
    } catch (err) {
      console.error('[usePromotePost] Error caught:', err);

      if (err.response) {
        console.error('[usePromotePost] Server response error:', {
          status: err.response.status,
          data: err.response.data
        });

        switch (err.response.status) {
          case 400:
            setError(err.response.data.message || 'Invalid post type');
            break;
          case 404:
            setError('Post not found');
            break;
          case 406:
            setError('Insufficient funds');
            break;
          case 500:
            setError('Server error: Please try again later');
            break;
          default:
            setError('An unexpected error occurred');
        }
      } else if (err.request) {
        console.error('[usePromotePost] No response received:', err.request);
        setError('Network error: No response from server');
      } else {
        console.error('[usePromotePost] Request setup error:', err.message);
        setError('Failed to promote post: ' + err.message);
      }
    } finally {
      setLoading(false);
      console.debug('[usePromotePost] promotePost finished, loading=false');
    }
  };

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