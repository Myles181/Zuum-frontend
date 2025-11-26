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

export const useCreateWithdrawal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createWithdrawal = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "/withdrawals/new",
        payload,
        {
          withCredentials: true, // ✅ Send auth token cookie
          headers: getAuthHeaders()
        }
      );

        if (response.data.request) {
            setSuccess(true);

            setTimeout(() => {
            setSuccess(false);
            }, 5000);
        }
          console.log(response.data.request)
    
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Request failed");
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { createWithdrawal, loading, error, success };
};




export const useTransferFunds = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const transferFunds = async (payload) => {
    // { recipient_email, amount }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "/withdrawals/transfer",
        payload,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );

      if (response.data?.status) {
        setSuccess(response.data.message || "Transfer successful");

        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || err.response.data?.message || "Transfer failed");
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    transferFunds,
    loading,
    error,
    success,
  };
};