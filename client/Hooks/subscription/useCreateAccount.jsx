import { useCallback, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('[useDepositAccount] No auth token found');
      setError('Authentication token missing');
      setLoading(false);
      return;
    }

    const url = `${API_URL}/payment/deposit-account`;
    console.debug(`[useDepositAccount] Making request to: ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
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







export const useFlutterwaveWebhook = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [webhookResponse, setWebhookResponse] = useState(null); // Stores webhook response data

  // Retrieve the token from localStorage
  const token = localStorage.getItem("authToken");

  // Function to handle Flutterwave webhook events
  const handleWebhook = async (eventData) => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    setWebhookResponse(null); // Reset response data

    try {
      // Make a POST request to handle the webhook with Authorization header
      const response = await axios.post(
        `${API_URL}/payment/webhooks/flutterwave`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Check if the webhook was processed successfully
      if (response.status === 200) {
        setWebhookResponse(response.data); // Store the webhook response
      }
    } catch (err) {
      console.error("Webhook Error:", err.response || err);
      // Handle errors based on the response status code
      if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
          setError(data.error || "Unauthorized. Please login to continue.");
        } else if (status === 400) {
          setError(data.error || "Invalid webhook data.");
        } else if (status === 500) {
          setError(data.error || "Server error. Please try again later.");
        } else {
          setError(data.error || "Failed to process webhook.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
      throw err; // Re-throw the error for component-level handling
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return {
    loading,
    error,
    webhookResponse,
    handleWebhook,
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
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_URL}/payment/subscription`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
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

