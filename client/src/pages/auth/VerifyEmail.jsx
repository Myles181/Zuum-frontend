import React, { useState, useEffect } from "react";
import { FaEnvelope, FaKey, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useVerifyEmail, useResendOtp } from "../../../Hooks/auth/useSignup";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [isFocused, setIsFocused] = useState({ otp: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { loading: verifyLoading, error: verifyError, success: verifySuccess, verifyEmail } = useVerifyEmail();
  const { loading: resendLoading, error: resendError, success: resendSuccess, resendOtp } = useResendOtp();

  // Get email from location state (passed from signup page)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    
    // Alternatively, check URL params if email was passed that way
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ( !otp) {
      return;
    }

    setIsSubmitting(true);
    await verifyEmail({ email, otp });
    setIsSubmitting(false);
  };

  const handleResendOTP = async () => {
    
    await resendOtp({ email });
  };

  useEffect(() => {
    if (verifySuccess) {
      setTimeout(() => {
        navigate("/login", { state: { email } });
      }, 2000);
    }
  }, [verifySuccess, navigate, email]);

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm h-screen max-h-screen bg-white shadow-xl overflow-hidden flex flex-col">
        
        {/* Image Section - Top Half */}
        <div className="relative h-2/5 overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop&auto=format)`
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/80"></div>
          </div>
        </div>

        {/* Content Section - Bottom Half */}
        <div className="flex-1 px-6 py-6 flex flex-col justify-between">
          <div className="flex-grow flex flex-col justify-center">
            
            {/* Welcome Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                Verify Your Email
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter the verification code sent to your email
              </p>
              {email && (
                <p className="text-[#2D8C72] text-sm font-medium mt-2">
                  {email}
                </p>
              )}
            </div>

            {/* Error Messages */}
            {verifyError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{verifyError}</p>
              </div>
            )}

            {resendError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{resendError}</p>
              </div>
            )}

            {/* Success Message */}
            {resendSuccess && (
              <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-xl">
                <div className="flex items-center justify-center">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  <p className="text-green-700 text-sm">OTP sent successfully!</p>
                </div>
              </div>
            )}

            {verifySuccess && (
              <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-xl">
                <div className="flex items-center justify-center">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  <p className="text-green-700 text-sm">Email verified successfully! Redirecting...</p>
                </div>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* OTP Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2D8C72] focus:border-transparent transition-all duration-300"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onFocus={() => setIsFocused({ ...isFocused, otp: true })}
                    onBlur={() => setIsFocused({ ...isFocused, otp: false })}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={verifyLoading || isSubmitting || !otp || otp.length !== 6}
                className="w-full py-3 bg-[#2D8C72] hover:bg-[#248066] disabled:bg-gray-400 text-white rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center">
                  {verifyLoading || isSubmitting ? (
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
              <p className="text-gray-600 text-sm mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={resendLoading }
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
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <Link 
                to="/login" 
                className="text-[#2D8C72] hover:text-[#248066] font-medium transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
            <p className="text-gray-500 text-xs">
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