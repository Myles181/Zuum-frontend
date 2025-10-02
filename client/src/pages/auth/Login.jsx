import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import a from '../../assets/image/Group 4.png';
import { useAuth } from "../../contexts/AuthContexts";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { isAuthenticated, loading, error, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Dark mode styles
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  // Handle form submission
 const [localError, setLocalError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !password) return;

  setIsSubmitting(true);
  setLocalError(null); // reset error

  const credentials = { email, password, rememberMe };
  const result = await login(credentials);

  if (result.success) {
    navigate('/home');
  } else if (result.errorCode === 406) {
    navigate('/verify', { state: { email } });
  } 
  else if (result.errorCode === 401) {
    setLocalError("invalid Credentials" );
  } else {
    setLocalError(error.message );
  }

  setIsSubmitting(false);
};



  // useEffect(() => {
  //   if (isAuthenticated && hasAttemptedLogin) {
  //     navigate('/home');
  //   }
  // }, [isAuthenticated, hasAttemptedLogin, navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        backgroundColor: 'var(--color-bg-secondary)',
        ...darkModeStyles
      }}
    >
      <div 
        className="w-full max-w-sm overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: 'var(--color-bg-primary)',
        }}
      >
        
        {/* Header with Logo */}
        <div className="m-5 absolute z-10 transition-all duration-700 ease-in-out">
          <img src={a} className='w-25' alt="Zuum Logo" />
        </div>

        {/* Image Section - Top Half */}
        <div className="relative h-65 overflow-hidden">
          <div 
            className={`w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format)`
            }}
          >
            {/* Dark mode gradient overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 50%, var(--color-bg-primary) 100%)'
              }}
            ></div>
          </div>
        </div>

        {/* Content Section - Bottom Half */}
        <div className="flex-1 px-6 py-6 flex flex-col justify-between">
          <div className="flex-grow">
            
            {/* Welcome Text */}
            <div className={`text-center mb-6 transition-all duration-600 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h2 
                className="text-2xl font-bold mb-2 leading-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Welcome Back
              </h2>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {localError && (
              <div 
                className="mb-4 p-3 rounded-lg text-sm transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  color: '#f87171'
                }}
              >
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                    className="w-full pl-10 pr-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: isFocused.email ? '#2D8C72' : '#374151',
                      color: 'var(--color-text-primary)'
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    disabled={loading}
                    required
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
                    className="w-full pl-10 pr-12 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: isFocused.password ? '#2D8C72' : '#374151',
                      color: 'var(--color-text-primary)'
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-300 focus:outline-none"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                  >
                    {passwordVisible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div className={`w-4 h-4 border-2 rounded transition-all duration-300 flex items-center justify-center ${
                        rememberMe 
                          ? 'bg-[#2D8C72] border-[#2D8C72]' 
                          : 'border-gray-500 group-hover:border-[#2D8C72]'
                      } ${loading ? 'opacity-50' : ''}`}>
                        {rememberMe && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span 
                      className={`ml-2 transition-colors duration-300 group-hover:text-gray-300 ${loading ? 'opacity-50' : ''}`}
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Remember me
                    </span>
                  </label>
                  <Link 
                    to="/forgot" 
                    className={`text-[#2D8C72] hover:text-[#248066] transition-colors duration-300 font-medium ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Buttons Section */}
              <div className={`space-y-3 mt-6 transition-all duration-500 ease-out delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                
                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={ isSubmitting}
                  className="w-full py-3 bg-[#2D8C72] hover:bg-[#248066] disabled:bg-gray-600 text-white rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center">
                    {loading ? (
                      <>
                        <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* OAuth and Sign Up Section */}
          <div className="mt-4">
            {/* Divider */}
            <div className="flex items-center my-4">
              <div 
                className="flex-1 border-t"
                style={{ borderColor: '#374151' }}
              ></div>
              <span 
                className="px-3 text-xs"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                or continue with
              </span>
              <div 
                className="flex-1 border-t"
                style={{ borderColor: '#374151' }}
              ></div>
            </div>

            {/* Google Sign In */}
            <button 
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-transparent border-2 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              style={{
                borderColor: '#374151',
                color: 'var(--color-text-primary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.1)';
                e.target.style.borderColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#374151';
              }}
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Don't have an account?{' '}
                <Link 
                  to="/start" 
                  className="text-[#2D8C72] hover:text-[#248066] font-semibold transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;