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


export const useGetUserWithdrawalRequests = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
    const response = await axios.get(
          `/withdrawals/all/user/requests`,
          { headers: getAuthHeaders() }
    );


     setWithdrawals(response.data.requests);
        
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return { withdrawals, loading, error, fetchWithdrawals };
};


