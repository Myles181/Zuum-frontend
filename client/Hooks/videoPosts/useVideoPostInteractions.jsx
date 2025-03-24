import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useCreateVideoComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState(null);

  const createVideoComment = async ({ post_id, comment }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponse(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      const result = await axios.post(
        `${API_URL}/video/comment/create`,
        { post_id, comment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (result.status === 201) {
        setSuccess(true);
        setResponse({
          message: 'Comment added successfully',
          data: result.data
        });
        return result.data;
      }
      throw new Error('Unexpected response from server');
      
    } catch (err) {
      let errorMessage = 'Failed to post comment';
      
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            errorMessage = err.response.data?.error || 'Invalid comment data';
            break;
          case 404:
            errorMessage = 'Video post not found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          default:
            errorMessage = err.response?.data?.message || err.message;
        }
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setResponse(null);
  };

  return { 
    createVideoComment, 
    loading, 
    error, 
    success, 
    response,
    reset
  };
};






export const useVideoReaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [count, setCount] = useState(0);

  const reactToVideo = async ({ post_id, like, unlike }) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        `${API_URL}/video/react`,
        { post_id, like, unlike },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        setReaction(like ? 'liked' : unlike ? 'unliked' : null);
        // If your API returns the updated like count, you can set it here:
        // setCount(response.data.likes_count);
        return response.data;
      }
      throw new Error('Unexpected response');
      
    } catch (err) {
      let errorMessage = 'Failed to update reaction';
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = 'Invalid reaction data';
            break;
          case 404:
            errorMessage = 'Video post not found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again';
            break;
          default:
            errorMessage = err.response.data?.message || err.message;
        }
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  return { 
    reactToVideo, 
    loading, 
    error, 
    reaction,
    count,
    resetError: () => setError(null)
  };
};