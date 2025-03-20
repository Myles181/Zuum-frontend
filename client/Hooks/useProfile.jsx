import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set in .env

const useProfile = () => {
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages
  const [profile, setProfile] = useState(null); // Stores user profile data

  // Function to fetch user profile
  const getProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      // Assume the user has a valid auth token stored in localStorage or cookies
      const token = localStorage.getItem("authToken"); 

      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setProfile(response.data);
      }
    } catch (err) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    getProfile();
  }, []);

  return { loading, error, profile };
};

export { useProfile };
