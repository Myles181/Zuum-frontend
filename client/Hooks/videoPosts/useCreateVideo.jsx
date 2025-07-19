import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// export const useCreateVideoPost = () => {
//   const [loading, setLoading] = useState(false); // Track if the request is in progress
//   const [error, setError] = useState(null); // Store any error that occurs
//   const [success, setSuccess] = useState(false); // Indicates if the request was successful

//   const createVideoPost = async (formData) => {
//     setLoading(true); // Start loading
//     setError(null); // Reset error state
//     setSuccess(false); // Reset success state

//     try {
//       const token = localStorage.getItem('authToken'); // Retrieve the authentication token

//       // Make the POST request to the API endpoint
//       const response = await axios.post(`${API_URL}/video/create`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Set content type for file upload
//           Authorization: `Bearer ${token}`, // Include the auth token
//         },
//       });

//       // Handle successful response (status code 201)
//       if (response.status === 201) {
//         setSuccess(true); // Mark the request as successful
//         return response.data; // Return the response data (optional)
//       } else {
//         // Handle unexpected status codes
//         setError('An unexpected error occurred');
//       }
//     } catch (err) {
//       // Handle errors
//       if (err.response) {
//         // The request was made and the server responded with a status code
//         switch (err.response.status) {
//           case 400:
//             setError('Validation error: Please check your input or files');
//             break;
//           case 500:
//             setError('Server error: Please try again later');
//             break;
//           default:
//             setError('An unexpected error occurred');
//         }
//       } else if (err.request) {
//         // The request was made but no response was received
//         setError('Network error: No response from server');
//       } else {
//         // Something happened in setting up the request
//         setError('Failed to create video post: ' + err.message);
//       }
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Return the create function and state variables
//   return { createVideoPost, loading, error, success };
// };




export const useCreateVideoPost = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [success, setSuccess] = useState(false); // Tracks success state

  const createVideoPost = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("authToken"); // Retrieve the authentication token

      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }


      // Send the request to create a video post
      const response = await axios.post(`${API_URL}/video/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the auth token
          "Content-Type": "multipart/form-data", // Set content type for file upload
        },
      });

      // Check if the request was successful
      if (response.status === 201) {
        setSuccess(true); // Set success state
        return response.data; // Return the created post data
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.status === 400) {
          setError("Validation error or missing files.");
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(err.response.data?.message || "An error occurred while creating the video post.");
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

  return {
    loading,
    error,
    success,
    createVideoPost,
  };
};





// export const useGetVideoPosts = (page = 1, limit = 10) => {
//   const [data, setData] = useState(null); // Stores the fetched data
//   const [loading, setLoading] = useState(false); // Tracks if the request is in progress
//   const [error, setError] = useState(null); // Stores any error that occurs

//   const fetchVideoPosts = async () => {
//     setLoading(true); // Start loading
//     setError(null); // Reset error state

//     try {
//       const token = localStorage.getItem('authToken'); // Retrieve the authentication token

//       // Make the GET request to the API endpoint
//       const response = await axios.get(`${API_URL}/video`, {
//         params: { page, limit }, // Include pagination parameters
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the auth token
//         },
//       });

//       // Handle successful response (status code 200)
//       if (response.status === 200) {
//         setData(response.data); // Store the fetched data
//       } else {
//         // Handle unexpected status codes
//         setError('An unexpected error occurred');
//       }
//     } catch (err) {
//       // Handle errors
//       if (err.response) {
//         // The request was made and the server responded with a status code
//         if (err.response.status === 500) {
//           setError('Server error: Please try again later');
//         } else {
//           setError('An unexpected error occurred');
//         }
//       } else if (err.request) {
//         // The request was made but no response was received
//         setError('Network error: No response from server');
//       } else {
//         // Something happened in setting up the request
//         setError('Failed to fetch video posts: ' + err.message);
//       }
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Fetch video posts when the component mounts or when `page` or `limit` changes
//   useEffect(() => {
//     fetchVideoPosts();
//   }, [page, limit]);

//   // Return the data, loading, and error states
//   return { data, loading, error };
// };






axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true; // Enable cookie authentication

// Hook for fetching video posts with pagination
export const useVideoPosts = (page = 1, limit = 10, videoId = null, userId = null) => {
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
    const fetchVideoPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (videoId) {
          response = await axios.get(`/video/${videoId}`);
        } else if (userId) {
          response = await axios.get(`/video/user/${userId}`, {
            params: { page, limit }
          });
        } else {
          response = await axios.get('/video', {
            params: { page, limit }
          });
        }

        if (response.status === 200) {
          if (videoId) {
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
            setError("Video post not found");
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

    fetchVideoPosts();
  }, [page, limit, videoId, userId]);

  return {
    loading,
    error,
    posts,
    pagination,
  };
};

// Hook for fetching a single video post
export const useGetVideoPost = (postId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideoPost = async () => {
    if (!postId) return;
    
    setLoading(true);
    setError(null);
    try {
      // Use cookies for authentication (matches app's auth pattern)
      const response = await axios.get(`${API_URL}/video/${postId}`, {
        withCredentials: true, // Use cookies for authentication
      });
      
      if (response.status === 200) {
        setData(response.data.post || response.data);
        console.log('Video post data fetched:', response.data);
      } else {
        setError(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching video post:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized: Please log in');
        } else if (err.response.status === 404) {
          setError('Video post not found');
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError(`Failed to fetch video post: ${err.message}`);
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

  return { 
    data, 
    loading, 
    error,
    refetch: fetchVideoPost
  };
};

// Hook for creating video comments
export const useCreateVideoComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createVideoComment = async (postId, comment) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('/video/comment/create', {
        post_id: postId,
        comment: comment,
      });

      if (response.status === 201) {
        setSuccess(true);
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Validation error: Please check your input');
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
            setError('An unexpected error occurred');
        }
      } else if (err.request) {
        setError('Network error: No response from server');
      } else {
        setError('Failed to create comment: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { 
    createVideoComment, 
    loading, 
    error, 
    success 
  };
};

// Hook for fetching user's video posts
export const useUserVideoPosts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchUserVideoPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/video/user');
      if (response.status === 200) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("Unauthorized: Please log in");
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later.");
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

  useEffect(() => {
    fetchUserVideoPosts();
  }, []);

  return {
    loading,
    error,
    posts,
    refresh: fetchUserVideoPosts
  };
};