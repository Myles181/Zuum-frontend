import React, { useState } from 'react';
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from '../../components/getStarted/Footer';
import { Link } from 'react-router-dom';


const ResetPassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = (setVisible) => {
    setVisible(!setVisible);
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
          <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password?</h2>
          <form className="login-form">
            <div className="input-wrapper relative mb-4">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="New Password"
                id="password"
                className="input-feild w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:border-blue-500"
                required
              />
              <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <button
                type="button"
                className="password-toggle absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                onClick={() => togglePasswordVisibility(setPasswordVisible)}
              >
                <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div className="input-wrapper relative mb-4">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder="Confirm Password"
                id="confirmPassword"
                className="input-feild w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <button
                type="button"
                className="password-toggle absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                onClick={() => togglePasswordVisibility(setConfirmPasswordVisible)}
              >
                <i className={`fas ${confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <button className="reset-password w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-300">Reset</button>
            <p className="signup-text text-center mt-4 text-white">
              Don't have an account?
              <Link to="/signup" className="text-blue-500 hover:underline"> Sign up</Link>
             
            </p>
          </form>
        </div>
      </div>
     <Footers />
    </div>
  );
};

export default ResetPassword;