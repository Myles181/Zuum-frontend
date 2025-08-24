import React, { useState, useEffect } from 'react';
import { Play, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Loader, Check } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import a from '../../assets/image/Group 4.png';
import useSignup from '../../../Hooks/auth/useSignup';

const ZuumSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Use the signup hook
  const { loading, error, signup } = useSignup();
  
  // Get identity from URL parameters and format it properly
  const identityFromURL = searchParams.get('identity');
  const formattedIdentity = identityFromURL 
    ? identityFromURL.split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
    : "Artist";

  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    identity: formattedIdentity, // Set from URL parameter
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    // Use the signup hook
    const success = await signup(formData);
    
    if (success) {
      // Navigate to OTP verification page on success
      navigate('/verify', { 
        state: { email: formData.email } 
      });
    }
  };

  // Handle Google Signup
  const handleGoogleSignup = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  // Step images matching onboarding style
  const stepImages = [
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop&auto=format",
    "https://informareonline.com/wp-content/uploads/2023/03/230212_Il-fascino-del-vinile-3.webp",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop&auto=format"
  ];

  const steps = [
    { title: "Personal Information", description: "Tell us about yourself to get started" },
    { title: "Account Details", description: "Set up your login credentials" },
    { title: "Security Setup", description: "Create a secure password" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
      <div className="w-full max-w-sm bg-white overflow-hidden flex flex-col">
        
        {/* Header with Logo */}
           <div className="m-5 absolute z-10 transition-all duration-700 ease-in-out">
        
            <img src={a} className='w-25' alt="Zuum Logo" />
        </div>

        {/* Image Section */}
        <div className="relative h-65 overflow-hidden ">
          <div 
            className={`w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ 
              backgroundImage: `url(${stepImages[currentStep - 1]})`
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/90"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 px-6 py-6 flex flex-col">
          <div className="flex-grow">
            
            {/* Welcome Text */}
            <div className={`text-center mb-6 transition-all duration-600 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                Join as {formData.identity}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Step {currentStep} of 3 - {steps[currentStep - 1].description}
              </p>
            </div>

            {/* Display error message if any */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form Content */}
            <div className={`space-y-4 transition-all duration-700 ease-out delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        id="firstname"
                        placeholder="Enter your first name"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Middle Name</label>
                      <input
                        type="text"
                        id="middlename"
                        placeholder="Enter your middle name (optional)"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                        value={formData.middlename}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        id="lastname"
                        placeholder="Enter your last name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                    </div>
                  </div>
                )}

                {/* Step 2: Account Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Username *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="username"
                          placeholder="Choose a username"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phonenumber"
                          placeholder="Enter your phone number"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                          value={formData.phonenumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {errors.phonenumber && <p className="text-red-500 text-xs mt-1">{errors.phonenumber}</p>}
                    </div>
                  </div>
                )}

                {/* Step 3: Security */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={passwordVisible ? "text" : "password"}
                          id="password"
                          placeholder="Create a strong password"
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => togglePasswordVisibility("password")}
                        >
                          {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={confirmPasswordVisible ? "text" : "password"}
                          id="confirmPassword"
                          placeholder="Confirm your password"
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => togglePasswordVisibility("confirmPassword")}
                        >
                          {confirmPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-4 h-4 text-[#2D8C72] bg-gray-100 border-gray-300 rounded focus:ring-[#2D8C72] focus:ring-2"
                        required
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                        I agree to the terms and conditions
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6 space-x-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-medium transition-all duration-300 hover:bg-gray-50 flex items-center justify-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className={`py-3 bg-[#2D8C72] hover:bg-[#248066] text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center ${currentStep === 1 ? 'w-full' : 'flex-1'}`}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-[#2D8C72] hover:bg-[#248066] text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Account
                          <Check className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>

              {/* Google Signup Button */}
              {currentStep === 1 && (
                <div className="mt-4">
                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-600 text-sm">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full mt-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-2xl font-medium transition-all duration-300 hover:bg-gray-50 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-[#2D8C72] hover:text-[#248066] font-medium transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZuumSignup;