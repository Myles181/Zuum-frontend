import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for updating withdrawal status
 */
export const useUpdateWithdrawal = () => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  /**
   * Update withdrawal status
   */
  const updateWithdrawalStatus = useCallback(async (withdrawalId, status, reason) => {
    setLoadingUpdate(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const payload = { status, reason };

      const response = await axios.patch(
        `/withdrawals/admin/update/by/${withdrawalId}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
        );
        if (response.data) { 
            setUpdateSuccess(true);
        }

        // success message disappears after 3s
        // setTimeout(() => setUpdateSuccess(false), 3000);
        return true;
      

      return false;

    } catch (err) {
      console.error("Update withdrawal error:", err);

      if (err.response) {
        switch (err.response.status) {
          case 400: setUpdateError("Invalid update request"); break;
          case 401: setUpdateError("Unauthorized – login again"); break;
          case 403: setUpdateError("Forbidden – no permission"); break;
          case 404: setUpdateError("Withdrawal not found"); break;
          case 500: setUpdateError("Internal server error"); break;
          default: setUpdateError(err.response.data?.message || "Failed to update");
        }
      } else {
        setUpdateError("Network error – Check your connection");
      }

      return false;
    } finally {
      setLoadingUpdate(false);
    }
  }, []);

  return {
    updateWithdrawalStatus,
    loadingUpdate,
    updateError,
    updateSuccess
  };
};
