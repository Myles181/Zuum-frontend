import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling admin deposit request operations
 */
export const useDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    pages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Handle API errors with appropriate messages
   */
  const handleApiError = useCallback((err, defaultMessage = "An error occurred") => {
    console.error("Deposits API error:", err);
    if (err.response) {
      switch (err.response.status) {
        case 400:
          setError(err.response.data?.message || "Invalid request parameters");
          break;
        case 401:
          setError("Unauthorized – please login again");
          break;
        case 403:
          setError("Forbidden – insufficient privileges");
          break;
        case 404:
          setError(err.response.data?.message || "Deposit request not found or already processed");
          break;
        case 500:
          setError("Server error – try again later");
          break;
        default:
          setError(err.response.data?.message || defaultMessage);
      }
    } else {
      setError("Network error – please check your connection");
    }
  }, []);

  /**
   * Fetch all deposit requests with optional filters
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by deposit status (PENDING, APPROVED, REJECTED, COMPLETED, FAILED)
   * @param {number} filters.userId - Filter by user ID
   * @param {string} filters.chain - Filter by blockchain chain (TRON, ETH, BTC)
   * @param {string} filters.wallet - Filter by wallet address (searches both source and destination)
   * @param {number} filters.limit - Number of results per page (default: 50)
   * @param {number} filters.offset - Number of results to skip (default: 0)
   */
  const fetchDeposits = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.userId) params.userId = filters.userId;
      if (filters.chain) params.chain = filters.chain;
      if (filters.wallet) params.wallet = filters.wallet;
      if (filters.limit !== undefined) params.limit = filters.limit;
      if (filters.offset !== undefined) params.offset = filters.offset;

      const response = await axios.get(`/admin/wallet/deposits`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        params
      });

      const data = response.data?.data || [];
      const paginationData = response.data?.pagination || {
        total: 0,
        limit: filters.limit || 50,
        offset: filters.offset || 0,
        pages: 0
      };

      setDeposits(data);
      setPagination(paginationData);
      return { data, pagination: paginationData };
    } catch (err) {
      handleApiError(err, "Failed to fetch deposit requests");
      return { data: [], pagination };
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, pagination]);

  /**
   * Approve a deposit request
   * @param {number} depositId - The deposit request ID
   * @param {string} txId - Transaction ID (required)
   */
  const approveDeposit = useCallback(async (depositId, txId) => {
    if (!txId) {
      setError("Transaction ID is required");
      return false;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.patch(
        `/admin/wallet/deposits/${depositId}/approve`,
        { txId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.status === 200) {
        setSuccess(response.data?.message || "Deposit request approved successfully");
        // Update the local state to reflect the change
        setDeposits(prev => 
          prev.map(deposit => 
            deposit.id === depositId 
              ? { ...deposit, status: "APPROVED", tx_id: txId } 
              : deposit
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      handleApiError(err, "Failed to approve deposit request");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  /**
   * Reject a deposit request
   * @param {number} depositId - The deposit request ID
   * @param {string} reason - Reason for rejection (optional)
   */
  const rejectDeposit = useCallback(async (depositId, reason = "") => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.patch(
        `/admin/wallet/deposits/${depositId}/reject`,
        { reason },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.status === 200) {
        setSuccess(response.data?.message || "Deposit request rejected successfully");
        // Update the local state to reflect the change
        setDeposits(prev => 
          prev.map(deposit => 
            deposit.id === depositId 
              ? { ...deposit, status: "REJECTED", reason } 
              : deposit
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      handleApiError(err, "Failed to reject deposit request");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => setError(null), []);

  /**
   * Reset success state
   */
  const resetSuccess = useCallback(() => setSuccess(null), []);

  return {
    deposits,
    pagination,
    isLoading,
    error,
    success,
    fetchDeposits,
    approveDeposit,
    rejectDeposit,
    resetError,
    resetSuccess
  };
};
