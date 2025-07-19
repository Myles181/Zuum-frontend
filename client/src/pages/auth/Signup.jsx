import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaSpinner, FaCheck } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import { useSignup } from "../../../Hooks/auth/useSignup";
import useGoogleAuth from "../../../Hooks/auth/useGoogleAuth";

function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    identity: "",
  });
  const [errors, setErrors] = useState({});

  const [searchParams] = useSearchParams();
  const identity = searchParams.get("identity");
  const navigate = useNavigate();

  const { loading, error, signup } = useSignup();
  const { loading: googleLoading, authenticateWithGoogle } = useGoogleAuth();

  useEffect(() => {
    if (identity) {
      setFormData(prevData => ({
        ...prevData,
        identity: identity.replace(/-/g, " "),
      }));
    }
  }, [identity]);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
      if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    }
    
    if (step === 2) {
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phonenumber.trim()) {
        newErrors.phonenumber = "Phone number is required";
      } else if (!/^[0-9]{10,15}$/.test(formData.phonenumber)) {
        newErrors.phonenumber = "Invalid phone number";
      }
    }
    
    if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    const success = await signup(formData);
    setIsSubmitting(false);
    
    if (success) {
      navigate("/verify");
    }
  };
  
  const handleGoogleAuth = () => {
    authenticateWithGoogle();
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Personal Info", icon: <FaUser /> },
      { number: 2, title: "Account Details", icon: <FaEnvelope /> },
      { number: 3, title: "Security", icon: <FaLock /> }
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStep === step.number 
                    ? "bg-gradient-to-r from-[#2D8C72] to-[#246d59] text-white shadow-lg scale-110" 
                    : currentStep > step.number 
                    ? "bg-[#2D8C72] text-white" 
                    : "bg-white/20 text-white/60 border-2 border-white/30"
                }`}>
                  {currentStep > step.number ? (
                    <FaCheck className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span className={`text-xs mt-2 text-center transition-colors duration-300 ${
                  currentStep >= step.number ? "text-white" : "text-white/60"
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 w-16 mx-4 transition-all duration-500 ${
                  currentStep > step.number ? "bg-gradient-to-r from-[#2D8C72] to-[#246d59]" : "bg-white/20"
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNameStep = () => {
    return (
      <div className="transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
          <p className="text-white/70 text-sm">Tell us about yourself</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-white/90 text-sm font-medium">First Name *</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
              <input
                type="text"
                placeholder="Enter your first name"
                id="firstname"
                className="relative w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                required
                value={formData.firstname}
                onChange={handleInputChange}
              />
            </div>
            {errors.firstname && <p className="text-red-300 text-sm mt-1">{errors.firstname}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-white/90 text-sm font-medium">Middle Name</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
              <input
                type="text"
                placeholder="Enter your middle name (optional)"
                id="middlename"
                className="relative w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                value={formData.middlename}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-white/90 text-sm font-medium">Last Name *</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
              <input
                type="text"
                placeholder="Enter your last name"
                id="lastname"
                className="relative w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                required
                value={formData.lastname}
                onChange={handleInputChange}
              />
            </div>
            {errors.lastname && <p className="text-red-300 text-sm mt-1">{errors.lastname}</p>}
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={nextStep}
            className="bg-gradient-to-r from-[#2D8C72] to-[#246d59] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center group"
          >
            <span>Next Step</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    );
  };

  const renderDetailsStep = () => {
    return (
      <div className="transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Account Details</h2>
          <p className="text-white/70 text-sm">Set up your account credentials</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-white/90 text-sm font-medium">Username *</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <FaUser className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Choose a username"
                  id="username"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {errors.username && <p className="text-red-300 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-white/90 text-sm font-medium">Email Address *</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  id="email"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-white/90 text-sm font-medium">Phone Number *</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <FaPhone className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  id="phonenumber"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                  required
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {errors.phonenumber && <p className="text-red-300 text-sm mt-1">{errors.phonenumber}</p>}
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="bg-gradient-to-r from-[#2D8C72] to-[#246d59] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center group"
          >
            <span>Next Step</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    );
  };

  const renderPasswordStep = () => {
    return (
      <div className="transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Set Password</h2>
          <p className="text-white/70 text-sm">Create a secure password for your account</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-white/90 text-sm font-medium">Password *</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <FaLock className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Create a strong password"
                  id="password"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-4 text-white/60 hover:text-white transition-colors duration-300 focus:outline-none"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-white/90 text-sm font-medium">Confirm Password *</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <FaLock className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  id="confirmPassword"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-4 text-white/60 hover:text-white transition-colors duration-300 focus:outline-none"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {errors.confirmPassword && <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center mt-6">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white/40 rounded peer-checked:bg-[#2D8C72] peer-checked:border-[#2D8C72] transition-all duration-300 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <span className="ml-3 text-white/80 text-sm group-hover:text-white transition-colors duration-300">
                I agree to the terms and conditions
              </span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Previous</span>
          </button>
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="bg-gradient-to-r from-[#2D8C72] to-[#246d59] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center group"
          >
            {loading || isSubmitting ? (
              <>
                <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <span>Create Account</span>
                <FaCheck className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(18, 121, 155, 0.95), rgba(18, 101, 180, 0.95)), url(${a})`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-10 px-4">
        <div className="w-full max-w-lg">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img src={b} alt="Logo" className="w-20 h-auto drop-shadow-lg" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Join as {formData.identity || "User"}
            </h1>
            <p className="text-white/80 text-sm">
              Create your account in just a few steps
            </p>
          </div>
          
          {/* Step Indicator */}
          {renderStepIndicator()}
          
          {/* Main Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="w-full relative overflow-hidden">
              {currentStep === 1 && renderNameStep()}
              {currentStep === 2 && renderDetailsStep()}
              {currentStep === 3 && renderPasswordStep()}
            </form>

            {/* Google Sign Up - Only show on last step */}
            {currentStep === 3 && (
              <>
                <div className="flex items-center my-8">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-4 text-white/60 text-sm">or continue with</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>

                <button
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center group"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading}
                >
                  <FcGoogle className="w-5 h-5 mr-3" />
                  <span className="group-hover:text-white/90 transition-colors duration-300">
                    {googleLoading ? "Signing up..." : "Sign up with Google"}
                  </span>
                </button>
              </>
            )}

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-[#2D8C72] hover:text-[#246d59] font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;