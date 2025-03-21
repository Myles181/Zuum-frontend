import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is correctly set in your environment

// Hook for creating a new audio post
export const useCreateAudioPost = () => {
  const [loading, setLoading] = useState(false); // Tracks if the request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs
  const [success, setSuccess] = useState(false); // Indicates if the request was successful

  const createAudioPost = async (formData) => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    setSuccess(false); // Reset success state

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the authentication token

      // Make the POST request to the API endpoint
      const response = await axios.post(`${API_URL}/audio/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the auth token
          'Content-Type': 'multipart/form-data', // Set content type for file uploads
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
        if (err.response.status === 400) {
          setError(err.response.data.message || 'Validation error or missing files');
        } else if (err.response.status === 500) {
          setError('Server error: Please try again later');
        } else {
          setError('An unexpected error occurred');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('Network error: No response from server');
      } else {
        // Something happened in setting up the request
        setError('Failed to create audio post: ' + err.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Return the create function and state variables
  return { createAudioPost, loading, error, success };
};

// Hook for fetching audio posts with pagination
export const useGetAudioPosts = (page = 1, limit = 10) => {
  const [loading, setLoading] = useState(false); // Tracks if the request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs
  const [data, setData] = useState(null); // Stores the fetched data

  const fetchAudioPosts = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the authentication token

      // Make the GET request to the API endpoint
      const response = await axios.get(`${API_URL}/api/audio`, {
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
        setError('Failed to fetch audio posts: ' + err.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch audio posts when the component mounts or when `page` or `limit` changes
  useEffect(() => {
    fetchAudioPosts();
  }, [page, limit]);

  // Return the data, loading, and error states
  return { data, loading, error };
};