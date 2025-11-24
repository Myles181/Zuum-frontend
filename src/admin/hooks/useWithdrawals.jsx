import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling admin withdrawal requests
 */
export const useWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all withdrawal requests for admin
   */
  const fetchWithdrawals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/withdrawals/admin/all/requests`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

     
        const data =
          response.data?.data ||
          response.data?.results ||
          response.data?.withdrawals ||
          response.data ||
          [];
        setWithdrawals(data);
      
    } catch (err) {
      console.error("Withdrawals fetch error:", err);
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Invalid request parameters");
            break;
          case 401:
            setError("Unauthorized – please login again");
            break;
          case 403:
            setError("Forbidden – insufficient privileges");
            break;
          case 404:
            setError("No withdrawals found");
            break;
          case 500:
            setError("Server error – try again later");
            break;
          default:
            setError(err.response.data?.message || "Failed to fetch withdrawals");
        }
      } else {
        setError("Network error – please check your connection");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset error
   */
  const resetError = useCallback(() => setError(null), []);

  // Fetch withdrawals when hook is used
  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return {
    withdrawals,
    isLoading,
    error,
    fetchWithdrawals,
    resetError
  };
};
