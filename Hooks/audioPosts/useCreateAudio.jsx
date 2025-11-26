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

// Hook for creating a new audio post with cookies
export const useCreateAudioPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createAudioPost = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('/audio/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        setSuccess(true);
        return response.data;
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.message || 'Validation error or missing files');
        } else if (err.response.status === 401) {
          setError('Unauthorized: Please log in');
        } else if (err.response.status === 500) {
          setError('Server error: Please try again later');
        } else {
          setError('An unexpected error occurred');
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Failed to create audio post: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { createAudioPost, loading, error, success };
};

// Hook for fetching audio posts with cookies
const useAudioPosts = (page = 1, limit = 10, postId = null, userId = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: page,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    const fetchAudioPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (postId) {
          response = await axios.get(`/audio/${postId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
        } else if (userId) {
                      response = await axios.get(`/audio/user/${userId}`, {
              params: { page, limit },
              headers: getAuthHeaders(),
              withCredentials: true,
            });
        } else {
                      response = await axios.get('/audio/', {
              params: { page, limit },
              headers: getAuthHeaders(),
              withCredentials: true,
            });
        }

        if (response.status === 200) {
          if (postId) {
            setPosts([response.data.post]);
            setPagination({
              total: 1,
              totalPages: 1,
              currentPage: 1,
              hasNext: false,
              hasPrev: false,
            });
          } else {
            const { posts, pagination } = response.data;
            setPosts(posts);
            setPagination({
              total: pagination.total,
              totalPages: pagination.totalPages,
              currentPage: pagination.currentPage,
              hasNext: pagination.hasNext,
              hasPrev: pagination.hasPrev,
            });
          }
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            setError("Unauthorized: Please log in");
          } else if (err.response.status === 404) {
            setError("Post not found");
          } else {
            setError(err.response.data?.message || "An error occurred");
          }
        } else if (err.request) {
          setError("Network error: No response from server");
        } else {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAudioPosts();
  }, [page, limit, postId, userId]);

  return { loading, error, posts, pagination };
};

// Hook for getting a single audio post with cookies
export const useGetAudioPost = (postId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchAudioPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/audio/${postId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (response.status === 200) {
        setData(response.data.post);
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError('Audio post not found');
        } else if (err.response.status === 401) {
          setError('Unauthorized: Please log in');
        } else if (err.response.status === 500) {
          setError('Server error: Please try again later');
        } else {
          setError('An unexpected error occurred');
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Failed to fetch audio post: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchAudioPost();
    }
  }, [postId]);

  return { data, loading, error, refetch: fetchAudioPost };
};

export default useAudioPosts;

export const useGetUserAudioPosts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserAudioPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cookie will be automatically included via axios defaults
      const response = await axios.get('/audio/user', {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (response.status === 200) {
        setData(response.data.posts);
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized: Please log in');
            break;
          case 500:
            setError('Server error: Please try again later');
            break;
          default:
            setError(err.response.data?.message || 'An unexpected error occurred');
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Failed to fetch audio posts: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAudioPosts();
  }, []);

  return { 
    data, 
    loading, 
    error,
    refetch: fetchUserAudioPosts // Added refetch capability
  };
};

export const useDeleteAudioPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteAudioPost = async (postId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Cookie will be automatically included via axios defaults
      const response = await axios.delete('/audio/del', {
        data: { post_id: postId },
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Validation error: ' + (err.response.data.message || 'Invalid request'));
            break;
          case 401:
            setError('Unauthorized: Please log in');
            break;
          case 404:
            setError('Post not found');
            break;
          case 500:
            setError('Server error: Please try again later');
            break;
          default:
            setError(err.response.data?.message || 'An unexpected error occurred');
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Failed to delete audio post: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { 
    deleteAudioPost, 
    loading, 
    error, 
    success 
  };
};