import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling admin wallet operations
 */
export const useWallet = () => {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Handle API errors with appropriate messages
   */
  const handleApiError = useCallback((err, defaultMessage = "An error occurred") => {
    console.error("Wallet API error:", err);
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
          setError("Wallet not found");
          break;
        case 409:
          setError("Wallet already exists");
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
   * Fetch all wallet addresses with optional filters
   * @param {string} chain - Filter by blockchain (e.g., "ETH", "BSC", "TRON")
   * @param {boolean} active - Filter by active status
   */
  const fetchWallets = useCallback(async (chain = null, active = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {};
      if (chain) params.chain = chain;
      if (active !== null) params.active = active;

      const response = await axios.get(`/admin/wallet/all`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        params
      });

      const data =
        response.data?.data ||
        response.data?.wallets ||
        response.data ||
        [];
      setWallets(data);
      return data;
    } catch (err) {
      handleApiError(err, "Failed to fetch wallets");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  /**
   * Add a new wallet address
   * @param {string} address - Wallet address
   * @param {string} chain - Blockchain (e.g., "ETH", "BSC", "TRON")
   * @param {boolean} active - Active status
   */
  const addWallet = useCallback(async (address, chain, active = true) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `/admin/wallet/add`,
        { address, chain, active },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.status === 201) {
        setSuccess("Wallet added successfully");
        // Refetch wallets to update the list
        await fetchWallets();
        return true;
      }
      return false;
    } catch (err) {
      handleApiError(err, "Failed to add wallet");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchWallets, handleApiError]);

  /**
   * Update an existing wallet address
   * @param {number} walletId - Wallet ID
   * @param {string} address - Wallet address
   * @param {string} chain - Blockchain
   * @param {boolean} active - Active status
   */
  const updateWallet = useCallback(async (walletId, { address, chain, active }) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {};
      if (address !== undefined) payload.address = address;
      if (chain !== undefined) payload.chain = chain;
      if (active !== undefined) payload.active = active;

      const response = await axios.put(
        `/admin/wallet/update/${walletId}`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.status === 200) {
        setSuccess("Wallet updated successfully");
        // Refetch wallets to update the list
        await fetchWallets();
        return true;
      }
      return false;
    } catch (err) {
      handleApiError(err, "Failed to update wallet");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchWallets, handleApiError]);

  /**
   * Delete a wallet address
   * @param {number} walletId - Wallet ID
   */
  const deleteWallet = useCallback(async (walletId) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.delete(
        `/admin/wallet/delete/${walletId}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.status === 200) {
        setSuccess("Wallet deleted successfully");
        // Refetch wallets to update the list
        await fetchWallets();
        return true;
      }
      return false;
    } catch (err) {
      handleApiError(err, "Failed to delete wallet");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchWallets, handleApiError]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => setError(null), []);

  /**
   * Reset success state
   */
  const resetSuccess = useCallback(() => setSuccess(null), []);

  // Fetch wallets when hook is first used
  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return {
    wallets,
    isLoading,
    error,
    success,
    fetchWallets,
    addWallet,
    updateWallet,
    deleteWallet,
    resetError,
    resetSuccess
  };
};
