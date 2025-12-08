import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Admin hook for fetching transaction history
 *
 * Endpoint:
 * - GET /api/admin/transactions/history → fetch transaction history with filters
 */
export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    total_transactions: '0',
    total_successful_amount: 0,
    total_pending_amount: 0,
    total_failed_amount: 0,
    successful_count: '0',
    pending_count: '0',
    failed_count: '0',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    pages: 1,
  });

  /**
   * Fetch transaction history with optional filters
   * @param {Object} options
   * @param {number} [options.userId] - Filter by user ID
   * @param {string} [options.type] - Filter by transaction type (bank_deposit, usdt_deposit, withdrawal, subscription, etc.)
   * @param {string} [options.status] - Filter by status (pending, successful, failed, success)
   * @param {string} [options.currency] - Filter by currency (NGN, USDT, etc.)
   * @param {string} [options.startDate] - Filter from date (ISO 8601 format)
   * @param {string} [options.endDate] - Filter until date (ISO 8601 format)
   * @param {number} [options.limit=50] - Number of results per page
   * @param {number} [options.offset=0] - Number of results to skip
   */
  const fetchTransactionHistory = useCallback(async (options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        limit: options.limit ?? 50,
        offset: options.offset ?? 0,
      };

      // Add optional filters
      if (options.userId) params.userId = options.userId;
      if (options.type) params.type = options.type;
      if (options.status) params.status = options.status;
      if (options.currency) params.currency = options.currency;
      if (options.startDate) params.startDate = options.startDate;
      if (options.endDate) params.endDate = options.endDate;

      const response = await axios.get('/admin/transactions/history', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const data = response.data?.data || [];
      const transactionsList = Array.isArray(data) ? data : [];

      setTransactions(transactionsList);

      // Set summary data
      if (response.data?.summary) {
        setSummary({
          total_transactions: response.data.summary.total_transactions || '0',
          total_successful_amount: parseFloat(response.data.summary.total_successful_amount) || 0,
          total_pending_amount: parseFloat(response.data.summary.total_pending_amount) || 0,
          total_failed_amount: parseFloat(response.data.summary.total_failed_amount) || 0,
          successful_count: response.data.summary.successful_count || '0',
          pending_count: response.data.summary.pending_count || '0',
          failed_count: response.data.summary.failed_count || '0',
        });
      }

      // Set pagination data
      if (response.data?.pagination) {
        setPagination({
          total: response.data.pagination.total ?? transactionsList.length,
          limit: response.data.pagination.limit ?? params.limit,
          offset: response.data.pagination.offset ?? params.offset,
          pages: response.data.pagination.pages ?? 1,
        });
      } else {
        setPagination({
          total: transactionsList.length,
          limit: params.limit,
          offset: params.offset,
          pages: 1,
        });
      }

      return { transactions: transactionsList, summary: response.data?.summary };
    } catch (err) {
      console.error('Fetch transaction history error:', err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'Invalid request parameters');
            break;
          case 401:
            setError('Unauthorized – please login again');
            break;
          case 500:
            setError('Server error – try again later');
            break;
          default:
            setError(
              err.response.data?.error ||
              err.response.data?.message ||
              'Failed to fetch transaction history'
            );
        }
      } else {
        setError('Network error – please check your connection');
      }

      setTransactions([]);
      return { transactions: [], summary: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch transactions for a specific user
   * @param {number} userId - User ID
   * @param {Object} options - Additional filter options
   */
  const fetchUserTransactions = useCallback(async (userId, options = {}) => {
    if (!userId) {
      setError('User ID is required');
      return { transactions: [], summary: null };
    }
    return fetchTransactionHistory({ ...options, userId });
  }, [fetchTransactionHistory]);

  /**
   * Fetch transactions by type
   * @param {string} type - Transaction type (bank_deposit, usdt_deposit, withdrawal, subscription, etc.)
   * @param {Object} options - Additional filter options
   */
  const fetchTransactionsByType = useCallback(async (type, options = {}) => {
    return fetchTransactionHistory({ ...options, type });
  }, [fetchTransactionHistory]);

  /**
   * Fetch transactions by status
   * @param {string} status - Transaction status (pending, successful, failed, success)
   * @param {Object} options - Additional filter options
   */
  const fetchTransactionsByStatus = useCallback(async (status, options = {}) => {
    return fetchTransactionHistory({ ...options, status });
  }, [fetchTransactionHistory]);

  /**
   * Fetch transactions by date range
   * @param {string} startDate - Start date (ISO 8601 format)
   * @param {string} endDate - End date (ISO 8601 format)
   * @param {Object} options - Additional filter options
   */
  const fetchTransactionsByDateRange = useCallback(async (startDate, endDate, options = {}) => {
    return fetchTransactionHistory({ ...options, startDate, endDate });
  }, [fetchTransactionHistory]);

  /** Reset error state */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  /** Clear transactions and reset state */
  const clearTransactions = useCallback(() => {
    setTransactions([]);
    setError(null);
    setSummary({
      total_transactions: '0',
      total_successful_amount: 0,
      total_pending_amount: 0,
      total_failed_amount: 0,
      successful_count: '0',
      pending_count: '0',
      failed_count: '0',
    });
    setPagination({
      total: 0,
      limit: 50,
      offset: 0,
      pages: 1,
    });
  }, []);

  return {
    transactions,
    summary,
    isLoading,
    error,
    pagination,
    fetchTransactionHistory,
    fetchUserTransactions,
    fetchTransactionsByType,
    fetchTransactionsByStatus,
    fetchTransactionsByDateRange,
    resetError,
    clearTransactions,
  };
};
