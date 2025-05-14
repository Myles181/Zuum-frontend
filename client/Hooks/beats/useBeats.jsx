import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // Enable cookie authentication

// Hook for creating a new beat post with cookies
export const useCreateBeatPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createBeatPost = async (formData) => {
    console.debug('[useCreateBeatPost] Starting createBeatPost', { formData });
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('/beat/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.debug(`[useCreateBeatPost] Upload progress: ${percent}%`);
        }
      });

      console.debug('[useCreateBeatPost] Response received:', response);

      if (response.status === 201) {
        setSuccess(true);
        console.debug('[useCreateBeatPost] Beat post created successfully:', response.data);
        return response.data;
      } else {
        setError('An unexpected error occurred');
        console.error('[useCreateBeatPost] Unexpected status code:', response.status, response.data);
      }
    } catch (err) {
      console.error('[useCreateBeatPost] Error caught:', err);

      if (err.response) {
        console.error('[useCreateBeatPost] Server response error:', {
          status: err.response.status,
          data: err.response.data
        });
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
        console.error('[useCreateBeatPost] No response received:', err.request);
        setError('Network error: No response from server');
      } else {
        console.error('[useCreateBeatPost] Request setup error:', err.message);
        setError('Failed to create beat post: ' + err.message);
      }
    } finally {
      setLoading(false);
      console.debug('[useCreateBeatPost] createBeatPost finished, loading=false');
    }
  };

  return { createBeatPost, loading, error, success };
};

