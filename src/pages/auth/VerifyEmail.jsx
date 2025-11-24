import React, { useState, useEffect } from "react";
import { FaEnvelope, FaKey, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useResendOtp, useVerifyEmail } from "../../../Hooks/auth/useSignup";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [isFocused, setIsFocused] = useState({ otp: false });
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Use both hooks
  const { loading: verifyLoading, error: verifyError, success: verifySuccess, verifyEmail } = useVerifyEmail();
  const { loading: resendLoading, error: resendError, success: resendSuccess, resendOtp } = useResendOtp();

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

  // Get email from location state or URL params
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      return;
    }

    await verifyEmail(email, otp);
  };

  const handleResendOTP = async () => {
    await resendOtp(email);
  };

  useEffect(() => {
    if (verifySuccess) {
      setTimeout(() => {
        navigate("/login", { state: { email } });
      }, 2000);
    }
  }, [verifySuccess, navigate, email]);

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
        
        {/* Image Section - Top Half */}
        <div className="relative h-2/5 overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop&auto=format)`
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
          <div className="flex-grow flex flex-col justify-center">
            
            {/* Welcome Text */}
            <div className="text-center mb-6">
              <h2 
                className="text-2xl font-bold mb-2 leading-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Verify Your Email
              </h2>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Enter the verification code sent to your email
              </p>
              {email && (
                <p 
                  className="text-sm font-medium mt-2"
                  style={{ color: '#2D8C72' }}
                >
                  {email}
                </p>
              )}
            </div>

            {/* Error Messages */}
            {verifyError && (
              <div 
                className="mb-4 p-3 rounded-xl"
                style={{
                  backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.2)'
                }}
              >
                <p 
                  className="text-sm text-center"
                  style={{ color: '#f87171' }}
                >
                  {verifyError}
                </p>
              </div>
            )}

            {resendError && (
              <div 
                className="mb-4 p-3 rounded-xl"
                style={{
                  backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.2)'
                }}
              >
                <p 
                  className="text-sm text-center"
                  style={{ color: '#f87171' }}
                >
                  {resendError}
                </p>
              </div>
            )}

            {/* Success Messages */}
            {resendSuccess && (
              <div 
                className="mb-4 p-3 rounded-xl"
                style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.2)'
                }}
              >
                <div className="flex items-center justify-center">
                  <FaCheckCircle 
                    className="mr-2"
                    style={{ color: '#34d399' }}
                  />
                  <p 
                    className="text-sm"
                    style={{ color: '#34d399' }}
                  >
                    OTP sent successfully!
                  </p>
                </div>
              </div>
            )}

            {verifySuccess && (
              <div 
                className="mb-4 p-3 rounded-xl"
                style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.2)'
                }}
              >
                <div className="flex items-center justify-center">
                  <FaCheckCircle 
                    className="mr-2"
                    style={{ color: '#34d399' }}
                  />
                  <p 
                    className="text-sm"
                    style={{ color: '#34d399' }}
                  >
                    Email verified successfully! Redirecting...
                  </p>
                </div>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* OTP Field */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Verification Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className={`h-4 w-4 transition-colors duration-300 ${
                      isFocused.otp ? 'text-[#2D8C72]' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      borderColor: isFocused.otp ? '#2D8C72' : '#374151',
                      color: 'var(--color-text-primary)'
                    }}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onFocus={() => setIsFocused({ ...isFocused, otp: true })}
                    onBlur={() => setIsFocused({ ...isFocused, otp: false })}
                  />
                </div>
                <p 
                  className="text-xs mt-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={verifyLoading || !otp || otp.length !== 6}
                className="w-full py-3 bg-[#2D8C72] hover:bg-[#248066] disabled:bg-gray-600 text-white rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center">
                  {verifyLoading ? (
                    <>
                      <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </div>
              </button>
            </form>

            {/* Resend OTP Section */}
            <div className="mt-6 text-center">
              <p 
                className="text-sm mb-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="text-[#2D8C72] hover:text-[#248066] font-medium transition-colors duration-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  <>
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin inline" />
                    Resending...
                  </>
                ) : (
                  "Resend Verification Code"
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-center space-y-3">
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Remember your password?{" "}
              <Link 
                to="/login" 
                className="text-[#2D8C72] hover:text-[#248066] font-medium transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
            <p 
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Need to create an account?{" "}
              <Link 
                to="/signup" 
                className="text-[#2D8C72] hover:text-[#248066] transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;