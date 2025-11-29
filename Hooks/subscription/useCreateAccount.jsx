import { useState, useEffect } from "react";
import axios from "axios";
import { useCallback } from "react";

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

// Configure axios to use cookies like AuthContext
axios.defaults.withCredentials = true;

const useDepositAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const getDepositAccount = useCallback(async (amount) => {
    console.debug('[useDepositAccount] Initializing request...', { amount });
    
    // Validate amount
    if (!amount || isNaN(amount) || amount < 1) {
      const errorMsg = 'Valid amount is required';
      console.error('[useDepositAccount] Validation error:', errorMsg);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setPaymentDetails(null);

    try {
      const url = `${API_URL}/payment/deposit-account`;
      console.debug(`[useDepositAccount] Making request to: ${url}`, { amount });

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          ...getAuthHeaders(),
        },
        params: {
          amount: amount
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




export const useCreateVirtualAccount = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createVirtualAccount = useCallback(async (amount) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAccount(null);

    try {
      // Validate amount
      if (!amount || isNaN(amount) || amount < 1) {
        throw new Error('Invalid amount');
      }

      // Send amount as query parameter, not in request body
      const response = await axios.post(
        `${API_URL}/payment/create-virtual-account?amount=${amount}`,
        {}, // Empty body since backend expects query params
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          withCredentials: true,
        }
      );

      if (!response.data || !response.data.data) {
        throw new Error('No account data received');
      }

      setAccount(response.data.data);
      setSuccess(true);
      return response.data.data;
    } catch (err) {
      console.error('[useCreateVirtualAccount] Error:', err);
      
      let errorMessage = 'Failed to create virtual account';
      
      if (err.response) {
        // Get more specific error message from backend
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server responded with ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAccount(null);
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    createVirtualAccount,
    account,
    loading,
    error,
    success,
    reset,
  };
};



export const usePayStackPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const initializePayment = useCallback(async (amount) => {
    console.debug('[usePayStackPayment] Initializing payment...', { amount });
    
    // Validate amount (same validation as backend)
    if (!amount || isNaN(amount) || amount < 100) {
      const errorMsg = 'Valid amount is required (minimum: 100)';
      console.error('[usePayStackPayment] Validation error:', errorMsg);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setPaymentData(null);

    try {
      const url = `${API_URL}/payment/initialize`;
      console.debug(`[usePayStackPayment] Making request to: ${url}`, { amount });

      const response = await axios.post(
        url,
        { amount },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          withCredentials: true,
        }
      );

      console.debug('[usePayStackPayment] Full response:', response);
      
      // Check if data exists and has the expected structure
      if (!response.data) {
        throw new Error('No data in response');
      }

      // Handle different possible response structures
      const paymentInfo = response.data.data || response.data;
      
      if (!paymentInfo) {
        throw new Error('Payment data not found in response');
      }

      console.debug('[usePayStackPayment] Extracted payment data:', paymentInfo);
      setPaymentData(paymentInfo);
      setSuccess(true);
      
      return paymentInfo; // Return payment data for immediate use if needed
      
    } catch (err) {
      console.error('[usePayStackPayment] Error:', err);
      
      let errorMessage = 'Failed to initialize payment';
      
      if (err.response) {
        console.error('[usePayStackPayment] Response error:', {
          status: err.response.status,
          data: err.response.data,
        });
        
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server responded with ${err.response.status}`;
      } else if (err.request) {
        console.error('[usePayStackPayment] No response received');
        errorMessage = 'No response from server';
      } else {
        console.error('[usePayStackPayment] Request error:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err; // Re-throw for additional error handling if needed
    } finally {
      setLoading(false);
      console.debug('[usePayStackPayment] Request completed');
    }
  }, []);

  // Reset function to clear states
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setPaymentData(null);
  }, []);

  return {
    initializePayment,
    paymentData, // Contains reference and authorization_url
    loading,
    error,
    success,
    reset,
  };
};





export const useWalletAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const getWalletAddress = useCallback(async () => {
    console.debug('[useWalletAddress] Getting wallet address...');
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    setWalletData(null);

    try {
      const url = `${API_URL}/payment/getWalletAddress`;
      console.debug(`[useWalletAddress] Making request to: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(), // Assuming this function exists
        },
        withCredentials: true,
      });

      console.debug('[useWalletAddress] Full response:', response);
      
      // Check if data exists and has the expected structure
      if (!response.data) {
        throw new Error('No data in response');
      }

      // Handle different possible response structures
      const walletInfo = response.data.data || response.data;
      
      if (!walletInfo) {
        throw new Error('Wallet data not found in response');
      }

      console.debug('[useWalletAddress] Extracted wallet data:', walletInfo);
      setWalletData(walletInfo);
      setSuccess(true);
      
      return walletInfo; // Return wallet data for immediate use
      
    } catch (err) {
      console.error('[useWalletAddress] Error:', err);
      
      let errorMessage = 'Failed to get wallet address';
      
      if (err.response) {
        console.error('[useWalletAddress] Response error:', {
          status: err.response.status,
          data: err.response.data,
        });
        
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server responded with ${err.response.status}`;
      } else if (err.request) {
        console.error('[useWalletAddress] No response received');
        errorMessage = 'No response from server';
      } else {
        console.error('[useWalletAddress] Request error:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err; // Re-throw for additional error handling
    } finally {
      setLoading(false);
      console.debug('[useWalletAddress] Request completed');
    }
  }, []);

  // Reset function to clear states
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setWalletData(null);
  }, []);

  return {
    getWalletAddress,
    walletData, // Contains walletAddress and message
    loading,
    error,
    success,
    reset,
  };
};




export const useCreateTronWallet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const createTronWallet = useCallback(async () => {
    console.debug('[useCreateTronWallet] Creating TRON wallet...');
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    setWalletData(null);

    try {
      const url = `${API_URL}/payment/wallet/create`;
      console.debug(`[useCreateTronWallet] Making request to: ${url}`);

      const response = await axios.post(url, {}, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(), // Assuming this function exists
        },
        withCredentials: true,
      });

      console.debug('[useCreateTronWallet] Full response:', response);
      
      // Check if data exists and has the expected structure
      if (!response.data) {
        throw new Error('No data in response');
      }

      // Handle different possible response structures
      const walletInfo = response.data.data || response.data;
      
      if (!walletInfo) {
        throw new Error('Wallet data not found in response');
      }

      console.debug('[useCreateTronWallet] Created wallet data:', walletInfo);
      setWalletData(walletInfo);
      setSuccess(true);
      
      return walletInfo; // Return wallet data for immediate use
      
    } catch (err) {
      console.error('[useCreateTronWallet] Error:', err);
      
      let errorMessage = 'Failed to create TRON wallet';
      
      if (err.response) {
        console.error('[useCreateTronWallet] Response error:', {
          status: err.response.status,
          data: err.response.data,
        });
        
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server responded with ${err.response.status}`;
      } else if (err.request) {
        console.error('[useCreateTronWallet] No response received');
        errorMessage = 'No response from server';
      } else {
        console.error('[useCreateTronWallet] Request error:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err; // Re-throw for additional error handling
    } finally {
      setLoading(false);
      console.debug('[useCreateTronWallet] Request completed');
    }
  }, []);

  // Reset function to clear states
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setWalletData(null);
  }, []);

  return {
    createTronWallet,
    walletData, // Contains { status, message, walletAddress }
    loading,
    error,
    success,
    reset,
  };
};


 export const useAccountDetails = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchAccountDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAccount(null);

    try {
      const response = await axios.get(`${API_URL}/payment/account-details`, {
        headers: {
          Accept: 'application/json',
          ...getAuthHeaders(),
        },
        withCredentials: true,
      });

      if (!response.data || !response.data.account) {
        throw new Error('No account details found');
      }

      setAccount(response.data.account);
      setSuccess(true);
    } catch (err) {
      console.error('[useAccountDetails] Error:', err);
      if (err.response) {
        setError(err.response.data?.message || `Server responded with ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchAccountDetails,
    account,
    loading,
    error,
    success,
  };
};






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

      if (response.status === 200 && response.data?.status) {
        setPaymentDetails(response.data);
        console.log(response.data, 'response.data from useSubscriptionPayment');  
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
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...getAuthHeaders(),
        },
        withCredentials: true,
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

