import { useState } from "react";
import axios from "axios";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

const useBankTransferPayment = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [paymentDetails, setPaymentDetails] = useState(null); // Stores payment details on success

  // Retrieve the token from localStorage
  const token = localStorage.getItem("authToken");

  // Function to create a bank transfer payment
  const createBankTransferPayment = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    setPaymentDetails(null); // Reset payment data

    try {
      // Make a GET request to initiate a bank transfer payment with Authorization header
      const response = await axios.get(`${API_URL}/payment/create`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the request headers
          Accept: "application/json", // Specify we want JSON response
        },
      });

      // Check if the payment was initiated successfully
      if (response.status === 200) {
        setPaymentDetails(response.data); // Store the payment details returned from the API
      }
    } catch (err) {
      console.error("API Error:", err.response || err);
      // Handle errors based on the response status code
      if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
          setError(data.error || "Unauthorized. Please login to continue.");
        } else if (status === 404) {
          setError(data.error || "Payment plan not found");
        } else if (status === 500) {
          setError(data.error || "Server error. Please try again later.");
        } else {
          setError(data.error || "An unexpected error occurred.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return { 
    loading, 
    error, 
    paymentDetails, 
    createBankTransferPayment 
  };
};

export default useBankTransferPayment;







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