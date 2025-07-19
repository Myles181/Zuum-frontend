import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set in .env

// Configure axios to use cookies like AuthContext
axios.defaults.withCredentials = true;

// Custom hook for fetching and updating user profile
const useProfile = () => {
  // State variables for fetching profile
  const [profile, setProfile] = useState(null); // Stores the fetched profile data
  const [loading, setLoading] = useState(true); // Tracks if the data is being loaded
  const [fetchError, setFetchError] = useState(null); // Stores any error that occurs during the fetch

  // State variables for updating profile
  const [updateLoading, setUpdateLoading] = useState(false); // Tracks if the update is in progress
  const [updateError, setUpdateError] = useState(null); // Stores any error that occurs during the update
  const [updateSuccess, setUpdateSuccess] = useState(false); // Indicates if the update was successful

  // Fetch profile data  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use cookies instead of localStorage token
        const response = await axios.get(`${API_URL}/user/profile`);

        // Check if the response status is OK (200)
        if (response.status === 200) {
          setProfile(response.data); // Set the profile data in state

        } else {
          // Handle specific HTTP errors
          if (response.status === 401) {
            setFetchError("Unauthorized: Invalid or missing token");
          } else if (response.status === 404) {
            setFetchError("Profile not found");
          } else {
            setFetchError("An unexpected error occurred");
          }
        }
      } catch (err) {
        // Handle network or other errors
        console.error("Error fetching profile:", err);

        if (err.response) {
          // The request was made and the server responded with a status code
          if (err.response.status === 401) {
            setFetchError("Unauthorized: Invalid or missing token");
          } else if (err.response.status === 404) {
            setFetchError("Profile not found");
          } else {
            setFetchError("An unexpected error occurred");
          }
        } else if (err.request) {
          // The request was made but no response was received
          setFetchError("Network error: No response from server");
        } else {
          // Something happened in setting up the request
          setFetchError("Failed to fetch profile: " + err.message);
        }
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchProfile(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs once on component mount

  // Function to refresh profile (for compatibility with UsePreLoader)
  const refreshProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/profile`);
      if (response.status === 200) {
        setProfile(response.data);
        return { profile: response.data };
      }
    } catch (err) {
      console.error("Error refreshing profile:", err);
      throw err;
    }
  };

  // Function to update profile
  const updateProfile = async (formData) => {
    setUpdateLoading(true); // Start loading
    setUpdateError(null); // Reset error state
    setUpdateSuccess(false); // Reset success state

    try {
      // Use cookies instead of localStorage token
      const response = await axios.put(`${API_URL}/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper content type for file uploads
        },
      });

      // Check if the response status is OK (200)
      if (response.status === 200) {
        setUpdateSuccess(true); // Mark the update as successful
        setProfile(response.data); // Update the profile data in state
        return response.data; // Return the response data (optional)
      } else {
        // Handle specific HTTP errors
        if (response.status === 400) {
          setUpdateError(response.data.message || "Validation errors occurred");
        } else if (response.status === 404) {
          setUpdateError("Profile not found");
        } else {
          setUpdateError("An unexpected error occurred");
        }
      }
    } catch (err) {
      // Handle network or other errors
      console.error("Error updating profile:", err);

      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.status === 400) {
          setUpdateError(err.response.data.message || "Validation errors occurred");
        } else if (err.response.status === 404) {
          setUpdateError("Profile not found");
        } else {
          setUpdateError("An unexpected error occurred");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setUpdateError("Network error: No response from server");
      } else {
        // Something happened in setting up the request
        setUpdateError("Failed to update profile: " + err.message);
      }
    } finally {
      setUpdateLoading(false); // Mark loading as complete
    }
  };

  // Return all states and functions
  return {
    profile, // Fetched profile data
    loading, // Loading state for fetching profile
    fetchError, // Error state for fetching profile
    updateProfile, // Function to update profile
    updateLoading, // Loading state for updating profile
    updateError, // Error state for updating profile
    updateSuccess, // Success state for updating profile
    refreshProfile, // Function to refresh profile
  };
};

export default useProfile;



export const useUserProfile = (userId = null) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);
      try {
        // Use cookies instead of localStorage token
        const response = await axios.get(`${API_URL}/user/profile/${userId}`);

        setProfile(response.data);
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setError("Unauthorized - Invalid or missing token");
              break;
            case 404:
              setError("Profile not found");
              break;
            case 500:
              setError("Server error. Please try again later.");
              break;
            default:
              setError("An unexpected error occurred.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
};



export const useFollowUser = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [message, setMessage] = useState(null); // Tracks success messages

  // Function to follow or unfollow a user
  const followUser = async (profileId, follow) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Use cookies instead of localStorage token
      // Make the POST request to the API endpoint
      const response = await axios.post(
        `${API_URL}/user/follow`,
        { profileId, follow },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful response (status code 200)
      if (response.status === 200) {
        setMessage(response.data.message); // Set success message
      } else {
        // Handle unexpected status codes
        setError("An unexpected error occurred.");
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        // The request was made and the server responded with a status code
        switch (err.response.status) {
          case 401:
            setError("No changes made (already followed/unfollowed).");
            break;
          case 404:
            setError("Profile ID does not exist.");
            break;
          case 406:
            setError("You cannot follow yourself.");
            break;
          case 500:
            setError("Internal server error.");
            break;
          default:
            setError(err.response.data?.message || "An error occurred.");
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
    message,
    followUser, // Function to follow/unfollow a user
  };
};

