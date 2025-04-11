import React, { useState } from 'react';
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from '../../components/getStarted/Footer';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useResetPassword } from "../../../Hooks/auth/useLogin"; // Ensure correct import path

const ResetPassword = () => {
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const { ResetPassword, isLoading, error, success } = useResetPassword(); // Hook for resetting password

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
        backgroundImage: `linear-gradient(rgba(18, 121, 155, 0.89), rgba(18, 101, 180, 0.89)), url(${a})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <img src={b} alt="Logo" className="w-24 h-auto" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">Reset Password</h2>

          {success ? (
            <p className="text-green-500 text-center mb-4">Password reset successful! <Link to="/login" className="underline">Login</Link></p>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-wrapper relative mb-4">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-feild w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="password-toggle absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              <div className="input-wrapper relative mb-4">
                <input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-feild w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="password-toggle absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                  <i className={`fas ${confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <button
                type="submit"
                className="reset-password w-full bg-[#2D8C72] text-white font-bold py-2 rounded-lg  transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              <p className="signup-text text-center mt-4 text-white">
                Don't have an account?
                <Link to="/signup" className="text-[#2D8C72] hover:underline"> Sign up</Link>
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
