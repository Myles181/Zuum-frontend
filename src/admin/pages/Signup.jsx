import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from "../../components/getStarted/Footer";
import { useAdminSignup } from "../hooks/useAdminSignup";

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signup, isLoading, error, isSuccess, otpSent } = useAdminSignup();
  const navigate = useNavigate();

  // Redirect to verify page with email when OTP is sent
  useEffect(() => {
    if (isSuccess && otpSent) {
      navigate('/adver', { 
        state: { email: formData.email } 
      });
    }
  }, [isSuccess, otpSent, formData.email, navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Registration</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {isSuccess && otpSent && (
            <p className="text-green-500 text-center mb-4">
              Redirecting to verification...
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="username"
                type="text"
                placeholder="Admin Username"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="Admin Email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div className="relative mb-6">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D8C72] text-white font-bold py-2 rounded-lg transition duration-300 hover:bg-[#1e6b5a]"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register Admin"}
            </button>

            <p className="text-white text-center mt-4">
              Already have an account?{' '}
              <Link to="/adlog" className="text-[#2D8C72] hover:underline">
                Admin Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default AdminSignup;