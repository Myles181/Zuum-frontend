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





export const useVideoPosts = (page = 1, limit = 10, videoId = null, userId = null) => {
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [posts, setPosts] = useState([]); // Stores the fetched video posts
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: page,
    hasNext: false,
    hasPrev: false,
  }); // Stores pagination details

  // Fetch video posts when `page`, `limit`, `videoId`, or `userId` changes
  useEffect(() => {
    const fetchVideoPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken"); // Retrieve the authentication token

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        let response;

        if (videoId) {
          // Fetch a specific video post by ID
          response = await axios.get(`${API_URL}/video/${videoId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the auth token
            },
          });
        } else if (userId) {
          // Fetch video posts for a specific user
          response = await axios.get(`${API_URL}/video/user/${userId}`, {
            params: { page, limit },
            headers: {
              Authorization: `Bearer ${token}`, // Include the auth token
            },
          });
        } else {
          // Fetch all video posts with pagination
          response = await axios.get(`${API_URL}/video`, {
            params: { page, limit },
            headers: {
              Authorization: `Bearer ${token}`, // Include the auth token
            },
          });
        }

        // Check if the response is successful
        if (response.status === 200) {
          if (videoId) {
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
            // If fetching posts, update the posts and pagination state
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
            setError("Video post not found.");
          } else {
            setError(
              err.response.data?.message || "An error occurred while fetching video posts."
            );
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

    fetchVideoPosts();
  }, [page, limit, videoId, userId]); // Re-run effect when `page`, `limit`, `videoId`, or `userId` changes

  return {
    loading,
    error,
    posts,
    pagination,
  };
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




export const useUserVideoPosts = () => {
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [posts, setPosts] = useState([]); // Stores the fetched video posts

  useEffect(() => {
    const fetchUserVideoPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken"); // Retrieve the authentication token

        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        // Fetch video posts for the authenticated user
        const response = await axios.get(`${API_URL}/video/user`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the auth token
          },
        });

        // Check if the request was successful
        if (response.status === 200) {
          setPosts(response.data.posts); // Update the posts state
        }
      } catch (err) {
        // Handle errors
        if (err.response) {
          // The request was made and the server responded with a status code
          if (err.response.status === 401) {
            setError("Unauthorized: Please log in to access this resource.");
          } else if (err.response.status === 500) {
            setError("Server error. Please try again later.");
          } else {
            setError(
              err.response.data?.message || "An error occurred while fetching video posts."
            );
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

    fetchUserVideoPosts();
  }, []); // Run effect only once on component mount

  return {
    loading,
    error,
    posts,
  };
};

