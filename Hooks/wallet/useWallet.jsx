import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Detect iOS devices (for fallback headers)
const isIOSDevice = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
};

// Utility function to get auth headers
const getAuthHeaders = () => {
  const headers = {};
  if (isIOSDevice()) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Axios default config to include cookies
axios.defaults.withCredentials = true;

export const useVirtualAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [account, setAccount] = useState(null);

  const createOrGetAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAccount(null);

    try {
      const response = await axios.get(`${API_URL}/payment/deposit-account`, {
        headers: {
          Accept: 'application/json',
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Check where the account info is stored in the response
      const accountData = response.data.account || response.data.paymentDetails || response.data.data;

      if (!accountData) {
        throw new Error('Account details not found in response');
      }

      setAccount(accountData);
      setSuccess(true);
    } catch (err) {
      console.error('[useVirtualAccount] Error:', err);

      let message = 'Failed to fetch or create virtual account';

      if (err.response) {
        message = err.response.data?.message || err.response.data?.error || `Server responded with ${err.response.status}`;
      } else if (err.request) {
        message = 'No response from server';
      } else {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createOrGetAccount,
    account,
    loading,
    error,
    success,
  };
};
