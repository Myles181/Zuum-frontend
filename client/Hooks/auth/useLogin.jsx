import { useState } from "react";
import axios from "axios";
// import { useSearchParams } from "react-router-dom";

// Get the Api url
const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL);

// Custom hook for user login
const useLogin = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [token, setToken] = useState(null); // Stores the JWT token on successful login

  // Function to handle user login
  const login = async (credentials) => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    setToken(null); // Reset token

    try {
      // Make a POST request to the API
      const response = await axios.post(
        // "https://zuum-backend-qs8x.onrender.com/api/auth/login", // Replace with your actual login endpoint
        `${API_URL}/auth/login`,
        credentials
      );

      // Check the response status
      if (response.status === 200) {
        const { token } = response.data; // Extract the JWT token from the response
        setToken(token); // Store the token

        
        // Save the token to localStorage
        localStorage.setItem("authToken", token);
      }
    } catch (err) {
      // Handle errors based on status code
      if (err.response) {
        const { status } = err.response;

        if (status === 400) {
          setError("Validation errors. Please check your input.");
        } else if (status === 401) {
          setError("Invalid credentials. Please check your email and password.");
        } else if (status === 406) {
          setError("Email is not verified. Please verify your email first.");
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

  return { loading, error, token, login };
};

// Custom hook for forgot password
const useForgotPassword = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [success, setSuccess] = useState(false); // Tracks success state

  // Function to send a password reset link to the user's email
  const forgotPassword = async (email) => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    setSuccess(false); // Reset success state

    try {
      // Make a POST request to the API
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`, // Replace with your actual forgot password endpoint
        { email }
      );

      // Check the response status
      if (response.status === 200) {
        localStorage.setItem('password-reset-email', email)
        setSuccess(true);
      }
    } catch (err) {
      // Handle errors based on status code
      if (err.response) {
        const { status } = err.response;

        if (status === 404) {
          setError("User not found. Please check your email.");
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

  return { loading, error, success, forgotPassword };
};

// Custom hook for forgot password
const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const ResetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const email = localStorage.getItem("password-reset-email");
      if (!email) {
        setError("Email not found. Redirecting to Forgot Password page...");
      }

      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        token,
        newPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/login"; // Redirect manually
        }, 2000);
        return;
      }
    } catch (err) {
      console.log(err)
      setError(
        err.response?.data?.error.msg || err.response?.data?.error || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, ResetPassword }; // Ensure consistent return
};


export { useLogin, useForgotPassword, useResetPassword };