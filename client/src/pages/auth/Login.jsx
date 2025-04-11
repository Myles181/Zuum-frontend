import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import a from "../../assets/public/Group 14.png";
import b from "../../assets/public/logo.png";
import c from "../../assets/public/google.png";
import d from "../../assets/public/facebooklogo.png";
import Footers from "../../components/getStarted/Footer";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../contexts/AuthContexts";

const Login = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const { token, loading, error, login } = useAuth(); // Destructure token from useAuth
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const navigate = useNavigate(); // Initialize useNavigate

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare credentials for login
    const credentials = {
      email,
      password,
    };

    // Call the login function from the hook
    await login(credentials);
  };

  // Redirect to the home page if login is successful
  useEffect(() => {
    if (token) {
      navigate("/home"); // Redirect to the home page
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".fade-in");
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          element.classList.add("show");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
          <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none bg-white focus:border-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
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

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input type="checkbox" id="rememberMe" className="h-5 w-5 text-[#2D8C72]" />
                <label htmlFor="rememberMe" className="ml-2 text-gray-300">
                  Remember me
                </label>
              </div>
              <Link to="/forgot" className="text-[#2D8C72] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#2D8C72] text-white font-bold py-2 rounded-lg  transition duration-300"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            {/* Separator */}
            <p className="separator text-center my-4">
              <span className="relative px-4 text-white">or continue with</span>
            </p>

            {/* Social Login Buttons */}
            <div className="social-login flex justify-center ">
              <button className="social-button w-full mx-15 flex items-center justify-center bg-[#2D8C72] text-white py-2 px-4 rounded-lg  transition duration-300">
              <FcGoogle className="w-6 h-6 mr-2" /> Google
              </button>
             
            </div>

            {/* Signup Link */}
            <p className="text-white text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#2D8C72] hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-white text-center mt-4">
              Verify your account{" "}
              <Link to="/verify" className="text-[#2D8C72] hover:underline">
                Verify
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default Login;