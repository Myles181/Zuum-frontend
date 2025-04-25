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
  const [success, setSuccess] = useState(false);

  const reactToVideo = async (postId, like, unlike) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const payload = {
        post_id: String(postId),
        like: Boolean(like),
        unlike: Boolean(unlike),
      };
      console.log("Video react payload:", payload);

      const response = await axios.post(
        `${API_URL}/video/react`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        return response.data;
      } else {
        setError("An unexpected error occurred");
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Validation error: Please check your input");
            break;
          case 404:
            setError("Video post not found");
            break;
          case 500:
            setError("Server error: Please try again later");
            break;
          default:
            setError(err.response.data?.message || "An unexpected error occurred");
        }
      } else if (err.request) {
        setError("Network error: No response from server");
      } else {
        setError("Failed to react to video: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { reactToVideo, loading, error, success };
};
