import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling user wallet deposit operations
 * - Fetch deposit wallet addresses
 * - Create deposit requests
 * - Fetch payment transactions
 */
export const useWalletDeposit = () => {
  const [depositAddresses, setDepositAddresses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentDeposit, setCurrentDeposit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Handle API errors with appropriate messages
   */
  const handleApiError = useCallback((err, defaultMessage = "An error occurred") => {
    console.error("Wallet Deposit API error:", err);
    if (err.response) {
      switch (err.response.status) {
        case 400:
          setError(err.response.data?.message || "Invalid request parameters");
          break;
        case 401:
          setError("Unauthorized – please login again");
          break;
        case 403:
          setError("Forbidden – access denied");
          break;
        case 404:
          setError(err.response.data?.message || "Resource not found");
          break;
        case 500:
          setError(err.response.data?.message || "Server error – try again later");
          break;
        default:
          setError(err.response.data?.message || defaultMessage);
      }
    } else {
      setError("Network error – please check your connection");
    }
  }, []);

  /**
   * Fetch deposit wallet addresses
   * @param {string} chain - Optional blockchain network filter (e.g., "ETH", "BSC", "TRON")
   * @returns {Array} Array of deposit address objects
   */
  const fetchDepositAddresses = useCallback(async (chain = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {};
      if (chain) params.chain = chain;

      const response = await axios.get(`/payment/wallet/deposit-address`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        params
      });

      const addresses = response.data?.addresses || [];
      setDepositAddresses(addresses);
      return addresses;
    } catch (err) {
      handleApiError(err, "Failed to fetch deposit addresses");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  /**
   * Create a deposit request
   * @param {number} amount - Deposit amount
   * @param {number} walletId - Target wallet ID (from deposit addresses)
   * @param {string} sourceWalletAddress - User's source wallet address
   * @returns {Object|null} Created deposit object or null on failure
   */
  const createDepositRequest = useCallback(async (amount, walletId, sourceWalletAddress) => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return null;
    }
    if (!walletId) {
      setError("Please select a deposit wallet");
      return null;
    }
    if (!sourceWalletAddress || !sourceWalletAddress.trim()) {
      setError("Please enter your source wallet address");
      return null;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `/payment/wallet/deposit-request`,
        {
          amount: parseFloat(amount),
          walletId,
          sourceWalletAddress: sourceWalletAddress.trim()
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      const deposit = response.data?.deposit || null;
      setCurrentDeposit(deposit);
      setSuccess(response.data?.message || "Deposit request created successfully");
      return deposit;
    } catch (err) {
      handleApiError(err, "Failed to create deposit request");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  /**
   * Fetch all payment transactions for the user
   * @returns {Array} Array of transaction objects
   */
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/payment/transactions`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      // Handle various response structures
      const data = response.data?.transactions || 
                   response.data?.data || 
                   response.data?.balances ||
                   response.data || 
                   [];
      
      setTransactions(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      handleApiError(err, "Failed to fetch transactions");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  /**
   * Get deposit addresses filtered by chain
   * @param {string} chain - Blockchain network (e.g., "ETH", "TRON", "BSC")
   */
  const getAddressesByChain = useCallback((chain) => {
    return depositAddresses.filter((addr) => addr.chain === chain);
  }, [depositAddresses]);

  /**
   * Get only active deposit addresses
   */
  const getActiveAddresses = useCallback(() => {
    return depositAddresses.filter((addr) => addr.active === true);
  }, [depositAddresses]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => setError(null), []);

  /**
   * Reset success state
   */
  const resetSuccess = useCallback(() => setSuccess(null), []);

  /**
   * Clear current deposit
   */
  const clearCurrentDeposit = useCallback(() => setCurrentDeposit(null), []);

  return {
    // State
    depositAddresses,
    transactions,
    currentDeposit,
    isLoading,
    error,
    success,
    
    // Actions
    fetchDepositAddresses,
    createDepositRequest,
    fetchTransactions,
    
    // Helpers
    getAddressesByChain,
    getActiveAddresses,
    
    // Reset functions
    resetError,
    resetSuccess,
    clearCurrentDeposit
  };
};

export default useWalletDeposit;
