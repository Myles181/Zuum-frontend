import React, { useState } from 'react';
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from '../../components/getStarted/Footer';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useResetPassword } from "../../../Hooks/auth/useLogin";
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const { ResetPassword, isLoading, error, success } = useResetPassword();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(token);
    await ResetPassword(token, newPassword);
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
            Reset Password
          </h2>

          {success ? (
            <p 
              className="text-center mb-4"
              style={{ color: '#34d399' }}
            >
              Password reset successful!{' '}
              <Link 
                to="/login" 
                className="text-[#2D8C72] hover:text-[#34A085] underline transition-colors duration-300"
              >
                Login
              </Link>
            </p>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[#2D8C72] transition-colors duration-300"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: '#374151',
                    color: 'var(--color-text-primary)'
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 focus:outline-none"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[#2D8C72] transition-colors duration-300"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: '#374151',
                    color: 'var(--color-text-primary)'
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 focus:outline-none"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                  {confirmPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <p 
                  className="text-center mb-4"
                  style={{ color: '#f87171' }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#2D8C72] hover:bg-[#248066] text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                style={{ backgroundColor: '#2D8C72' }}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              <p 
                className="text-center mt-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Don't have an account?
                <Link 
                  to="/signup" 
                  className="text-[#2D8C72] hover:text-[#34A085] hover:underline transition-colors duration-300 ml-1"
                >
                  Sign up
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default ResetPassword;