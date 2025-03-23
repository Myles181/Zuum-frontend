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



const useAudioPosts = (page = 1, limit = 10, postId = null) => {
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [posts, setPosts] = useState([]); // Stores the fetched audio posts
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: page,
    hasNext: false,
    hasPrev: false,
  }); // Stores pagination details

  // Fetch audio posts when `page`, `limit`, or `postId` changes
  useEffect(() => {
    const fetchAudioPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken"); // Retrieve the authentication token

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        let response;

        if (postId) {
          // Fetch a specific post by ID
          response = await axios.get(`${API_URL}/audio/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the auth token
            },
          });
        } else {
          // Fetch all posts with pagination
          response = await axios.get(`${API_URL}/audio/`, {
            params: { page, limit },
            headers: {
              Authorization: `Bearer ${token}`, // Include the auth token
            },
          });
        }

        // Check if the response is successful
        if (response.status === 200) {
          if (postId) {
            // If fetching a single post, set it as the only post in the array
            setPosts([response.data.post]);
            setPagination({
              total: 1,
              totalPages: 1,
              currentPage: 1,
              hasNext: false,
              hasPrev: false,
            });
          } else {
            // If fetching all posts, update the posts and pagination state
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
        // Handle errors
        if (err.response) {
          // The request was made and the server responded with a status code
          if (err.response.status === 401) {
            setError("Unauthorized: Please log in to access this resource.");
          } else if (err.response.status === 404) {
            setError("Post not found.");
          } else {
            setError(err.response.data?.message || "An error occurred while fetching audio posts.");
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError("Network error: No response from server.");
        } else {
          // Something happened in setting up the request
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAudioPosts();
  }, [page, limit, postId]); // Re-run effect when `page`, `limit`, or `postId` changes

  return {
    loading,
    error,
    posts,
    pagination,
  };
};

export default useAudioPosts;


export const useGetAudioPost = (postId) => {
  const [loading, setLoading] = useState(false); // Tracks if the request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs
  const [data, setData] = useState(null); // Stores the fetched data

  const fetchAudioPost = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the authentication token

      // Make the GET request to the API endpoint
      const response = await axios.get(`${API_URL}/audio/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the auth token
        },
      });

      // Handle successful response (status code 200)
      if (response.status === 200) {
        setData(response.data.post); // Store the fetched post data
      } else {
        // Handle unexpected status codes
        setError('An unexpected error occurred');
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.status === 404) {
          setError('Audio post not found');
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
        setError('Failed to fetch audio post: ' + err.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch audio post when the component mounts or when `postId` changes
  useEffect(() => {
    if (postId) {
      fetchAudioPost();
    }
  }, [postId]);

  // Return the data, loading, and error states
  return { data, loading, error };
};



export const useGetUserAudioPosts = () => {
  const [data, setData] = useState(null); // Stores the fetched audio posts
  const [loading, setLoading] = useState(false); // Tracks if the request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs

  const fetchUserAudioPosts = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the authentication token

      // Make the GET request to the API endpoint
      const response = await axios.get(`${API_URL}/audio/user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the auth token
        },
      });

      // Handle successful response (status code 200)
      if (response.status === 200) {
        setData(response.data.posts); // Store the fetched audio posts
      } else {
        // Handle unexpected status codes
        setError('An unexpected error occurred');
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        // The request was made and the server responded with a status code
        switch (err.response.status) {
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
        setError('Failed to fetch audio posts: ' + err.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch audio posts when the hook is used
  useEffect(() => {
    fetchUserAudioPosts();
  }, []);

  // Return the data, loading, and error states
  return { data, loading, error };
};




export const useDeleteAudioPost = () => {
  const [loading, setLoading] = useState(false); // Tracks if the request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs
  const [success, setSuccess] = useState(false); // Tracks if the audio post was successfully deleted

  const deleteAudioPost = async (postId) => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    setSuccess(false); // Reset success state

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the authentication token

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Log the request details for debugging
      console.log('Making DELETE request to:', `${API_URL}/audio/del`);
      console.log('Request payload:', { post_id: postId });

      // Make the DELETE request to the API endpoint
      const response = await axios.delete(`${API_URL}/audio/del`, {
        data: { post_id: postId }, // Include the post ID in the request body
        headers: {
          Authorization: `Bearer ${token}`, // Include the auth token
        },
      });

      // Log the response for debugging
      console.log('API Response:', response);

      // Handle successful response (status code 200)
      if (response.status === 200) {
        setSuccess(true); // Set success state
      } else {
        // Handle unexpected status codes
        setError('An unexpected error occurred');
      }
    } catch (err) {
      // Log the error for debugging
      console.error('Error deleting audio post:', err);

      // Handle errors
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);

        switch (err.response.status) {
          case 400:
            setError('Validation error: Please check your input');
            break;
          case 404:
            setError('Post not found or unauthorized');
            break;
          case 500:
            setError('Server error: Please try again later');
            break;
          default:
            setError('An unexpected error occurred');
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Network error: No response from server');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', err.message);
        setError('Failed to delete audio post: ' + err.message);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Return the function to delete an audio post, loading, error, and success states
  return { deleteAudioPost, loading, error, success };
};