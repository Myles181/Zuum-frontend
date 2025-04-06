import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from "../../components/getStarted/Footer";
import { useForgotPassword } from "../../../Hooks/auth/useLogin"; // Import the useForgotPassword hook

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // State for email input
  const navigate = useNavigate(); // Initialize useNavigate

  const { loading, error, success, forgotPassword } = useForgotPassword(); // Use the useForgotPassword hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email input
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    // Call the forgotPassword function with the email
    await forgotPassword(email);
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      style={{ backgroundImage: `linear-gradient(rgba(18, 121, 155, 0.89), rgba(18, 101, 180, 0.89)), url(${a})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <img src={b} alt="Logo" className="w-24 h-auto" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password</h2>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Success Message */}
          {success && (
            <p className="text-green-500 text-center mb-4">
              Password reset link sent to your email. Please check your inbox.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Back to Login and Reset Password Links */}
            <p className="text-white text-center mt-4">
              <span>Reset your password </span>
              <Link to="/reset" className="text-blue-500 hover:underline">
                Reset
              </Link>
              <span> or </span>
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default ForgotPassword;