// Hook for fetching beats with pagination
export const useFetchBeats = ({
  initialPage = 1,
  initialLimit = 10
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [beats, setBeats] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: initialPage,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBeats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/beat', {
        params: { page, limit }
      });

      console.debug('[useFetchBeats] response.data:', response.data);

      const payload = response.data;

      if (payload.status === true && Array.isArray(payload.posts)) {
        setBeats(payload.posts);
        setPagination({
          total: payload.pagination.total,
          totalPages: payload.pagination.totalPages,
          currentPage: payload.pagination.currentPage,
          hasNext: payload.pagination.hasNext,
          hasPrev: payload.pagination.hasPrev
        });
      } else {
        console.error('[useFetchBeats] Unexpected payload shape', payload);
        setBeats([]);
        setPagination({
          total: 0,
          totalPages: 0,
          currentPage: page,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (err) {
      console.error('[useFetchBeats] Error fetching beats:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized: Please log in');
        } else {
          setError(err.response.data.message || 'Server error');
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchBeats();
  }, [fetchBeats]);

  return {
    beats,
    pagination,
    loading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refresh: fetchBeats
  };
};

// Hook for fetching a specific beat post by ID with cookies
export const useGetBeatPost = (postId) => {
  const [beat, setBeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBeatPost = useCallback(async (id = postId) => {
    console.debug('[useGetBeatPost] Starting fetchBeatPost', { id });
    
    if (!id) {
      console.debug('[useGetBeatPost] No post ID provided');
      return;
    }

    setLoading(true);
    setError(null);
    setBeat(null);

    try {
      const response = await axios.get(`/beat/${id}`);
      console.debug('[useGetBeatPost] Response received:', response);

      if (response.status === 200) {
        setBeat(response.data);
        console.debug('[useGetBeatPost] Beat post fetched successfully:', response.data);
        return response.data;
      } else {
        setError('An unexpected error occurred');
        console.error('[useGetBeatPost] Unexpected status code:', response.status, response.data);
      }
    } catch (err) {
      console.error('[useGetBeatPost] Error caught:', err);

      if (err.response) {
        console.error('[useGetBeatPost] Server response error:', {
          status: err.response.status,
          data: err.response.data
        });
        
        if (err.response.status === 401) {
          setError('Unauthorized: Please log in');
        } else if (err.response.status === 404) {
          setError('Beat post not found');
        } else if (err.response.status === 500) {
          setError('Server error: Please try again later');
        } else {
          setError('An unexpected error occurred');
        }
      } else if (err.request) {
        console.error('[useGetBeatPost] No response received:', err.request);
        setError('Network error: No response from server');
      } else {
        console.error('[useGetBeatPost] Request setup error:', err.message);
        setError('Failed to fetch beat post: ' + err.message);
      }
    } finally {
      setLoading(false);
      console.debug('[useGetBeatPost] fetchBeatPost finished, loading=false');
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchBeatPost();
    }
  }, [postId, fetchBeatPost]);

  return { beat, loading, error, refetch: fetchBeatPost };
};






// Hook for reacting to a beat post
export const useReactToBeatPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const reactToBeatPost = async (postId, action) => {
    console.debug('[useReactToBeatPost] Starting reactToBeatPost', { postId, action });
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      console.debug('[useReactToBeatPost] Retrieved token:', token);

      // Prepare request body based on action
      const requestBody = {
        post_id: postId,
        like: action === 'like',
        unlike: action === 'unlike'
      };

      const response = await axios.post(
        `${API_URL}/beat/react`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.debug('[useReactToBeatPost] Response received:', response);

      if (response.status === 200) {
        setSuccess(true);
        console.debug('[useReactToBeatPost] Reaction updated successfully:', response.data);
        return response.data;
      } else if (response.status === 201) {
        setSuccess(true);
        console.debug('[useReactToBeatPost] Reaction added successfully:', response.data);
        return response.data;
      } else {
        setError('An unexpected error occurred');
        console.error('[useReactToBeatPost] Unexpected status code:', response.status, response.data);
      }
    } catch (err) {
      console.error('[useReactToBeatPost] Error caught:', err);

      if (err.response) {
        console.error('[useReactToBeatPost] Server response error:', {
          status: err.response.status,
          data: err.response.data
        });
        
        if (err.response.status === 400) {
          setError(err.response.data.message || 'Validation error or invalid reaction');
        } else if (err.response.status === 404) {
          setError('Post not found');
        } else if (err.response.status === 500) {
          setError('Server error: Please try again later');
        } else {
          setError('An unexpected error occurred');
        }
      } else if (err.request) {
        console.error('[useReactToBeatPost] No response received:', err.request);
        setError('Network error: No response from server');
      } else {
        console.error('[useReactToBeatPost] Request setup error:', err.message);
        setError('Failed to react to beat post: ' + err.message);
      }
    } finally {
      setLoading(false);
      console.debug('[useReactToBeatPost] reactToBeatPost finished, loading=false');
    }
  };

  return { reactToBeatPost, loading, error, success };
};








export const useCommentOnBeatPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const commentOnBeatPost = async (postId, commentText) => {
    console.debug('[useCommentOnBeatPost] Starting commentOnBeatPost', { postId, commentText });
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      console.debug('[useCommentOnBeatPost] Retrieved token:', token);

      const response = await axios.post(
        `${API_URL}/beat/comment`,
        {
          post_id: postId,
          comment: commentText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.debug('[useCommentOnBeatPost] Response received:', response);

      if (response.status === 201) {
        setSuccess(true);
        console.debug('[useCommentOnBeatPost] Comment added successfully:', response.data);
        return response.data;
      } else {
        setError('An unexpected error occurred');
        console.error('[useCommentOnBeatPost] Unexpected status code:', response.status, response.data);
      }
    } catch (err) {
      console.error('[useCommentOnBeatPost] Error caught:', err);

      if (err.response) {
        console.error('[useCommentOnBeatPost] Server response error:', {
          status: err.response.status,
          data: err.response.data
        });
        
        if (err.response.status === 400) {
          setError(err.response.data.message || 'Validation error');
        } else if (err.response.status === 404) {
          setError('Post not found');
        } else if (err.response.status === 500) {
          setError('Server error: Please try again later');
        } else {
          setError('An unexpected error occurred');
        }
      } else if (err.request) {
        console.error('[useCommentOnBeatPost] No response received:', err.request);
        setError('Network error: No response from server');
      } else {
        console.error('[useCommentOnBeatPost] Request setup error:', err.message);
        setError('Failed to add comment: ' + err.message);
      }
      throw err; // Re-throw the error for the calling component to handle if needed
    } finally {
      setLoading(false);
      console.debug('[useCommentOnBeatPost] commentOnBeatPost finished, loading=false');
    }
  };

  return { commentOnBeatPost, loading, error, success };
};









export const usePurchaseBeat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const purchaseBeat = async (postId, amount) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.post(
        `${API_URL}/beat/purchase`,
        { postId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (err) {
      let errorMsg = 'Failed to purchase beat';
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMsg = err.response.data?.error || 'Validation error or insufficient balance';
            break;
          case 404:
            errorMsg = err.response.data?.error || 'Beat not found or sold out';
            break;
          case 500:
            errorMsg = err.response.data?.error || 'Server error';
            break;
          default:
            errorMsg = err.response.data?.error || `Error: ${err.response.status}`;
        }
      }
      
      setError(new Error(errorMsg));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { purchaseBeat, isLoading, error, data };
};








export const usePurchasedBeats = () => {
  const [purchasedBeats, setPurchasedBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPurchasedBeats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const response = await axios.get(`${API_URL}/beat/purchase`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPurchasedBeats(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch purchased beats');
      console.error('Error fetching purchased beats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedBeats();
  }, []);

  const refetch = () => {
    fetchPurchasedBeats();
  };

  return { purchasedBeats, loading, error, refetch };
};