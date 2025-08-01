import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Utility function to get authenticated headers
const getAuthHeaders = () => {
  const headers = {};
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Custom hook to create a comment on an audio post.
 * Handles casting, detailed error reporting, and stores response data.
 */
export const useCreateComment = () => {
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
      // Cast postId to string per API schema requirements
      const payload = {
        post_id: String(postId),
        comment: trimmedComment,
      };

      // Debugging log to confirm payload & endpoint
      console.debug('Posting comment:', payload, 'to', `${API_URL}/audio/comment/create`);

      const response = await axios.post(
        `${API_URL}/audio/comment/create`,
        payload,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          withCredentials: true,
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

  

  export const useReactToPost = () => {
    const [loading, setLoading] = useState(false); // Track if the request is in progress
    const [error, setError] = useState(null); // Store any error that occurs
    const [success, setSuccess] = useState(false); // Indicates if the request was successful
  
    const reactToPost = async (postId, like, unlike) => {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      setSuccess(false); // Reset success state
  
      try {
                const payload = {
          post_id: String(postId), 
          like: Boolean(like),     
          unlike: Boolean(unlike) 
        };
  
        console.log('Payload:', payload); // Debugging: Log the payload
  
        const response = await axios.post(
          `${API_URL}/audio/react`,
          payload,
          {
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
  
        // Handle successful response (status code 200 or 201)
        if (response.status === 200 || response.status === 201) {
          setSuccess(true); // Mark the request as successful
          return response.data; // Return the response data (optional)
        } else {
          // Handle unexpected status codes
          setError('An unexpected error occurred');
        }
      } catch (err) {
        // Handle errors
        if (err.response) {
          // The request was made and the server responded with a status code
          switch (err.response.status) {
            case 400:
              setError('Validation error: Please check your input');
              break;
            case 404:
              setError('Post not found');
              break;
            case 500:
              setError('Server error: Please try again later');
              break;
            default:
              setError('An unexpected error occurred');
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError('Network error: No response from server');
        } else {
          // Something happened in setting up the request
          setError('Failed to react to post: ' + err.message);
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    // Return the react function and state variables
    return { reactToPost, loading, error, success };
  };