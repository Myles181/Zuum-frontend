import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is correctly set in your environment


export const useCreateComment = () => {
    const [loading, setLoading] = useState(false); // Track if the request is in progress
    const [error, setError] = useState(null); // Store any error that occurs
    const [success, setSuccess] = useState(false); // Indicates if the request was successful
  
    const createComment = async (postId, comment) => {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      setSuccess(false); // Reset success state
  
      try {
        const token = localStorage.getItem('authToken'); // Retrieve the authentication token
  
        // Make the POST request to the API endpoint
        const response = await axios.post(
          `${API_URL}/audio/comment/create`,
          { post_id: postId, comment }, // Request body
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the auth token
              'Content-Type': 'application/json', // Set content type
            },
          }
        );
  
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
            setError('Validation error: Please check your input');
          } else if (err.response.status === 404) {
            setError('Post not found');
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
          setError('Failed to create comment: ' + err.message);
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    // Return the create function and state variables
    return { createComment, loading, error, success };
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
        const token = localStorage.getItem('authToken'); // Retrieve the authentication token
  
        // Ensure like and unlike are boolean values
        const payload = {
          post_id: String(postId), // Ensure post_id is a string
          like: Boolean(like),     // Ensure like is a boolean
          unlike: Boolean(unlike), // Ensure unlike is a boolean
        };
  
        console.log('Payload:', payload); // Debugging: Log the payload
  
        const response = await axios.post(
          `${API_URL}/audio/react`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
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