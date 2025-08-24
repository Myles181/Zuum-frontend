import { useState } from "react";
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

// Custom hook for user signup
const useSignup = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [success, setSuccess] = useState(false); // Tracks success state

  // Function to handle user signup
  const signup = async (userData) => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    setSuccess(false); // Reset success state

    try {
      // Assign default identity if not provided
      const { firstname, lastname, middlename, phonenumber, username, email, password, identity } = userData;

      // Make a POST request to the API
      const response = await axios.post(
        `${API_URL}/auth/signup`, // Replace with your actual signup endpoint
        { firstname, lastname, middlename, phonenumber, username, email, password, identity },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      // Check the response status
      if (response.status === 201) {
        setSuccess(true); // Registration successful
        return true; // Explicitly return true on success
      }
    } catch (err) {
      // Handle errors based on status code
      if (err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          setError(data.errors ? data.errors.map((e) => e.msg).join(", ") : "Validation errors.");
        } else if (status === 406 || status === 409) {
          setError("Email already exists. Please log in or use a different email.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }

    return false; // Explicitly return false on failure
  };

  return { loading, error, success, signup };
};

export default useSignup;

// Custom hook for email verification
const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [success, setSuccess] = useState(false); // Tracks success state

  // Function to verify email using OTP
  const verifyEmail = async (email, otp) => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    setSuccess(false); // Reset success state

    try {
      // Make a POST request to the API
      const response = await axios.post(
        '/auth/verify-email', // API endpoint
        { email, otp },
        {
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed (like authentication tokens)
          },
          withCredentials: true,
        }
      );

      // Check the response status
      if (response.status === 200) {
        setSuccess(true); // Email verified successfully
      }
    } catch (err) {
      // Handle errors based on status code
      if (err.response) {
        const { status } = err.response;

        if (status === 400) {
          setError("Invalid OTP. Please try again.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // Optional: Reset function to clear states
  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return { 
    loading, 
    error, 
    success, 
    verifyEmail,
    reset 
  };
};

// Custom hook for resending OTP
const useResendOtp = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [success, setSuccess] = useState(false); // Tracks success state

  // Function to resend OTP to the user's email
  const resendOtp = async (email) => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    setSuccess(false); // Reset success state

    try {
      // Make a POST request to the API
      const response = await axios.post(
        `${API_URL}/auth/resend-otp`, // Replace with your actual resend OTP endpoint
        { email },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      // Check the response status
      if (response.status === 200) {
        setSuccess(true); // OTP resent successfully
      }
    } catch (err) {
      // Handle errors based on status code
      if (err.response) {
        const { status } = err.response;

        if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return { loading, error, success, resendOtp };
};

export { useSignup, useVerifyEmail, useResendOtp };