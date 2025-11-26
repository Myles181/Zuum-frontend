import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from "../../components/getStarted/Footer";
import { useForgotPassword } from "../../../Hooks/auth/useLogin";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { loading, error, success, forgotPassword } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    await forgotPassword(email);
  };

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

  return (
    <div 
      className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url(${a})`,
        ...darkModeStyles
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div 
          className="max-w-lg w-full rounded-lg p-6 shadow-lg"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid #374151'
          }}
        >
          <div className="flex items-center justify-center mb-6">
            <img src={b} alt="Logo" className="w-24 h-auto" />
          </div>
          <h2 
            className="text-2xl font-bold text-center mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Forgot Password
          </h2>

          {/* Error Message */}
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {/* Success Message */}
          {success && (
            <p className="text-green-400 text-center mb-4">
              Password reset link sent to your email. Please check your inbox.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2D8C72] transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: '#374151',
                  color: 'var(--color-text-primary)'
                }}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2D8C72] text-white font-bold py-2 rounded-lg hover:bg-[#248066] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Back to Login and Reset Password Links */}
            <p 
              className="text-center mt-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <span>Reset your password </span>
              <Link to="/reset" className="text-[#2D8C72] hover:underline hover:text-[#34A085] transition-colors duration-300">
                Reset
              </Link>
              <span> or </span>
              <Link to="/login" className="text-[#2D8C72] hover:underline hover:text-[#34A085] transition-colors duration-300">
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