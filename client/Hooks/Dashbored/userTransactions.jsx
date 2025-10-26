import { useState, useCallback ,useEffect } from "react";
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

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;




// Hook for fetching authenticated user's transactions
export const useUserTransactions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/user/transactions', {
        headers: getAuthHeaders(),
        withCredentials: true, // ✅ ensures cookie token is sent
      });

      
        setData(response.data.data.reverse());
     
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Unauthorized: Please log in');
            break;
          case 500:
            setError('Server error: Please try again later');
            break;
          default:
            setError(err.response.data?.message || 'An error occurred');
        }
      } else if (err.request) {
        setError('Network error: No server response');
      } else {
        setError(err.message || 'Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatically on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions // ✅ allow manual refresh
  };
};
