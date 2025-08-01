import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Detect iOS devices (including Chrome iOS)
const isIOSDevice = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
};

// Utility function to get authenticated headers
const getAuthHeaders = () => {
  const headers = {};
  // For iOS devices, try to get token from localStorage as backup
  if (isIOSDevice()) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]); // Stores the list of notifications
  const [loading, setLoading] = useState(true); // Tracks if the request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        const token = localStorage.getItem('authToken'); // Retrieve the authentication token

        // Make the GET request to the API endpoint
              const response = await axios.get(`${API_URL}/notifications`, {
        headers: {
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });
          },
        });

        // Handle successful response (status code 200)
        if (response.status === 200) {
          setNotifications(response.data.notifications); // Update the notifications state
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
          setError('Failed to fetch notifications: ' + err.message);
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Return the notifications and state variables
  return { notifications, loading, error };
};

export default useNotifications;