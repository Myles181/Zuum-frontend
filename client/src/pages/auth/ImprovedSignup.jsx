import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSpinner, 
  FaCheck,
  FaArrowRight,
  FaArrowLeft
} from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useImprovedAuth } from "../../contexts/ImprovedAuthContext";
import LoadingScreen from "../../components/LoadingScreen";

const ImprovedSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    identity: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { signup, isLoading, errors } = useImprovedAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const identity = searchParams.get("identity");

  // Set identity from URL params
  useEffect(() => {
    if (identity) {
      setFormData(prev => ({
        ...prev,
        identity: identity.replace(/-/g, " ")
      }));
    }
  }, [identity]);

  // Validate current step
  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.firstname.trim()) errors.firstname = "First name is required";
      if (!formData.lastname.trim()) errors.lastname = "Last name is required";
    }
    
    if (step === 2) {
      if (!formData.username.trim()) errors.username = "Username is required";
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email";
      }
      if (!formData.phonenumber.trim()) {
        errors.phonenumber = "Phone number is required";
      } else if (!/^[0-9]{10,15}$/.test(formData.phonenumber)) {
        errors.phonenumber = "Please enter a valid phone number";
      }
    }
    
    if (step === 3) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (step === 4) {
      if (!formData.identity.trim()) {
        errors.identity = "Please select your identity";
      }
    }
    
    return errors;
  };

  // Handle next step
  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setValidationErrors({});
    } else {
      setValidationErrors(stepErrors);
    }
  };

  // Handle previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setValidationErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setValidationErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      const success = await signup(formData);
      if (success) {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
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
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  // Show loading screen during authentication
  if (isLoading) {
    return (
      <LoadingScreen
        currentStep={2}
        totalSteps={4}
        stepMessages={[
          "Creating your account...",
          "Setting up your profile...",
          "Preparing your workspace...",
          "Welcome to Zuum!"
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
            <FaUser className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join as {formData.identity ? formData.identity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "User"}
          </h1>
          <p className="text-gray-300">Create your account and start your journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                ${step < currentStep ? 'bg-green-500 text-white' : 
                  step === currentStep ? 'bg-blue-500 text-white' : 
                  'bg-gray-600 text-gray-300'}
              `}>
                {step < currentStep ? <FaCheck className="text-xs" /> : step}
              </div>
              {step < 4 && (
                <div className={`
                  w-12 h-1 mx-2 transition-all duration-200
                  ${step < currentStep ? 'bg-green-500' : 'bg-gray-600'}
                `}></div>
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {errors.auth && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{errors.auth}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Name */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.firstname ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your first name"
                />
                {validationErrors.firstname && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.firstname}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.lastname ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your last name"
                />
                {validationErrors.lastname && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.lastname}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.username ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Choose a username"
                />
                {validationErrors.username && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
                {validationErrors.email && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  id="phonenumber"
                  name="phonenumber"
                  type="tel"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.phonenumber ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your phone number"
                />
                {validationErrors.phonenumber && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.phonenumber}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Password */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {confirmPasswordVisible ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Identity Selection */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Choose Your Identity
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "artist", label: "Artist", icon: "🎤" },
                    { value: "producer", label: "Producer", icon: "🎧" },
                    { value: "record_label", label: "Record Label", icon: "🏢" },
                    { value: "fans", label: "Fan", icon: "❤️" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, identity: option.value }));
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.identity;
                          return newErrors;
                        });
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.identity === option.value
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:text-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
                {validationErrors.identity && (
                  <p className="text-red-400 text-sm mt-2">{validationErrors.identity}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Sign in
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

export default ImprovedSignup; 