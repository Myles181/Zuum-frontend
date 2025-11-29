import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

/**
 * Custom hook for handling admin subscription operations
 */
export const useSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all subscription plans
   */
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/admin/subscriptions/plans`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      const data =
        response.data?.data ||
        response.data?.plans ||
        response.data ||
        [];
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch plans error:", err);
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Unauthorized – please login again");
            break;
          case 403:
            setError("Forbidden – insufficient privileges");
            break;
          case 500:
            setError("Server error – try again later");
            break;
          default:
            setError(err.response.data?.message || "Failed to fetch subscription plans");
        }
      } else {
        setError("Network error – please check your connection");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new subscription plan
   */
  const createPlan = useCallback(async (planData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `/admin/subscriptions/plans`,
        planData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      const newPlan = response.data?.data || response.data;
      
      // Refresh plans list
      await fetchPlans();
      
      return { success: true, data: newPlan };
    } catch (err) {
      console.error("Create plan error:", err);
      let errorMessage = "Failed to create subscription plan";
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data?.message || "Missing required fields or invalid values";
            break;
          case 401:
            errorMessage = "Unauthorized – please login again";
            break;
          case 403:
            errorMessage = "Forbidden – insufficient privileges";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlans]);

  /**
   * Update a subscription plan
   */
  const updatePlan = useCallback(async (planId, planData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `/admin/subscriptions/plans/${planId}`,
        planData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      const updatedPlan = response.data?.data || response.data;
      
      // Refresh plans list
      await fetchPlans();
      
      return { success: true, data: updatedPlan };
    } catch (err) {
      console.error("Update plan error:", err);
      let errorMessage = "Failed to update subscription plan";
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data?.message || "Invalid plan name or frequency";
            break;
          case 401:
            errorMessage = "Unauthorized – please login again";
            break;
          case 403:
            errorMessage = "Forbidden – insufficient privileges";
            break;
          case 404:
            errorMessage = "Plan not found";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlans]);

  /**
   * Soft delete a subscription plan
   */
  const deletePlan = useCallback(async (planId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `/admin/subscriptions/plans/${planId}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      // Refresh plans list
      await fetchPlans();
      
      return { success: true, data: response.data?.data || response.data };
    } catch (err) {
      console.error("Delete plan error:", err);
      let errorMessage = "Failed to delete subscription plan";
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Unauthorized – please login again";
            break;
          case 403:
            errorMessage = "Forbidden – insufficient privileges";
            break;
          case 404:
            errorMessage = "Plan not found";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlans]);

  /**
   * Update a user's subscription
   */
  const updateUserSubscription = useCallback(async (userId, planId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `/admin/subscriptions/user`,
        { id: planId, userId: userId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      const result = response.data?.data || response.data;
      
      return { success: true, data: result };
    } catch (err) {
      console.error("Update user subscription error:", err);
      let errorMessage = "Failed to update user subscription";
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data?.message || "User cannot have this plan because of their identity";
            break;
          case 401:
            errorMessage = "Unauthorized – please login again";
            break;
          case 403:
            errorMessage = "Forbidden – insufficient privileges";
            break;
          case 404:
            errorMessage = "User or plan not found";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset error
   */
  const resetError = useCallback(() => setError(null), []);

  // Fetch plans when hook is used
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    isLoading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    updateUserSubscription,
    resetError
  };
};

