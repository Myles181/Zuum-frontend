import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from "../../components/getStarted/Footer";
import { useVerifyEmail, useResendOtp } from "../../../Hooks/auth/useSignup"; // Import the custom hooks

const VerifyOTP = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [otp, setOtp] = useState(""); // State for OTP input
  const navigate = useNavigate(); // Initialize useNavigate

  const { loading: verifyLoading, error: verifyError, success: verifySuccess, verifyEmail } = useVerifyEmail(); // Use the verifyEmail hook
  const { loading: resendLoading, error: resendError, success: resendSuccess, resendOtp } = useResendOtp(); // Use the resendOtp hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !otp) {
      alert("Please enter both email and OTP.");
      return;
    }

    // Call the verifyEmail function with email and OTP
    await verifyEmail(email, otp);
  };

  // Redirect to the Login page if verification is successful
  useEffect(() => {
    if (verifySuccess) {
      navigate("/login"); // Redirect to the Login page
    }
  }, [verifySuccess, navigate]);

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    // Call the resendOtp function with the email
    await resendOtp(email);
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(18, 121, 155, 0.89), rgba(18, 101, 180, 0.89)), url(${a})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <img src={b} alt="Logo" className="w-24 h-auto" />
          </div>
          <h2 className="form-title text-2xl text-white font-bold text-center mb-6">Verify Email</h2>

          {/* Error Message for Verification */}
          {verifyError && <p className="text-red-500 text-center mb-4">{verifyError}</p>}

          {/* Error Message for Resend OTP */}
          {resendError && <p className="text-red-500 text-center mb-4">{resendError}</p>}

          {/* Success Message for Resend OTP */}
          {resendSuccess && <p className="text-green-500 text-center mb-4">OTP resent successfully!</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="input-wrapper relative mb-4">
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-feild w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* OTP Input */}
            <div className="input-wrapper relative mb-4">
              <input
                type="text"
                placeholder="OTP"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-feild w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <i className="fas fa-key absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="login-button resend-otp w-full bg-[#2D8C72] text-white font-bold py-2 rounded-lg  transition duration-300"
              disabled={verifyLoading || resendLoading} // Disable button while loading
            >
              {verifyLoading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend OTP Link */}
            <p className="signup-text text-center text-white mt-4">
              Didn't receive email?{" "}
              <span
                onClick={handleResendOtp}
                className="text-[#2D8C72] hover:underline cursor-pointer"
              >
                Resend OTP
              </span>
            </p>
          </form>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default VerifyOTP;