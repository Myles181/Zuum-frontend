import React, { useState } from "react";
import { FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from "../../components/getStarted/Footer";
import { useVerifyEmail } from "../hooks/useAdminSignup";


const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { verifyEmail, isLoading, error, isVerified } = useVerifyEmail();
  
  // Get email from location state or default to empty string
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyEmail({ email, otp });
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      style={{ backgroundImage: `linear-gradient(rgba(18,121,155,0.89),rgba(18,101,180,0.89)), url(${a})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <img src={b} alt="Logo" className="w-24 h-auto" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">Verify Your Email</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {isVerified && (
            <p className="text-green-500 text-center mb-4">
              Email verified successfully!
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field (read-only) */}
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
              />
            </div>

            {/* OTP Field */}
            <div className="relative mb-4">
              <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter OTP Code"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D8C72] text-white font-bold py-2 rounded-lg transition duration-300"
              disabled={isLoading || isVerified}
            >
              {isLoading ? "Verifying..." : isVerified ? "Verified!" : "Verify Email"}
            </button>

            <p className="text-white text-center mt-4">
              Didn't receive code?{' '}
              <button 
                type="button" 
                className="text-[#2D8C72] hover:underline"
                // Add resend OTP functionality here
              >
                Resend OTP
              </button>
            </p>

            <p className="text-white text-center mt-4">
              Need to change email?{' '}
              <Link to="/admin/signup" className="text-[#2D8C72] hover:underline">
                Register Again
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default VerifyEmail;