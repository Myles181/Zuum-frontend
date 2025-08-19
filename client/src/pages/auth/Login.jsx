import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import a from '../../assets/image/Group 4.png'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm h-screen max-h-screen bg-white shadow-xl overflow-hidden flex flex-col">
        
        {/* Header with Logo - Fixed positioning */}
        <div className="absolute top-6 z-20 flex justify-center">
          <div className={`transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            <img src={a} className="w-25 mx-5" alt="Zuum Logo" />
          </div>
        </div>

        {/* Image Section - Top Half */}
        <div className="relative h-[38vh] overflow-hidden">
          <div 
            className={`w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format)`
            }}
          >
            {/* Lighter gradient overlay to not obscure logo */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/80"></div>
          </div>
        </div>

        {/* Content Section - Bottom Half */}
        <div className="flex-1 px-6 py-6 flex flex-col justify-between">
          <div className="flex-grow">
            
            {/* Welcome Text */}
            <div className={`text-center mb-6 transition-all duration-600 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sign in to your account to continue
              </p>
            </div>

            {/* Login Fields */}
            <div className={`space-y-4 transition-all duration-700 ease-out delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              
              {/* Email Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className={`h-4 w-4 transition-colors duration-300 ${
                    isFocused.email ? 'text-[#2D8C72]' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  onBlur={() => setIsFocused({ ...isFocused, email: false })}
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className={`h-4 w-4 transition-colors duration-300 ${
                    isFocused.password ? 'text-[#2D8C72]' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group" onClick={() => setRememberMe(!rememberMe)}>
                  <div className="relative">
                    <div className={`w-4 h-4 border-2 rounded transition-all duration-300 flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-[#2D8C72] border-[#2D8C72]' 
                        : 'border-gray-300 group-hover:border-[#2D8C72]'
                    }`}>
                      {rememberMe && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                    Remember me
                  </span>
                </label>
                <a 
                  href="/forgot" 
                  className="text-[#2D8C72] hover:text-[#248066] transition-colors duration-300 font-medium"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <div className={`space-y-3 mt-6 transition-all duration-500 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            
            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full py-3 bg-[#2D8C72] hover:bg-[#248066] disabled:bg-gray-400 text-white rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-gray-500 text-xs">or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Sign In */}
            <button 
              type="button"
              className="w-full py-3 bg-transparent border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-base transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <a 
                  href="/signup" 
                  className="text-[#2D8C72] hover:text-[#248066] font-semibold transition-colors duration-300"
                >
                  Sign up
                </a>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Need to verify your account?{' '}
                <a 
                  href="/verify" 
                  className="text-[#2D8C72] hover:text-[#248066] transition-colors duration-300"
                >
                  Verify here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;