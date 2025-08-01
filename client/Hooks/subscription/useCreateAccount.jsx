import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Utility function to get authenticated headers
const getAuthHeaders = () => {
  const headers = {};
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Configure axios to use cookies like AuthContext
axios.defaults.withCredentials = true;

const useDepositAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const getDepositAccount = useCallback(async () => {
    console.debug('[useDepositAccount] Initializing request...');
    setLoading(true);
    setError(null);
    setSuccess(false);
    setPaymentDetails(null);

    // Use cookies instead of localStorage token
    const url = `${API_URL}/payment/deposit-account`;
    console.debug(`[useDepositAccount] Making request to: ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });

      console.debug('[useDepositAccount] Full response:', response);
      
      // Check if data exists and has the expected structure
      if (!response.data) {
        throw new Error('No data in response');
      }

      // Handle different possible response structures
      const details = response.data.paymentDetails || 
                     response.data.data || 
                     response.data;
      
      if (!details) {
        throw new Error('Payment details not found in response');
      }

      console.debug('[useDepositAccount] Extracted payment details:', details);
      setPaymentDetails(details);
      setSuccess(true);
      
    } catch (err) {
      console.error('[useDepositAccount] Error:', err);
      
      let errorMessage = 'Failed to fetch payment details';
      
      if (err.response) {
        console.error('[useDepositAccount] Response error:', {
          status: err.response.status,
          data: err.response.data,
        });
        
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server responded with ${err.response.status}`;
      } else if (err.request) {
        console.error('[useDepositAccount] No response received');
        errorMessage = 'No response from server';
      } else {
        console.error('[useDepositAccount] Request error:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.debug('[useDepositAccount] Request completed');
    }
  }, []);

  return {
    getDepositAccount,
    paymentDetails,
    loading,
    error,
    success,
  };
};

export default useDepositAccount;






export const useSubscriptionPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  /**
   * Initiates a subscription payment
   * @returns {Promise<{status: boolean, message: string, paymentLink: string}|undefined>}
   */
  const initiateSubscriptionPayment = async () => {
    setLoading(true);
    setError(null);
    setPaymentDetails(null);

    try {
      // Use cookies instead of localStorage token
      const response = await axios.get(`${API_URL}/payment/subscription`, {
        headers: {
          Accept: 'application/json',
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });
      });

      if (response.status === 200 && response.data?.status) {
        setPaymentDetails(response.data);
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Invalid response from server');
      }
    } catch (err) {
      let errorMessage = 'Failed to initiate subscription payment';
      
      if (err.response) {
        // Handle specific error statuses
        switch (err.response.status) {
          case 401:
            errorMessage = 'Unauthorized - Please login again';
            break;
          case 404:
            errorMessage = 'Payment plan not found';
            break;
          case 409:
            errorMessage = 'You already have an active subscription';
            break;
          default:
            errorMessage = err.response.data?.error || 
                         err.response.data?.message || 
                         `Server error (${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Redirects user to payment page if payment link exists
   */
  const redirectToPayment = () => {
    if (!paymentDetails?.paymentLink) {
      throw new Error('No payment link available');
    }
    window.location.href = paymentDetails.paymentLink;
  };

  /**
   * Retries payment initiation
   */
  const retryPayment = async () => {
    return await initiateSubscriptionPayment();
  };

  return {
    loading,
    error,
    paymentDetails,
    initiateSubscriptionPayment,
    redirectToPayment,
    retryPayment
  };
};







export const usePaymentAccount = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPaymentDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use cookies instead of localStorage token
      const response = await axios.get(`${API_URL}/payment/create`, {
        headers: {
          Accept: 'application/json',
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });
      });

      console.log('API Response:', response.data); // Debug log

      if (response.status === 200 && response.data?.paymentDetails) {
        setPaymentDetails(response.data.paymentDetails);
      } else {
        throw new Error(response.data?.message || 'Invalid response structure');
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch payment details';
      
      if (err.response) {
        // Handle specific error statuses
        switch (err.response.status) {
          case 404:
            errorMessage = 'No payment details found for this user';
            break;
          default:
            errorMessage = err.response.data?.message || 
                         `Server error (${err.response.status})`;
        }
      } else if (err.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    paymentDetails,
    loading,
    error,
    fetchPaymentDetails,
    resetError
  };
};







export const useWithdrawal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState(null);

  const initiateWithdrawal = useCallback(async (withdrawalRequest) => {
    console.debug('[useWithdrawal] Initializing request...');
    setLoading(true);
    setError(null);
    setSuccess(false);
    setWithdrawalData(null);

    // Use cookies instead of localStorage token
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('[useWithdrawal] No auth token found');
      setError('Authentication token missing');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!withdrawalRequest.amount) {
      setError('Amount is required');
      setLoading(false);
      return;
    }

    // If saving account details, validate account info
    if (withdrawalRequest.save === true) {
      if (!withdrawalRequest.accountNumber || !withdrawalRequest.bankCode) {
        setError('Account number and bank code are required when saving');
        setLoading(false);
        return;
      }
    }

    const url = `${API_URL}/payment/withdrawal`;
    console.debug(`[useWithdrawal] Making request to: ${url}`);

    try {
      const response = await axios.post(url, withdrawalRequest, {
        headers: {
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      console.debug('[useWithdrawal] Full response:', response);
      
      if (!response.data) {
        throw new Error('No data in response');
      }

      const result = response.data.data || response.data;
      
      if (!result) {
        throw new Error('Withdrawal data not found in response');
      }

      console.debug('[useWithdrawal] Withdrawal successful:', result);
      setWithdrawalData(result);
      setSuccess(true);
      
    } catch (err) {
      console.error('[useWithdrawal] Error:', err);
      
      let errorMessage = 'Failed to initiate withdrawal';
      
      if (err.response) {
        console.error('[useWithdrawal] Response error:', {
          status: err.response.status,
          data: err.response.data,
        });
        
        // Handle different error response formats
        if (err.response.status === 400) {
          errorMessage = err.response.data?.error || 'Invalid request data';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication failed - please login again';
        } else if (err.response.status === 406) {
          errorMessage = err.response.data?.message || 'Insufficient funds';
        } else if (err.response.status === 500) {
          errorMessage = err.response.data?.error || 'Server error';
        } else {
          errorMessage = err.response.data?.message || 
                        err.response.data?.error || 
                        `Server responded with ${err.response.status}`;
        }
      } else if (err.request) {
        console.error('[useWithdrawal] No response received');
        errorMessage = 'No response from server';
      } else {
        console.error('[useWithdrawal] Request error:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.debug('[useWithdrawal] Request completed');
    }
  }, []);

  return {
    initiateWithdrawal,
    withdrawalData,
    loading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
      setWithdrawalData(null);
    }
  };
};

