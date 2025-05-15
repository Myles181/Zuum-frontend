import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set in .env

// Custom hook for Google authentication
const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [success, setSuccess] = useState(false); // Tracks success state
  const navigate = useNavigate(); // For programmatic navigation

  // Function to initiate Google authentication
  const authenticateWithGoogle = () => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors

    try {
      // Redirect the user to the Google authentication endpoint
      window.location.href = `${API_URL}/auth/google`;
    } catch (err) {
      console.error("Error during Google authentication:", err);
      setError("An unexpected error occurred while redirecting to Google.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // Function to handle the callback from Google
  const handleGoogleCallback = () => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors

    try {
      // Check the current route to determine success or failure
      const currentPath = window.location.pathname;

      if (currentPath === "/auth/google/success") {
        // Success scenario: User was redirected to /auth/google/success
        setSuccess(true);

        // Optionally, fetch user data or store it in local storage
        console.log("Authentication successful. Redirecting to dashboard...");

        // Redirect the user to the dashboard or another page
        setTimeout(() => {
          navigate("/login"); // Replace with your desired route
        }, 2000); // Wait 2 seconds before redirecting
      } else if (currentPath === "/auth/google/failure") {
        // Failure scenario: User was redirected to /auth/google/failure
        throw new Error("Authentication failed");
      } else {
        // Unexpected route
        throw new Error("Unexpected callback route");
      }
    } catch (err) {
      console.error("Error in Google callback:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // Automatically handle the callback when the component mounts
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/auth/google/success" || currentPath === "/auth/google/failure") {
      handleGoogleCallback();
    }
  }, []); // Runs only once when the component mounts

  return { loading, error, success, authenticateWithGoogle };
};

export default useGoogleAuth;