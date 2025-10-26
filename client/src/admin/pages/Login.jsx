import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import Footers from "../../components/getStarted/Footer";
import { useAdminLogin } from "../hooks/useAdminLogin";
import { useAdmin } from "../../contexts/AdminContexts";


const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, error, loading, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
    const credentials = { email, username, password };
    document.cookie.split(";").forEach((c) => {
    document.cookie = c
    .replace(/^ +/, "")
    .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    await login(credentials);
    
    };
  
  useEffect(() => {
      if (isAuthenticated) {
        navigate('/users');
      }
    }, [isAuthenticated, navigate]);

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
          <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Login</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {/* {isSuccess && otpSent && (
            <p className="text-green-500 text-center mb-4">
              OTP sent to your email. Please check your inbox.
            </p>
          )} */}

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Admin Username"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Admin Email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Admin Password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input type="checkbox" id="rememberMe" className="h-5 w-5 text-[#2D8C72]" />
                <label htmlFor="rememberMe" className="ml-2 text-gray-300">
                  Remember me
                </label>
              </div>
              <Link to="/admin/forgot-password" className="text-[#2D8C72] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D8C72] text-white font-bold py-2 rounded-lg transition duration-300"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login as Admin"}
            </button>

            <p className="text-white text-center mt-4">
              Regular user?{' '}
              <Link to="/login" className="text-[#2D8C72] hover:underline">
                User Login
              </Link>
            </p>
            
            {/* {otpSent && (
              <p className="text-white text-center mt-4">
                <Link to="/admin/verify-otp" className="text-[#2D8C72] hover:underline">
                  Enter OTP
                </Link>
              </p>
            )} */}
          </form>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default AdminLogin;