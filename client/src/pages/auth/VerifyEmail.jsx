import React, { useState, useEffect } from "react";
import { FaEnvelope, FaKey, FaSpinner, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from "../../components/getStarted/Footer";
import { useVerifyEmail, useResendOtp } from "../../../Hooks/auth/useSignup";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isFocused, setIsFocused] = useState({ email: false, otp: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { loading: verifyLoading, error: verifyError, success: verifySuccess, verifyEmail } = useVerifyEmail();
  const { loading: resendLoading, error: resendError, success: resendSuccess, resendOtp } = useResendOtp();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      alert("Please enter both email and OTP.");
      return;
    }

    setIsSubmitting(true);
    await verifyEmail(email, otp);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (verifySuccess) {
      navigate("/login");
    }
  }, [verifySuccess, navigate]);

  const handleResendOtp = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    await resendOtp(email);
  };

  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll(".fade-in").forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) el.classList.add("show");
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(18,121,155,0.95), rgba(18,101,180,0.95)), url(${a})`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8 fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img src={b} alt="Logo" className="w-20 h-auto drop-shadow-lg" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-white/80 text-sm">
              Enter the verification code sent to your email
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 fade-in">
            {/* Error Messages */}
            {verifyError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm text-center">{verifyError}</p>
              </div>
            )}

            {resendError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm text-center">{resendError}</p>
              </div>
            )}

            {/* Success Message */}
            {resendSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-center">
                  <FaCheckCircle className="text-green-400 mr-2" />
                  <p className="text-green-200 text-sm">OTP resent successfully!</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <FaEnvelope className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused({ ...isFocused, email: true })}
                      onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    />
                  </div>
                </div>
              </div>

              {/* OTP Field */}
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium">
                  Verification Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2D8C72] to-[#246d59] rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <FaKey className="absolute left-4 text-white/60 group-focus-within:text-[#2D8C72] transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#2D8C72] focus:bg-white/15 transition-all duration-300"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      onFocus={() => setIsFocused({ ...isFocused, otp: true })}
                      onBlur={() => setIsFocused({ ...isFocused, otp: false })}
                    />
                  </div>
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={verifyLoading || resendLoading || isSubmitting}
                className="w-full bg-gradient-to-r from-[#2D8C72] to-[#246d59] text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#246d59] to-[#2D8C72] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  {verifyLoading || isSubmitting ? (
                    <>
                      <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
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
              <p className="text-white/80 text-sm mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-[#2D8C72] hover:text-[#246d59] font-medium transition-colors duration-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto group"
              >
                {resendLoading ? (
                  <>
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Verification Code"
                )}
              </button>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-white/80 text-sm">
                Remember your password?{" "}
                <Link 
                  to="/login" 
                  className="text-[#2D8C72] hover:text-[#246d59] font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-white/60 text-sm">
                Need to create an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-[#2D8C72] hover:text-[#246d59] font-medium transition-colors duration-300 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default VerifyOTP;