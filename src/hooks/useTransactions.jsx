import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for fetching user payment transactions
 * Uses the /api/payment/transactions endpoint
 * Returns blockchain asset balances and transaction history for the user
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle API errors with appropriate messages
   */
  const handleApiError = useCallback((err) => {
    console.error("Payment Transactions API error:", err);
    if (err.response) {
      switch (err.response.status) {
        case 400:
          setError(err.response.data?.message || "Invalid request");
          break;
        case 401:
          setError("Unauthorized – please login again");
          break;
        case 403:
          setError("Forbidden – access denied");
          break;
        case 404:
          setError("No transactions found");
          break;
        case 500:
          setError(err.response.data?.message || "Server error – try again later");
          break;
        default:
          setError(err.response.data?.error || err.response.data?.message || "Failed to fetch transactions");
      }
    } else {
      setError("Network error – please check your connection");
    }
  }, []);

  /**
   * Fetch all payment transactions for the authenticated user
   * Endpoint: GET /api/payment/transactions
   */
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/payment/transactions`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      // Handle various response structures
      const data = response.data?.transactions || 
                   response.data?.data || 
                   response.data || 
                   [];
      
      // Extract balances if available
      const balanceData = response.data?.balances || [];
      
      setTransactions(Array.isArray(data) ? data : []);
      setBalances(Array.isArray(balanceData) ? balanceData : []);
      return data;
    } catch (err) {
      handleApiError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  /**
   * Filter transactions by type
   * @param {string} type - Transaction type (e.g., "deposit", "withdrawal", "subscription", "promotion_audio", "bank_deposit")
   */
  const getTransactionsByType = useCallback((type) => {
    return transactions.filter((t) => t.type === type);
  }, [transactions]);

  /**
   * Filter transactions by status
   * @param {string} status - Transaction status (e.g., "success", "successful", "pending", "failed")
   */
  const getTransactionsByStatus = useCallback((status) => {
    // Normalize status check (API uses both "success" and "successful")
    return transactions.filter((t) => 
      t.status === status || 
      (status === "success" && t.status === "successful") ||
      (status === "successful" && t.status === "success")
    );
  }, [transactions]);

  /**
   * Get total amount by transaction type
   * @param {string} type - Transaction type
   */
  const getTotalByType = useCallback((type) => {
    return transactions
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  /**
   * Get transaction statistics
   */
  const getStats = useCallback(() => {
    const totalDeposits = transactions
      .filter((t) => t.type === "deposit" || t.type === "bank_deposit")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalWithdrawals = transactions
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalSubscriptions = transactions
      .filter((t) => t.type === "subscription")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalPromotions = transactions
      .filter((t) => t.type?.includes("promotion"))
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      totalDeposits,
      totalWithdrawals,
      totalSubscriptions,
      totalPromotions,
      transactionCount: transactions.length
    };
  }, [transactions]);

  /**
   * Get balance by asset/currency type
   * @param {string} asset - Asset type (e.g., "USDT", "NGN")
   */
  const getBalanceByAsset = useCallback((asset) => {
    return balances.find((b) => 
      b.asset?.toUpperCase() === asset?.toUpperCase() ||
      b.currency?.toUpperCase() === asset?.toUpperCase()
    );
  }, [balances]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => setError(null), []);

  // Fetch transactions when hook is first used
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    balances,
    isLoading,
    error,
    fetchTransactions,
    getTransactionsByType,
    getTransactionsByStatus,
    getTotalByType,
    getStats,
    getBalanceByAsset,
    resetError
  };
};

export default useTransactions;
