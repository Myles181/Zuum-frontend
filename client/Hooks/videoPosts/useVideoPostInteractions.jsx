import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook to create a comment on an audio post.
 * Handles casting, detailed error reporting, and stores response data.
 */
export const useCreateVideoComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [commentData, setCommentData] = useState(null);

  const createComment = async (postId, trimmedComment) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setCommentData(null);

    try {
      // Use cookies for authentication (matches app's auth pattern)
      const payload = {
        post_id: String(postId),
        comment: trimmedComment,
      };

      // Debugging log to confirm payload & endpoint
      console.debug('Posting comment:', payload, 'to', `${API_URL}/video/comment/create`);

      const response = await axios.post(
        `${API_URL}/video/comment/create`,
        payload,
        {
          withCredentials: true, // Use cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setCommentData(response.data);
        return response.data;
      } else {
        // Unexpected status code
        const msg = `Unexpected status code: ${response.status}`;
        console.warn(msg, response.data);
        setError(msg);
      }
    } catch (err) {
      // Detailed error parsing
      if (err.response && err.response.data) {
        console.error('Server validation errors:', err.response.data);
        // If API returns structured errors, join them
        const data = err.response.data;
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join(' | ');
          setError(messages);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError(JSON.stringify(data));
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Network error: No response from server');
      } else {
        console.error('Error setting up request:', err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    createComment,
    isLoading: loading,
    error,
    isSuccess: success,
    commentData,
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
      // Use cookies for authentication (matches app's auth pattern)
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
          withCredentials: true, // Use cookies for authentication
          headers: {
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
