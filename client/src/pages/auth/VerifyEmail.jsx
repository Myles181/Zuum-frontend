import React from 'react';
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from '../../components/getStarted/Footer';
import { Link } from 'react-router-dom';


const VerifyOTP = () => {
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
          <form className="login-form">
            <div className="input-wrapper relative mb-4">
              <input
                type="text"
                placeholder="OTP"
                id="otp"
                className="input-feild w-full px-4 bg-white py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <i className="fas fa-key absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <button className="login-button resend-otp w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-300">Verify OTP</button>
            <p className="signup-text text-center text-white mt-4">
              Didn't receive email?
              <Link to="/resendemailotp" className="text-blue-500 hover:underline">Resend OTP</Link>
               
            </p>
          </form>
        </div>
      </div>
     <Footers />
    </div>
  );
};

export default VerifyOTP;