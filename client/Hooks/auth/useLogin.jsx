import { useState } from "react";
import axios from "axios";

// Configure axios to send and accept cookies
// axios.defaults.withCredentials = true;

// Get the API base URL
const API_URL = import.meta.env.VITE_API_URL;

// Detect iOS Safari
const isIOSSafari = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
};

// Detect iOS devices (including Chrome iOS)
const isIOSDevice = () => {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
};

// Custom hook for user login using cookies with debug logs
// Custom hook for user login using cookies with debug logs
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null); // Optional: store token in state

  // Utility to read cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

   const login = async (credentials) => {
    console.debug("[useLogin] Starting login with credentials:", credentials);
    console.debug("[useLogin] iOS device detected:", isIOSDevice());
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      console.debug("[useLogin] Sending POST to", `${API_URL}/auth/login`);
      const response = await axios.post(
        `${API_URL}/auth/login`,
        credentials
      );
      console.debug("[useLogin] Received response:", response);
      console.debug("[useLogin] Response headers:", response.headers);
      console.debug("[useLogin] Response data:", response.data);
      
      if (response.status === 200) {
        console.debug("[useLogin] Login successful, checking cookies...");
        
        // Handle iOS devices specifically
        if (isIOSDevice()) {
          console.debug("[useLogin] iOS device detected, handling token storage");
          const cookieToken = getCookie("token");
          const responseToken = response.data?.token;
          const headerToken = response.headers['authorization'] || response.headers['Authorization'];
          const token = responseToken || cookieToken || headerToken?.replace('Bearer ', '');
          
          console.debug("[useLogin] Token sources - cookie:", cookieToken, 'response:', responseToken, 'header:', headerToken);
          
          if (token) {
            console.debug("[useLogin] Token found for iOS device:", token);
            setToken(token);
            // Store in localStorage as backup for iOS devices
            localStorage.setItem('auth_token', token);
            // Set Authorization header for subsequent requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            console.warn("[useLogin] No token found for iOS device");
            // Try to extract token from response body if it exists
            if (response.data && typeof response.data === 'object') {
              console.debug("[useLogin] Response data keys:", Object.keys(response.data));
              // Look for common token field names
              const possibleTokenFields = ['token', 'access_token', 'auth_token', 'jwt', 'accessToken'];
              for (const field of possibleTokenFields) {
                if (response.data[field]) {
                  console.debug("[useLogin] Found token in field:", field, response.data[field]);
                  setToken(response.data[field]);
                  localStorage.setItem('auth_token', response.data[field]);
                  axios.defaults.headers.common['Authorization'] = `Bearer ${response.data[field]}`;
                  break;
                }
              }
            }
          }
        } else {
          // Regular cookie handling for other browsers
          const cookieToken = getCookie("token");
          if (cookieToken) {
            console.debug("[useLogin] Token extracted from cookie:", cookieToken);
            setToken(cookieToken);
          } else {
            console.warn("[useLogin] Token not found in cookies.");
          }
        }
        setSuccess(true);
      }
    } catch (err) {
      console.error("[useLogin] Error during login:", err);
      if (err.response) {
        console.debug("[useLogin] Response status:", err.response.status);
        const { status, data } = err.response;
        console.debug("[useLogin] Response data:", data);
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
        console.debug("[useLogin] No response from server, network error:", err.message);
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      console.debug("[useLogin] Ending login, loading=false");
      setLoading(false);
    }
  };

  return { loading, error, success, login, token };
};

// Custom hook for initiating forgot-password with debug logs
export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const forgotPassword = async (email) => {
    console.debug("[useForgotPassword] Triggering forgot password for:", email);
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      console.debug("[useForgotPassword] Sending POST to", `${API_URL}/auth/forgot-password`);
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email }
      );
      console.debug("[useForgotPassword] Received response:", response);
      if (response.status === 200) {
        console.debug("[useForgotPassword] Forgot password email sent");
        localStorage.setItem('password-reset-email', email);
        setSuccess(true);
      }
    } catch (err) {
      console.error("[useForgotPassword] Error during forgot password:", err);
      if (err.response) {
        console.debug("[useForgotPassword] Response status:", err.response.status);
        const { status, data } = err.response;
        console.debug("[useForgotPassword] Response data:", data);
        if (status === 404) {
          setError("User not found. Please check your email.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        console.debug("[useForgotPassword] Network or other error:", err.message);
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      console.debug("[useForgotPassword] Ending forgot password, loading=false");
      setLoading(false);
    }
  };

  return { loading, error, success, forgotPassword };
};

// Custom hook for resetting password with debug logs
export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (token, newPassword) => {
    console.debug("[useResetPassword] Starting reset with token and newPassword");
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const email = localStorage.getItem("password-reset-email");
      console.debug("[useResetPassword] Retrieved email from storage:", email);
      if (!email) {
        setError("Email not found. Redirecting to Forgot Password page...");
        console.debug("[useResetPassword] No email found, returning early");
        return;
      }

      console.debug("[useResetPassword] Sending POST to", `${API_URL}/auth/reset-password`);
      const response = await axios.post(
        `${API_URL}/auth/reset-password`,
        { email, token, newPassword }
      );
      console.debug("[useResetPassword] Received response:", response);

      if (response.status === 200) {
        console.debug("[useResetPassword] Password reset successful");
        setSuccess(true);
        setTimeout(() => {
          console.debug("[useResetPassword] Redirecting to /login");
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      console.error("[useResetPassword] Error during reset password:", err);
      console.debug("[useResetPassword] Error details:", err.response?.data || err.message);
      setError(
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        "An unexpected error occurred."
      );
    } finally {
      console.debug("[useResetPassword] Ending reset, loading=false");
      setLoading(false);
    }
  };

  return { loading, error, success, resetPassword };
};
