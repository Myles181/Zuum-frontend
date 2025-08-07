import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheck } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useImprovedAuth } from "../../contexts/ImprovedAuthContext";
import LoadingScreen from "../../components/LoadingScreen";

const ImprovedLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { login, isLoading, errors } = useImprovedAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = location.state?.from?.pathname || "/home";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      const success = await login(formData);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    return errors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Show loading screen during authentication
  if (isLoading) {
    return (
      <LoadingScreen
        currentStep={2}
        totalSteps={4}
        stepMessages={[
          "Authenticating...",
          "Loading your profile...",
          "Setting up your workspace...",
          "Welcome back!"
        ]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to your Zuum account</p>
        </div>

        {/* Error Display */}
        {errors.auth && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{errors.auth}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {passwordVisible ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <Link
              to="/forgot"
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImprovedLogin; 