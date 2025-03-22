import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useCreateVideoPost = () => {
  const [loading, setLoading] = useState(false); // Track if the request is in progress
  const [error, setError] = useState(null); // Store any error that occurs
  const [success, setSuccess] = useState(false); // Indicates if the request was successful

  const createVideoPost = async (formData) => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    setSuccess(false); // Reset success state

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the authentication token

      // Make the POST request to the API endpoint
      const response = await axios.post(`${API_URL}/video/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
          Authorization: `Bearer ${token}`, // Include the auth token
        },
      });

      // Handle successful response (status code 201)
      if (response.status === 201) {
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
            setError('Validation error: Please check your input or files');
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
        setError('Failed to create video post: ' + err.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Return the create function and state variables
  return { createVideoPost, loading, error, success };
};




export const useGetVideoPosts = (page = 1, limit = 10) => {
  const [data, setData] = useState(null); // Stores the fetched data
  const [loading, setLoading] = useState(false); // Tracks if the request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs

  const fetchVideoPosts = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the authentication token

      // Make the GET request to the API endpoint
      const response = await axios.get(`${API_URL}/video`, {
        params: { page, limit }, // Include pagination parameters
        headers: {
          Authorization: `Bearer ${token}`, // Include the auth token
        },
      });

      // Handle successful response (status code 200)
      if (response.status === 200) {
        setData(response.data); // Store the fetched data
      } else {
        // Handle unexpected status codes
        setError('An unexpected error occurred');
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.status === 500) {
          setError('Server error: Please try again later');
        } else {
          setError('An unexpected error occurred');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('Network error: No response from server');
      } else {
        // Something happened in setting up the request
        setError('Failed to fetch video posts: ' + err.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch video posts when the component mounts or when `page` or `limit` changes
  useEffect(() => {
    fetchVideoPosts();
  }, [page, limit]);

  // Return the data, loading, and error states
  return { data, loading, error };
};




export const useGetVideoPost = (postId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideoPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching video post with token:', token);
      const response = await axios.get(`${API_URL}/video/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response:', response);
      if (response.status === 200) {
        setData(response.data.post);
      } else {
        setError(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        console.error('Server error:', err.response.data);
      } else if (err.request) {
        setError('Network error: No response from server');
        console.error('Network error:', err.request);
      } else {
        setError(`Failed to fetch video post: ${err.message}`);
        console.error('Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchVideoPost();
    }
  }, [postId]);

  return { data, loading, error };
};




export const useCreateVideoComment = () => {
  const [loading, setLoading] = useState(false); // Tracks if the request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs
  const [success, setSuccess] = useState(false); // Tracks if the comment was successfully added

  const createVideoComment = async (postId, comment) => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    setSuccess(false); // Reset success state

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the authentication token

      // Make the POST request to the API endpoint
      const response = await axios.post(
        `${API_URL}video/comment/create`,
        {
          post_id: postId,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the auth token
          },
        }
      );

      // Handle successful response (status code 201)
      if (response.status === 201) {
        setSuccess(true); // Set success state
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
        setError('Failed to create comment: ' + err.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Return the function to create a comment, loading, error, and success states
  return { createVideoComment, loading, error, success };
};